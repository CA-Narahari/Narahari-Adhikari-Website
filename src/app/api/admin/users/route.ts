import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/lib/supabase/server';

async function getAdminClient() {
  const authClient = await createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();
  if (!authClient || !adminClient) {
    return { client: null, response: NextResponse.json({ error: 'User management is not configured.' }, { status: 503 }) };
  }

  const { data: { user }, error: authError } = await authClient.auth.getUser();
  if (authError || !user) {
    return { client: null, response: NextResponse.json({ error: 'Sign in to manage user access.' }, { status: 401 }) };
  }

  const { data: profile, error: profileError } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    return { client: null, response: NextResponse.json({ error: 'We could not verify your access permissions.' }, { status: 500 }) };
  }

  if (profile?.role !== 'admin') {
    return { client: null, response: NextResponse.json({ error: 'Only administrators can manage user access.' }, { status: 403 }) };
  }

  return { client: adminClient, response: null };
}

export async function GET() {
  const access = await getAdminClient();
  if (access.response) return access.response;
  const supabase = access.client;

  const users = [];
  for (let page = 1; ; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) {
      return NextResponse.json({ error: 'We could not load user accounts.' }, { status: 500 });
    }
    users.push(...data.users);
    if (data.users.length < 1000) break;
  }

  if (users.length === 0) return NextResponse.json({ users: [] });

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, display_name, username, role, created_at')
    .in('id', users.map((user) => user.id))
    .in('role', ['admin', 'staff']);

  if (profileError) {
    return NextResponse.json({ error: 'We could not load staff access roles.' }, { status: 500 });
  }

  const userById = new Map(users.map((user) => [user.id, user]));
  const staffUsers = (profiles ?? []).flatMap((profile) => {
    const authUser = userById.get(profile.id);
    if (!authUser) return [];
    return [{
      id: authUser.id,
      displayName: profile.display_name,
      email: authUser.email ?? '',
      role: profile.role,
      createdAt: profile.created_at || authUser.created_at,
      emailConfirmed: Boolean(authUser.email_confirmed_at),
    }];
  });

  return NextResponse.json({ users: staffUsers });
}

export async function POST(request: Request) {
  const access = await getAdminClient();
  if (access.response) return access.response;
  const supabase = access.client;

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return NextResponse.json({ error: 'Enter the staff member details.' }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Enter the staff member details.' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const displayName = typeof body.displayName === 'string' ? body.displayName.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const role = body.role;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  if (displayName.length < 2 || displayName.length > 100) {
    return NextResponse.json({ error: 'Enter a name between 2 and 100 characters.' }, { status: 400 });
  }
  if (password.length < 10 || password.length > 128) {
    return NextResponse.json({ error: 'Use a password between 10 and 128 characters.' }, { status: 400 });
  }
  if (role !== 'admin' && role !== 'staff') {
    return NextResponse.json({ error: 'Choose administrator or staff access.' }, { status: 400 });
  }

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: displayName },
  });

  if (createError || !created.user) {
    const alreadyExists = createError?.message.toLowerCase().includes('already') ?? false;
    return NextResponse.json(
      { error: alreadyExists ? 'An account with this email already exists.' : 'We could not create this account. Check the Supabase Auth settings and try again.' },
      { status: alreadyExists ? 409 : 400 },
    );
  }

  const localPart = email.slice(0, email.lastIndexOf('@'));
  const usernameBase = localPart.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'staff-user';
  const { error: profileInsertError } = await supabase.from('profiles').insert({
    id: created.user.id,
    username: `${usernameBase}-${created.user.id.slice(0, 8)}`,
    display_name: displayName,
    role,
  });

  if (profileInsertError) {
    await supabase.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ error: 'The account was not granted access because its profile could not be saved.' }, { status: 500 });
  }

  return NextResponse.json({
    user: {
      id: created.user.id,
      displayName,
      email,
      role,
      createdAt: created.user.created_at,
      emailConfirmed: true,
    },
  }, { status: 201 });
}

export async function PATCH(request: Request) {
  const access = await getAdminClient();
  if (access.response) return access.response;
  const supabase = access.client;

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return NextResponse.json({ error: 'Invalid request data.' }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid request data.' }, { status: 400 });
  }

  const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const requestedRole = body.role;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
  }

  if (requestedRole === 'admin' || requestedRole === 'staff') {
    const authClient = await createSupabaseServerClient();
    const { data: { user: actor } } = await authClient!.auth.getUser();
    if (actor?.id === userId && requestedRole !== 'admin') {
      return NextResponse.json({ error: 'You cannot remove your own administrator access.' }, { status: 400 });
    }
    const { data: changed, error: roleError } = await supabase.from('profiles').update({ role: requestedRole }).eq('id', userId).select('id').maybeSingle();
    if (roleError || !changed) return NextResponse.json({ error: 'The account role could not be changed.' }, { status: 400 });
    return NextResponse.json({ success: true, message: 'Account access updated.' });
  }

  const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
  if (password.length < 8 || password.length > 128 || currentPassword.length < 1) {
    return NextResponse.json({ error: 'Enter your current password and a new password of at least 8 characters.' }, { status: 400 });
  }

  const authClient = await createSupabaseServerClient();
  const { data: { user: actor } } = await authClient!.auth.getUser();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!actor?.email || !supabaseUrl || !publishableKey) return NextResponse.json({ error: 'We could not verify the administrator account.' }, { status: 401 });
  const verifier = createClient(supabaseUrl, publishableKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const { error: verificationError } = await verifier.auth.signInWithPassword({ email: actor.email, password: currentPassword });
  await verifier.auth.signOut();
  if (verificationError) return NextResponse.json({ error: 'The current administrator password is incorrect.' }, { status: 403 });

  const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
    password,
  });

  if (updateError) {
    return NextResponse.json({ error: updateError.message || 'Failed to update user password.' }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: 'Password updated successfully.' });
}
