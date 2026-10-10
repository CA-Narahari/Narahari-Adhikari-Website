import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/supabase/authorization';

const STATUSES = {
  applications: new Set(['new', 'review', 'shortlisted', 'rejected']),
  appointments: new Set(['pending', 'confirmed', 'rescheduled', 'cancelled']),
  contact_messages: new Set(['new', 'in_progress', 'closed']),
} as const;

type RecordType = keyof typeof STATUSES;

export async function PATCH(request: Request) {
  const access = await requireStaff();
  if (access.response) return access.response;

  let body: { id?: unknown; recordType?: unknown; status?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'The decision could not be read. Try again.' }, { status: 400 });
  }

  const { id, recordType, status } = body;
  if (typeof id !== 'string' || !id || typeof recordType !== 'string' || !Object.hasOwn(STATUSES, recordType)) {
    return NextResponse.json({ error: 'Choose a valid record and decision.' }, { status: 400 });
  }
  const table = recordType as RecordType;
  if (typeof status !== 'string' || !STATUSES[table].has(status as never)) {
    return NextResponse.json({ error: 'Choose a valid decision for this record.' }, { status: 400 });
  }

  const { data, error } = await access.adminClient
    .from(table)
    .update({ status })
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: 'The decision was not saved. Refresh the page and try again.' }, { status: error ? 500 : 404 });
  }
  return NextResponse.json({ ok: true, id, status });
}
