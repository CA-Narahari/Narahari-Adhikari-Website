-- The careers CMS stores an optional public Supabase Storage URL for each job description attachment.
alter table public.vacancies
  add column if not exists attachment_url text;
