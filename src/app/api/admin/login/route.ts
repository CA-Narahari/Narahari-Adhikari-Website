import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };
  const adminUsername = process.env.SUPABASE_ADMIN_USERNAME;
  const adminEmail = process.env.SUPABASE_ADMIN_EMAIL;

  if (!adminUsername || !adminEmail) {
    return NextResponse.json({ error: 'Admin authentication is not configured.' }, { status: 503 });
  }

  if (body.username !== adminUsername || !body.password) {
    return NextResponse.json({ error: 'The admin ID or password is incorrect.' }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient(true);
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase authentication is not configured.' }, { status: 503 });
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: body.password,
  });

  if (error) {
    return NextResponse.json({ error: 'The admin ID or password is incorrect.' }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
