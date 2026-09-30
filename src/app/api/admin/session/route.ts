import { NextResponse } from 'next/server';
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const authClient = await createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();
  if (!authClient || !adminClient) {
    return NextResponse.json({ authenticated: false, error: 'Authentication is not configured.' }, { status: 503 });
  }

  const { data, error } = await authClient.auth.getUser();
  if (error || !data.user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const { data: profile, error: profileError } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profileError || !profile || !['admin', 'staff'].includes(profile.role)) {
    return NextResponse.json({ authenticated: false }, { status: 403 });
  }

  return NextResponse.json({ authenticated: true, role: profile.role });
}

export async function POST() {
  const authClient = await createSupabaseServerClient();
  if (!authClient) {
    return NextResponse.json({ error: 'Authentication is not configured.' }, { status: 503 });
  }

  const { error } = await authClient.auth.signOut({ scope: 'local' });
  if (error) {
    return NextResponse.json({ error: 'Could not end this session.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
