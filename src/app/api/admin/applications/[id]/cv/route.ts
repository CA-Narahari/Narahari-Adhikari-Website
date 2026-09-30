import { NextResponse } from 'next/server';
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authClient = await createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();
  if (!authClient || !adminClient) return NextResponse.json({ error: 'CV access is not configured.' }, { status: 503 });

  const { data: auth } = await authClient.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: 'Sign in to access candidate files.' }, { status: 401 });

  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', auth.user.id)
    .maybeSingle();
  if (!profile || !['admin', 'staff'].includes(profile.role)) {
    return NextResponse.json({ error: 'You do not have access to candidate files.' }, { status: 403 });
  }

  const { id } = await params;
  const { data: application } = await adminClient
    .from('applications')
    .select('cv_file_url')
    .eq('id', id)
    .maybeSingle();
  if (!application?.cv_file_url) return NextResponse.json({ error: 'The CV file was not found.' }, { status: 404 });

  const { data: signed, error } = await adminClient.storage
    .from('application-cvs')
    .createSignedUrl(application.cv_file_url, 60, { download: true });
  if (error || !signed) return NextResponse.json({ error: 'The CV file is not available.' }, { status: 503 });

  return NextResponse.redirect(signed.signedUrl);
}
