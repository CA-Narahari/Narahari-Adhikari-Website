import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { consumeRateLimit, requestKey } from '@/lib/rate-limit';
import { hasValidDocumentSignature, readApplicationUploadToken } from '@/lib/application-upload';

export async function POST(request: Request) {
  const rate = await consumeRateLimit(requestKey(request, 'application-submit'), 10, 60 * 60 * 1000);
  if (rate.unavailable) return NextResponse.json({ error: 'Applications are temporarily unavailable. Please try again shortly.' }, { status: 503 });
  if (!rate.allowed) return NextResponse.json({ error: 'Too many submission attempts. Please try again later.' }, { status: 429, headers: { 'Retry-After': String(Math.ceil((rate.resetAt - Date.now()) / 1000)) } });

  let token: unknown;
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('invalid body');
    token = (body as { applicationToken?: unknown }).applicationToken;
  } catch {
    return NextResponse.json({ error: 'The upload confirmation could not be read. Please try again.' }, { status: 400 });
  }

  const claims = readApplicationUploadToken(token);
  if (!claims) return NextResponse.json({ error: 'This upload link has expired. Please restart your application.' }, { status: 400 });
  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: 'Application storage is not configured. Please contact the practice directly.' }, { status: 503 });

  const { data: duplicate, error: duplicateError } = await supabase.from('applications').select('id').eq('cv_file_url', claims.filePath).maybeSingle();
  if (duplicateError) return NextResponse.json({ error: 'We could not confirm this application. Please try again shortly.' }, { status: 503 });
  if (duplicate) return NextResponse.json({ ok: true, duplicate: true }, { status: 201 });

  const storage = supabase.storage.from('application-cvs');
  const { data: info, error: infoError } = await storage.info(claims.filePath);
  if (infoError || !info || info.size !== claims.fileSize || info.contentType !== claims.contentType) {
    await storage.remove([claims.filePath]);
    return NextResponse.json({ error: 'The CV upload is incomplete or does not match the selected file. Please attach it again.' }, { status: 400 });
  }

  const { data: file, error: downloadError } = await storage.download(claims.filePath);
  if (downloadError || !file) {
    await storage.remove([claims.filePath]);
    return NextResponse.json({ error: 'We could not verify the uploaded CV. Please attach it again.' }, { status: 400 });
  }
  const signature = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  if (!hasValidDocumentSignature(claims.contentType, signature)) {
    await storage.remove([claims.filePath]);
    return NextResponse.json({ error: 'The uploaded CV content does not match its declared file type.' }, { status: 400 });
  }

  const { error: insertError } = await supabase.from('applications').insert({
    vacancy_id: claims.vacancyId,
    vacancy_title: claims.vacancyTitle,
    applicant_name: claims.applicantName,
    applicant_email: claims.applicantEmail,
    applicant_phone: claims.applicantPhone,
    qualification: claims.qualification,
    cover_note: claims.coverNote,
    cv_file_url: claims.filePath,
    cv_filename: claims.fileName,
    privacy_consent: true,
    status: 'new',
  });
  if (insertError) {
    await storage.remove([claims.filePath]);
    return NextResponse.json({ error: 'The CV was uploaded, but we could not save your application. Please try again.' }, { status: 503 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
