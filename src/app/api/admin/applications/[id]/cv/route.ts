import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/supabase/authorization';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireStaff();
  if (access.response) return access.response;
  const { adminClient } = access;

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
