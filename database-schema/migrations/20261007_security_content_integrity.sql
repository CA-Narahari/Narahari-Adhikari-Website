-- Security and content integrity migration.
-- Apply after reviewing the target project. It is intentionally additive and does not delete rows.

alter table public.posts add column if not exists meta_title text not null default '';
alter table public.posts add column if not exists meta_description text not null default '';
alter table public.posts add column if not exists image_alt text not null default '';
alter table public.posts add column if not exists focus_keyword text not null default '';
alter table public.services add column if not exists meta_title text not null default '';
alter table public.services add column if not exists meta_description text not null default '';
alter table public.services add column if not exists image text;
alter table public.services add column if not exists display_order integer not null default 0;
alter table public.services add column if not exists focus_keyword text not null default '';
alter table public.tax_updates add column if not exists reviewed_on date;
alter table public.tax_updates add column if not exists reviewed_by text not null default '';
alter table public.appointments add column if not exists privacy_consent boolean not null default false;
alter table public.applications add column if not exists privacy_consent boolean not null default false;

-- Purpose-specific buckets. Existing buckets are preserved; these inserts are idempotent.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('application-cvs', 'application-cvs', false, 10485760, array['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('download-resources', 'download-resources', true, 10485760, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Anonymous writes are handled by validated server routes using the service role.
-- Removing direct anon INSERT prevents clients from bypassing consent, status, and vacancy checks.
drop policy if exists "public can request appointments" on public.appointments;
drop policy if exists "public can submit applications" on public.applications;

-- Keep public reads limited to intended published/active records.
drop policy if exists "site settings are public" on public.site_settings;
create policy "site settings are public" on public.site_settings for select using (true);
drop policy if exists "government links are public" on public.government_links;
create policy "published government links are public" on public.government_links
  for select using (true);

drop policy if exists "downloads are public" on public.download_resources;
create policy "published downloads are public" on public.download_resources
  for select using (true);

-- Prevent direct clients from setting privileged workflow fields if an insert policy is restored later.
alter table public.appointments drop constraint if exists appointments_privacy_consent_check;
alter table public.appointments add constraint appointments_privacy_consent_check check (privacy_consent = true) not valid;
alter table public.applications drop constraint if exists applications_privacy_consent_check;
alter table public.applications add constraint applications_privacy_consent_check check (privacy_consent = true) not valid;
