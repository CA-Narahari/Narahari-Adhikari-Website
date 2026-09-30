import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const MAX_CV_SIZE = 10 * 1024 * 1024;
const acceptedTypes = new Map([
  ['application/pdf', '.pdf'],
  ['application/msword', '.doc'],
  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.docx'],
]);

export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const phone = String(form.get('phone') ?? '').trim();
  const qualification = String(form.get('qualification') ?? '').trim();
  const note = String(form.get('note') ?? '').trim();
  const vacancyId = String(form.get('vacancyId') ?? '').trim();
  const vacancyTitle = String(form.get('vacancyTitle') ?? '').trim();
  const privacyConsent = form.get('privacy_consent') === 'on';
  const cv = form.get('cv');

  if (!name || !email || !phone || !vacancyId || !vacancyTitle || !privacyConsent || !(cv instanceof File)) {
    return NextResponse.json({ error: 'Complete the required fields, attach your CV, and confirm the Privacy Policy.' }, { status: 400 });
  }
  if (name.length > 120 || email.length > 254 || phone.length > 40 || note.length > 3000) {
    return NextResponse.json({ error: 'One or more fields are too long.' }, { status: 400 });
  }
  const extension = acceptedTypes.get(cv.type);
  if (!extension || cv.size === 0 || cv.size > MAX_CV_SIZE) {
    return NextResponse.json({ error: 'Choose a non-empty PDF or Word CV under 10 MB.' }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Application submissions are not available right now. Please try again later.' }, { status: 503 });
  }

  const { data: vacancy, error: vacancyError } = await supabase
    .from('vacancies')
    .select('id, title, is_active')
    .eq('id', vacancyId)
    .eq('is_active', true)
    .maybeSingle();
  if (vacancyError || !vacancy) {
    return NextResponse.json({ error: 'This vacancy is no longer accepting applications.' }, { status: 409 });
  }

  const filePath = `${randomUUID()}${extension}`;
  const { error: uploadError } = await supabase.storage
    .from('application-cvs')
    .upload(filePath, cv, { contentType: cv.type, upsert: false });
  if (uploadError) {
    return NextResponse.json({ error: 'We could not store your CV. Please try again.' }, { status: 503 });
  }

  const { error: insertError } = await supabase.from('applications').insert({
    vacancy_id: vacancy.id,
    vacancy_title: vacancy.title,
    applicant_name: name,
    applicant_email: email,
    applicant_phone: phone,
    cover_note: [qualification && `Qualification: ${qualification}`, note].filter(Boolean).join('\n\n'),
    cv_file_url: filePath,
    cv_filename: cv.name.slice(0, 180),
    privacy_consent: true,
    status: 'new',
  });

  if (insertError) {
    await supabase.storage.from('application-cvs').remove([filePath]);
    return NextResponse.json({ error: 'We could not save your application. Please try again.' }, { status: 503 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
