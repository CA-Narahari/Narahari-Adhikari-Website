import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/supabase/authorization';

const BUCKETS = new Set(['website-media', 'download-resources']);
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_REQUEST_SIZE = MAX_FILE_SIZE + 1024 * 1024;
const MIME_TYPES_BY_BUCKET: Record<string, Set<string>> = {
  'website-media': new Set([
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]),
  'download-resources': new Set([
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip', 'application/x-zip-compressed',
  ]),
};
const MIME_TYPE_BY_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif',
  pdf: 'application/pdf', doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  zip: 'application/zip',
};
const EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif',
  'application/pdf': 'pdf', 'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/zip': 'zip',
};
const FOLDER_PATTERN = /^(?:[a-z0-9]+(?:[a-z0-9/_-]*[a-z0-9])?)?$/;

function matchesFileSignature(contentType: string, bytes: Uint8Array): boolean {
  const startsWith = (...signature: number[]) => signature.every((value, index) => bytes[index] === value);
  switch (contentType) {
    case 'image/jpeg': return startsWith(0xff, 0xd8, 0xff);
    case 'image/png': return startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
    case 'image/webp': return startsWith(0x52, 0x49, 0x46, 0x46) && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
    case 'image/gif': return startsWith(0x47, 0x49, 0x46, 0x38) && (bytes[4] === 0x37 || bytes[4] === 0x39) && bytes[5] === 0x61;
    case 'application/pdf': return startsWith(0x25, 0x50, 0x44, 0x46, 0x2d);
    case 'application/msword': return startsWith(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1);
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'application/zip':
    case 'application/x-zip-compressed': return startsWith(0x50, 0x4b, 0x03, 0x04) || startsWith(0x50, 0x4b, 0x05, 0x06) || startsWith(0x50, 0x4b, 0x07, 0x08);
    case 'application/vnd.ms-excel': return startsWith(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1);
    default: return false;
  }
}

export async function POST(request: Request) {
  try {
    const access = await requireStaff();
    if (access.response) return access.response;
    const { adminClient } = access;

    const declaredLength = Number(request.headers.get('content-length'));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_SIZE) return NextResponse.json({ error: 'The upload must be under 11 MB.' }, { status: 413 });

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'website-media';
    const folder = ((formData.get('folder') as string) || 'uploads').trim().replace(/^\/+|\/+$/g, '');
    const requestedFilename = formData.get('filename');

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }
    if (!BUCKETS.has(bucket) || !FOLDER_PATTERN.test(folder)) {
      return NextResponse.json({ error: 'The requested storage location is not allowed.' }, { status: 400 });
    }
    const originalExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const contentType = file.type || MIME_TYPE_BY_EXTENSION[originalExtension] || '';
    const extension = EXTENSION_BY_MIME_TYPE[contentType] || originalExtension;
    if (file.size <= 0 || file.size > MAX_FILE_SIZE || !MIME_TYPES_BY_BUCKET[bucket].has(contentType)) {
      const formats = bucket === 'download-resources' ? 'PDF, Word, Excel, or ZIP' : 'an image, PDF, or Word document';
      return NextResponse.json({ error: `Choose ${formats} no larger than 10 MB.` }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    if (!matchesFileSignature(contentType, new Uint8Array(bytes, 0, Math.min(bytes.byteLength, 16)))) {
      return NextResponse.json({ error: 'The uploaded file content does not match its declared type.' }, { status: 400 });
    }
    const buffer = Buffer.from(bytes);

    // Keep the image name chosen in the CMS as the actual Storage object name.
    // The extension always comes from the uploaded file/MIME type.
    const cleanOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    let cleanName = cleanOriginalName;
    if (typeof requestedFilename === 'string' && requestedFilename.trim()) {
      const originalExtension = extension ? `.${extension}` : '';
      const requestedBase = requestedFilename.trim().replace(/\.[^.]+$/, '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const seoBase = requestedBase.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90);
      if (!seoBase) return NextResponse.json({ error: 'Enter a filename using letters or numbers.' }, { status: 400 });
      cleanName = `${seoBase}${originalExtension}`;
    }

    // Preserve the chosen clean name and add a numeric suffix only on collision.
    let storagePath = `${folder}/${cleanName}`;
    let uploadError: { message: string } | null = null;
    for (let attempt = 1; attempt <= 20; attempt += 1) {
      const result = await adminClient.storage.from(bucket).upload(storagePath, buffer, { contentType, upsert: false });
      uploadError = result.error;
      if (!uploadError) break;
      if (!/already exists|duplicate|resource already exists/i.test(uploadError.message) || attempt === 20) break;
      const dot = cleanName.lastIndexOf('.');
      const stem = dot > 0 ? cleanName.slice(0, dot) : cleanName;
      const suffix = dot > 0 ? cleanName.slice(dot) : '';
      cleanName = `${stem}-${attempt + 1}${suffix}`;
      storagePath = `${folder}/${cleanName}`;
    }

    if (uploadError) {
      console.error('CMS storage upload failed', { bucket, code: 'storage_upload_error' });
      return NextResponse.json({ error: 'The file could not be uploaded. Check the storage configuration and try again.' }, { status: 500 });
    }

    const { data: urlData } = bucket === 'website-media' || bucket === 'download-resources'
      ? adminClient.storage.from(bucket).getPublicUrl(storagePath)
      : { data: { publicUrl: null } };

    return NextResponse.json({
      success: true,
      publicUrl: bucket === 'website-media' && ['blog', 'services', 'general', 'announcements', 'careers'].includes(folder)
        ? `/media/${storagePath.split('/').map(encodeURIComponent).join('/')}`
        : urlData.publicUrl,
      path: storagePath,
      bucket,
      filename: cleanName,
      size: file.size,
    });
  } catch (err: unknown) {
    console.error('CMS storage upload failed', err);
    return NextResponse.json({ error: 'The file could not be uploaded. Please try again.' }, { status: 500 });
  }
}
