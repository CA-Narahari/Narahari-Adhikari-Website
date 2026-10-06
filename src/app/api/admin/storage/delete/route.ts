import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/supabase/authorization';

const BUCKETS = new Set(['website-media', 'download-resources']);

export async function POST(request: Request) {
  try {
    const access = await requireStaff();
    if (access.response) return access.response;
    const { adminClient } = access;

    const body = (await request.json()) as { bucket?: string; path?: string; url?: string };
    const bucket = body.bucket || 'website-media';
    let path = body.path;

    // If a full Supabase URL was passed instead of path, extract the path
    if (!path && body.url) {
      try {
        const urlObj = new URL(body.url);
        const match = urlObj.pathname.match(new RegExp(`/storage/v1/object/public/${bucket}/(.+)`));
        if (match && match[1]) {
          path = decodeURIComponent(match[1]);
        }
      } catch {
        // Fallback
      }
    }

    if (!path) {
      return NextResponse.json({ error: 'No storage path or valid Supabase URL provided for deletion.' }, { status: 400 });
    }
    if (!BUCKETS.has(bucket) || path.includes('..') || path.startsWith('/')) {
      return NextResponse.json({ error: 'The requested storage location is not allowed.' }, { status: 400 });
    }

    const { error } = await adminClient.storage.from(bucket).remove([path]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, removedPath: path });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown storage deletion error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
