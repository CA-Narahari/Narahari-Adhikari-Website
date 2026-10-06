alter table public.appointments
  add column if not exists company_name text not null default '';

alter table public.appointments
  add column if not exists privacy_consent boolean not null default false;

alter table public.applications
  add column if not exists qualification text not null default '';

-- Move the organization prefix used by the earlier booking form into its own field.
update public.appointments
set
  company_name = coalesce(nullif(company_name, ''), btrim((regexp_match(notes, E'^Organization: ([^\\r\\n]*)'))[1])),
  notes = regexp_replace(notes, E'^Organization: [^\\r\\n]*(\\r?\\n){1,2}', '')
where notes like 'Organization:%';

-- Keep qualifications separate from the candidate's free-text message.
update public.applications
set
  qualification = coalesce(nullif(qualification, ''), btrim((regexp_match(cover_note, E'^Qualification: ([^\\r\\n]*)'))[1])),
  cover_note = regexp_replace(cover_note, E'^Qualification: [^\\r\\n]*(\\r?\\n){1,2}', '')
where cover_note like 'Qualification:%';
