import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { consumeRateLimit, requestKey } from '@/lib/rate-limit';

type ContactRequest = { name?: unknown; email?: unknown; phone?: unknown; organization?: unknown; message?: unknown; privacy_consent?: unknown };
const clean = (value: unknown) => typeof value === 'string' ? value.trim() : '';

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > 16 * 1024) return Response.json({ error: 'The message is too large. Shorten it and try again.' }, { status: 413 });
  const rate = await consumeRateLimit(requestKey(request, 'contact'), 5, 15 * 60 * 1000);
  if (rate.unavailable) return Response.json({ error: 'The form is temporarily unavailable. Please try again shortly.' }, { status: 503 });
  if (!rate.allowed) return Response.json({ error: 'Too many messages. Please try again later.' }, { status: 429 });

  let body: ContactRequest;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return Response.json({ error: 'Please review the form and try again.' }, { status: 400 });
    body = parsed as ContactRequest;
  }
  catch { return Response.json({ error: 'Please review the form and try again.' }, { status: 400 }); }

  const name = clean(body.name);
  const email = clean(body.email).toLowerCase();
  const phone = clean(body.phone);
  const organization = clean(body.organization);
  const message = clean(body.message);
  if (!name || !email || !message || body.privacy_consent !== 'on' && body.privacy_consent !== true) {
    return Response.json({ error: 'Complete the required fields and confirm the Privacy Policy.' }, { status: 400 });
  }
  if (name.length > 120 || email.length > 254 || !/^\S+@\S+\.\S+$/.test(email) || phone.length > 40 || organization.length > 160 || message.length > 3000) {
    return Response.json({ error: 'One or more fields are invalid or too long.' }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) return Response.json({ error: 'The contact form is temporarily unavailable. Please email the practice directly.' }, { status: 503 });
  const { error } = await supabase.from('contact_messages').insert({ name, email, phone, organization, message, privacy_consent: true });
  if (error) return Response.json({ error: 'We could not save your message. Please try again or email the practice directly.' }, { status: 503 });
  return Response.json({ success: true }, { status: 201 });
}
