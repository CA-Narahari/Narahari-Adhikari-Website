const STORAGE_MARKER = '/storage/v1/object/public/website-media/';

/** Keep public media on the website origin while the objects remain in Supabase Storage. */
export function publicMediaUrl(value?: string | null): string | undefined {
  if (!value) return undefined;
  try {
    const parsed = new URL(value, 'https://site.invalid');
    const markerIndex = parsed.pathname.indexOf(STORAGE_MARKER);
    if (markerIndex < 0) return value;
    const objectPath = parsed.pathname.slice(markerIndex + STORAGE_MARKER.length)
      .split('/')
      .map((part) => encodeURIComponent(decodeURIComponent(part)))
      .join('/');
    return objectPath ? `/media/${objectPath}${parsed.search}${parsed.hash}` : value;
  } catch {
    return value;
  }
}

export function siteMediaUrl(folder: string, name: string): string {
  const cleanName = name.trim();
  if (!cleanName) return '';
  if (/^(?:https?:)?\/\//i.test(cleanName) || cleanName.startsWith('/')) return cleanName;
  return `/media/${folder}/${cleanName.split('/').map((part) => encodeURIComponent(part)).join('/')}`;
}

export function normalizeMediaHtml(html: string): string {
  return html.replace(/https?:\/\/[^"'\s)]+\/storage\/v1\/object\/public\/website-media\/([^"'\s)]+)/gi, (_match, path: string) => {
    const cleanPath = path.split(/[?#]/)[0].split('/').map((part) => encodeURIComponent(decodeURIComponent(part))).join('/');
    return `/media/${cleanPath}`;
  });
}
