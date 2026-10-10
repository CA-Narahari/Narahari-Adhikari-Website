import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { readApplicationUploadToken } from '@/lib/application-upload';

export async function POST(request: Request) {
  let token: unknown;
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('invalid body');
    token = (body as { applicationToken?: unknown }).applicationToken;
  } catch {
    return NextResponse.json({ error: 'The upload cancellation could not be read.' }, { status: 400 });
  }

  const claims = readApplicationUploadToken(token);
  if (!claims) return NextResponse.json({ error: 'The upload is already expired.' }, { status: 200 });
  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: 'Storage is unavailable.' }, { status: 503 });

  const { data: existing, error } = await supabase.from('applications').select('id').eq('cv_file_url', claims.filePath).maybeSingle();
  if (error) return NextResponse.json({ error: 'Could not confirm whether the application was saved.' }, { status: 503 });
  if (existing) return NextResponse.json({ ok: true });

  const { error: removeError } = await supabase.storage.from('application-cvs').remove([claims.filePath]);
  if (removeError) return NextResponse.json({ error: 'The unused upload could not be removed.' }, { status: 503 });
  return NextResponse.json({ ok: true });
}
