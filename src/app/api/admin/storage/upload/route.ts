import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/supabase/authorization';

const BUCKETS = new Set(['website-media', 'download-resources']);
const MAX_FILE_SIZE = 10 * 1024 * 1024;
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
const FOLDER_PATTERN = /^(?:[a-z0-9]+(?:[a-z0-9/_-]*[a-z0-9])?)?$/;

export async function POST(request: Request) {
  try {
    const access = await requireStaff();
    if (access.response) return access.response;
    const { adminClient } = access;

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'website-media';
    const folder = ((formData.get('folder') as string) || 'uploads').trim().replace(/^\/+|\/+$/g, '');

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }
    if (!BUCKETS.has(bucket) || !FOLDER_PATTERN.test(folder)) {
      return NextResponse.json({ error: 'The requested storage location is not allowed.' }, { status: 400 });
    }
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const contentType = file.type || MIME_TYPE_BY_EXTENSION[extension] || '';
    if (file.size <= 0 || file.size > MAX_FILE_SIZE || !MIME_TYPES_BY_BUCKET[bucket].has(contentType)) {
      const formats = bucket === 'download-resources' ? 'PDF, Word, Excel, or ZIP' : 'an image, PDF, or Word document';
      return NextResponse.json({ error: `Choose ${formats} no larger than 10 MB.` }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename and make unique
    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${folder}/${timestamp}_${cleanName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await adminClient.storage
      .from(bucket)
      .upload(storagePath, buffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        {
          error: `Failed to upload to bucket "${bucket}": ${uploadError.message}. Make sure the bucket exists in your Supabase dashboard.`,
        },
        { status: 500 }
      );
    }

    const { data: urlData } = bucket === 'website-media' || bucket === 'download-resources'
      ? adminClient.storage.from(bucket).getPublicUrl(storagePath)
      : { data: { publicUrl: null } };

    return NextResponse.json({
      success: true,
      publicUrl: urlData.publicUrl,
      path: storagePath,
      bucket,
      filename: file.name,
      size: file.size,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown storage error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
