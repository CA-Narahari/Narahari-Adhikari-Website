import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { consumeRateLimit, requestKey } from '@/lib/rate-limit';
import {
  acceptedTypes,
  APPLICATION_TOKEN_TTL_MS,
  createApplicationUploadToken,
  MAX_CV_SIZE,
  type ApplicationUploadClaims,
} from '@/lib/application-upload';

type ApplicationRequest = Record<string, unknown>;
const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > 16 * 1024) {
    return NextResponse.json({ error: 'Application details are too large. Shorten your note and try again.' }, { status: 413 });
  }
  const rate = await consumeRateLimit(requestKey(request, 'application-upload'), 5, 60 * 60 * 1000);
  if (rate.unavailable) return NextResponse.json({ error: 'Applications are temporarily unavailable. Please try again shortly.' }, { status: 503 });
  if (!rate.allowed) return NextResponse.json({ error: 'Too many applications from this connection. Try again later.' }, { status: 429, headers: { 'Retry-After': String(Math.ceil((rate.resetAt - Date.now()) / 1000)) } });

  let body: ApplicationRequest;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('invalid body');
    body = parsed as ApplicationRequest;
  } catch {
    return NextResponse.json({ error: 'Application details could not be read. Please review the form and try again.' }, { status: 400 });
  }

  const applicantName = text(body.name);
  const applicantEmail = text(body.email).toLowerCase();
  const applicantPhone = text(body.phone);
  const qualification = text(body.qualification);
  const coverNote = text(body.note);
  const vacancyId = text(body.vacancyId);
  const contentType = text(body.contentType);
  const fileName = text(body.fileName).slice(0, 180);
  const fileSize = Number(body.fileSize);
  const privacyConsent = body.privacyConsent === true;
  const extension = acceptedTypes.get(contentType);

  if (!applicantName || !applicantEmail || !applicantPhone || !vacancyId || !extension || !fileName || !privacyConsent) {
    return NextResponse.json({ error: 'Complete the required fields, attach a supported CV, and confirm the Privacy Policy.' }, { status: 400 });
  }
  if (applicantName.length > 120 || applicantEmail.length > 254 || !/^\S+@\S+\.\S+$/.test(applicantEmail)
    || applicantPhone.length > 40 || qualification.length > 120 || coverNote.length > 3000
    || !Number.isSafeInteger(fileSize) || fileSize <= 0 || fileSize > MAX_CV_SIZE) {
    return NextResponse.json({ error: 'One or more application details are invalid or too long. CVs must be under 10 MB.' }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: 'Application storage is not configured. Please contact the practice directly.' }, { status: 503 });
  const { data: vacancy, error: vacancyError } = await supabase.from('vacancies')
    .select('id, title, is_active').eq('id', vacancyId).eq('is_active', true).maybeSingle();
  if (vacancyError) return NextResponse.json({ error: 'We could not check this vacancy. Please try again shortly.' }, { status: 503 });
  if (!vacancy) return NextResponse.json({ error: 'This vacancy is no longer accepting applications.' }, { status: 409 });

  const filePath = `${randomUUID()}${extension}`;
  const { data: upload, error: uploadError } = await supabase.storage.from('application-cvs').createSignedUploadUrl(filePath, { upsert: false });
  if (uploadError || !upload) return NextResponse.json({ error: 'Secure CV storage could not be prepared. Please try again shortly.' }, { status: 503 });

  const claims: ApplicationUploadClaims = {
    applicantName,
    applicantEmail,
    applicantPhone,
    qualification,
    coverNote,
    vacancyId: vacancy.id,
    vacancyTitle: vacancy.title,
    filePath,
    fileName,
    contentType,
    fileSize,
    expiresAt: Date.now() + APPLICATION_TOKEN_TTL_MS,
  };
  try {
    const applicationToken = createApplicationUploadToken(claims);
    return NextResponse.json({ path: upload.path, uploadToken: upload.token, applicationToken }, { status: 200 });
  } catch {
    await supabase.storage.from('application-cvs').remove([filePath]);
    return NextResponse.json({ error: 'Secure application signing is not configured. Please contact the practice directly.' }, { status: 503 });
  }
}
