import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/supabase/authorization';

export async function POST(request: Request) {
  const auth = await requireStaff('staff');
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => null) as { url?: string } | null;
  const url = body?.url || '';
  const match = url.match(/\/storage\/v1\/object\/public\/(website-media|download-resources)\/(.+)$/);
  if (!match) return NextResponse.json({ deleted: false, reason: 'Unsupported storage URL' }, { status: 400 });
  const [, bucket, objectPath] = match;
  const [posts, services] = await Promise.all([
    auth.adminClient.from('posts').select('featured_image').eq('featured_image', url).limit(1),
    auth.adminClient.from('services').select('image').eq('image', url).limit(1),
  ]);
  if (posts.error || services.error) return NextResponse.json({ error: 'Could not check media references.' }, { status: 500 });
  if (posts.data?.length || services.data?.length) return NextResponse.json({ deleted: false, reason: 'Media is still referenced.' });
  const { error } = await auth.adminClient.storage.from(bucket).remove([decodeURIComponent(objectPath)]);
  if (error) return NextResponse.json({ error: 'Could not remove orphaned media.' }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
