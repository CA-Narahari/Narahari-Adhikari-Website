-- Store descriptive alt text for service cover images managed by the CMS.
alter table public.services
  add column if not exists image_alt text not null default '';
