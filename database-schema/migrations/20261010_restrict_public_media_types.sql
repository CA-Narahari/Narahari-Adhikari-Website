-- Do not serve user-uploaded SVGs from the public site origin. SVG can contain
-- active script when opened directly, so this bucket only accepts raster images
-- and the document formats supported by the CMS upload endpoint.
update storage.buckets
set allowed_mime_types = array_remove(allowed_mime_types, 'image/svg+xml')
where id = 'website-media'
  and allowed_mime_types @> array['image/svg+xml'];
