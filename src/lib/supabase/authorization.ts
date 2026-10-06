import { NextResponse } from 'next/server';
import { createSupabaseAdminClient, createSupabaseServerClient } from './server';

export type StaffRole = 'staff' | 'admin';

type AuthorizationResult = {
  adminClient: NonNullable<ReturnType<typeof createSupabaseAdminClient>>;
  userId: string;
  role: StaffRole;
  response?: never;
} | {
  adminClient?: never;
  userId?: never;
  role?: never;
  response: NextResponse;
};

export async function requireStaff(roleRequired: StaffRole = 'staff'): Promise<AuthorizationResult> {
  const authClient = await createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();
  if (!authClient || !adminClient) {
    return { response: NextResponse.json({ error: 'Authentication is not configured.' }, { status: 503 }) };
  }

  const { data: auth, error: authError } = await authClient.auth.getUser();
  if (authError || !auth.user) {
    return { response: NextResponse.json({ error: 'Authentication required.' }, { status: 401 }) };
  }

  const { data: profile, error: profileError } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', auth.user.id)
    .maybeSingle();
  if (profileError) {
    return { response: NextResponse.json({ error: 'We could not verify access permissions.' }, { status: 500 }) };
  }

  const role = profile?.role as StaffRole | undefined;
  if (!role || !['staff', 'admin'].includes(role) || (roleRequired === 'admin' && role !== 'admin')) {
    return { response: NextResponse.json({ error: 'You do not have permission to perform this action.' }, { status: 403 }) };
  }

  return { adminClient, userId: auth.user.id, role };
}
