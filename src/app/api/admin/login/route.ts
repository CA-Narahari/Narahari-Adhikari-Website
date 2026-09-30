import { NextResponse } from 'next/server';
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return NextResponse.json({ error: 'Enter your email address and password.' }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Enter your email address and password.' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !email.includes('@') || !password) {
    return NextResponse.json({ error: 'Enter your email address and password.' }, { status: 400 });
  }

  const authClient = await createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();
  if (!authClient || !adminClient) {
    return NextResponse.json({ error: 'Supabase authentication is not configured.' }, { status: 503 });
  }

  const { data, error } = await authClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return NextResponse.json({ error: 'The email address or password is incorrect.' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profileError || !profile || !['admin', 'staff'].includes(profile.role)) {
    await authClient.auth.signOut({ scope: 'local' });
    if (profileError) {
      return NextResponse.json({ error: 'We could not verify this account’s practice access.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'This account is not authorised for the practice workspace.' }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}
