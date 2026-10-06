import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/supabase/authorization';

const BUCKETS = new Set(['website-media', 'download-resources']);

export async function GET(request: Request) {
  try {
    const access = await requireStaff();
    if (access.response) return access.response;
    const { adminClient } = access;

    const { searchParams } = new URL(request.url);
    const bucket = searchParams.get('bucket') || 'website-media';
    const folder = searchParams.get('folder') || '';
    if (!BUCKETS.has(bucket) || folder.includes('..') || folder.startsWith('/')) {
      return NextResponse.json({ error: 'The requested storage location is not allowed.' }, { status: 400 });
    }

    const { data: files, error } = await adminClient.storage
      .from(bucket)
      .list(folder, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const items = (files || [])
      .filter((f) => f.name && !f.name.startsWith('.'))
      .map((f) => {
        const fullPath = folder ? `${folder}/${f.name}` : f.name;
        const { data: urlData } = adminClient.storage.from(bucket).getPublicUrl(fullPath);
        return {
          name: f.name,
          path: fullPath,
          id: f.id,
          size: f.metadata?.size,
          mimetype: f.metadata?.mimetype,
          createdAt: f.created_at,
          publicUrl: urlData.publicUrl,
        };
      });

    return NextResponse.json({ files: items });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown storage error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
