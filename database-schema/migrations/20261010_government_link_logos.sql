alter table public.government_links
  add column if not exists logo_url text,
  add column if not exists logo_alt text;
