import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/supabase/authorization';

const BUCKETS = new Set(['website-media', 'download-resources']);
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']);
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
    if (file.size <= 0 || file.size > MAX_FILE_SIZE || !MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Choose an image or PDF no larger than 10 MB.' }, { status: 400 });
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
        contentType: file.type || 'image/jpeg',
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
