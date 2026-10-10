import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/supabase/authorization';

const fields = ['name', 'short_name', 'description', 'url', 'category', 'logo_url', 'logo_alt'] as const;

function portalSaveError(error: { code?: string; message?: string } | null) {
  if (error?.code === '42703' && /logo_url|logo_alt/i.test(error.message || '')) {
    return 'Supabase is connected, but portal logo columns are missing. Apply database-schema/migrations/20261010_government_link_logos.sql, then retry.';
  }
  if (error?.code === '23505') return 'A portal with this website address already exists.';
  return 'The portal could not be saved to Supabase. Check CMS access and the database schema.';
}

function validPayload(value: unknown): Record<string, string | null> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const payload: Record<string, string | null> = {};
  for (const field of fields) {
    if (!(field in source)) continue;
    const entry = source[field];
    if (entry !== null && typeof entry !== 'string') return null;
    payload[field] = typeof entry === 'string' ? entry.trim() : null;
  }
  if ('url' in payload && payload.url) {
    try {
      const parsed = new URL(payload.url);
      if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    } catch { return null; }
  }
  if ('logo_url' in payload && payload.logo_url && !payload.logo_url.startsWith('/media/') && !/^https?:\/\//i.test(payload.logo_url)) return null;
  return payload;
}

export async function POST(request: Request) {
  const access = await requireStaff();
  if (access.response) return access.response;
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Enter the portal details and try again.' }, { status: 400 }); }
  const payload = validPayload(body);
  if (!payload || !payload.name?.trim() || !payload.url?.trim()) return NextResponse.json({ error: 'A portal name and valid website address are required.' }, { status: 400 });
  const { data, error } = await access.adminClient.from('government_links').insert(payload).select().single();
  if (error || !data) return NextResponse.json({ error: portalSaveError(error) }, { status: 500 });
  return NextResponse.json({ link: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const access = await requireStaff();
  if (access.response) return access.response;
  let body: { id?: unknown; changes?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'The portal changes could not be read.' }, { status: 400 }); }
  if (typeof body.id !== 'string' || !body.id) return NextResponse.json({ error: 'A portal ID is required.' }, { status: 400 });
  const payload = validPayload(body.changes);
  if (!payload || !Object.keys(payload).length) return NextResponse.json({ error: 'Enter valid portal changes and try again.' }, { status: 400 });
  if ('name' in payload && !payload.name?.trim() || 'url' in payload && !payload.url?.trim()) return NextResponse.json({ error: 'Portal name and website address cannot be blank.' }, { status: 400 });
  const { data, error } = await access.adminClient.from('government_links').update(payload).eq('id', body.id).select().maybeSingle();
  if (error || !data) return NextResponse.json({ error: error ? portalSaveError(error) : 'This portal no longer exists. Refresh the links list and try again.' }, { status: error ? 500 : 404 });
  return NextResponse.json({ link: data });
}

export async function DELETE(request: Request) {
  const access = await requireStaff();
  if (access.response) return access.response;
  let body: { id?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'The portal removal request could not be read.' }, { status: 400 }); }
  if (typeof body.id !== 'string' || !body.id) return NextResponse.json({ error: 'A portal ID is required.' }, { status: 400 });
  const { data, error } = await access.adminClient.from('government_links').delete().eq('id', body.id).select('id').maybeSingle();
  if (error || !data) return NextResponse.json({ error: 'The portal could not be removed from Supabase.' }, { status: error ? 500 : 404 });
  return NextResponse.json({ ok: true });
}
