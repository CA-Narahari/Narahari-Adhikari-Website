-- Bring the existing posts table in line with the CMS blog editor's SEO fields.
alter table public.posts
  add column if not exists meta_title text not null default '',
  add column if not exists meta_description text not null default '',
  add column if not exists focus_keyword text not null default '',
  add column if not exists image_alt text not null default '';
