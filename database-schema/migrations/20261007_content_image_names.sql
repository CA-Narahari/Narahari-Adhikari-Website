-- Keep editable featured image names with their CMS content records.
alter table public.posts
  add column if not exists image_name text not null default '';

alter table public.services
  add column if not exists image_name text not null default '';
