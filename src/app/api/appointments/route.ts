import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { consumeRateLimit, requestKey } from '@/lib/rate-limit';

type AppointmentRequest = {
  client_name?: unknown;
  client_email?: unknown;
  client_phone?: unknown;
  company_name?: unknown;
  service_title?: unknown;
  consultation_type?: unknown;
  date?: unknown;
  time_slot?: unknown;
  notes?: unknown;
  privacy_consent?: unknown;
};

const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > 16 * 1024) return NextResponse.json({ error: 'The appointment request is too large. Shorten it and try again.' }, { status: 413 });
  const rate = await consumeRateLimit(requestKey(request, 'appointment'), 10, 15 * 60 * 1000);
  if (rate.unavailable) return NextResponse.json({ error: 'Appointment requests are temporarily unavailable. Please try again shortly.' }, { status: 503 });
  if (!rate.allowed) return Response.json({ error: 'Too many appointment requests. Try again later.' }, { status: 429, headers: { 'Retry-After': String(Math.ceil((rate.resetAt - Date.now()) / 1000)) } });
  let body: AppointmentRequest;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return NextResponse.json({ error: 'Please review the request details and try again.' }, { status: 400 });
    body = parsed as AppointmentRequest;
  } catch {
    return NextResponse.json({ error: 'Please review the request details and try again.' }, { status: 400 });
  }

  const clientName = text(body.client_name);
  const clientEmail = text(body.client_email).toLowerCase();
  const clientPhone = text(body.client_phone);
  const companyName = text(body.company_name);
  const serviceTitle = text(body.service_title);
  const date = text(body.date);
  const timeSlot = text(body.time_slot);
  const notes = text(body.notes);
  const privacyConsent = body.privacy_consent === true;
  const requestedDate = new Date(`${date}T00:00:00Z`);

  if (!clientName || !clientEmail || !clientPhone || !serviceTitle || !date || !timeSlot || !privacyConsent) {
    return NextResponse.json({ error: 'Complete the required fields and confirm the Privacy Policy.' }, { status: 400 });
  }
  if (clientName.length > 120 || clientEmail.length > 254 || !/^\S+@\S+\.\S+$/.test(clientEmail)
    || clientPhone.length > 40 || companyName.length > 160 || serviceTitle.length > 160
    || timeSlot.length > 80 || notes.length > 3000 || !/^\d{4}-\d{2}-\d{2}$/.test(date)
    || Number.isNaN(requestedDate.getTime()) || requestedDate.toISOString().slice(0, 10) !== date) {
    return NextResponse.json({ error: 'One or more appointment fields are invalid or too long.' }, { status: 400 });
  }

  const consultationType = body.consultation_type === 'Office Meeting' ? 'Office Meeting' : null;
  if (!consultationType) {
    return NextResponse.json({ error: 'Choose a supported consultation type.' }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Booking is temporarily unavailable. Please contact the practice directly.' }, { status: 503 });
  }

  const { data, error } = await supabase.from('appointments').insert({
    client_name: clientName,
    client_email: clientEmail,
    client_phone: clientPhone,
    company_name: companyName,
    service_title: serviceTitle,
    consultation_type: consultationType,
    requested_date: date,
    requested_time: timeSlot,
    notes,
    privacy_consent: privacyConsent,
    status: 'pending',
  }).select('id, created_at').single();

  if (error || !data) {
    return NextResponse.json({ error: 'We could not save your request. Please try again or contact the practice directly.' }, { status: 503 });
  }

  return NextResponse.json(data, { status: 201 });
}
