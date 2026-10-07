const allowedFolders = new Set(['blog', 'services', 'general', 'announcements', 'careers']);

async function proxyPublicMedia(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
  method: 'GET' | 'HEAD',
) {
  const { path } = await context.params;
  if (path.length < 2 || !allowedFolders.has(path[0]) || path.some((part) => !part || part === '.' || part === '..' || !/^[a-zA-Z0-9._-]+$/.test(part))) {
    return new Response('Not found', { status: 404 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return new Response('Media service is unavailable', { status: 503 });

  const objectPath = path.map((part) => encodeURIComponent(part)).join('/');
  const target = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/website-media/${objectPath}`;
  try {
    const upstream = await fetch(target, {
      method,
      headers: request.headers.get('if-none-match') ? { 'if-none-match': request.headers.get('if-none-match')! } : undefined,
      redirect: 'manual',
      cache: 'force-cache',
    });
    const headers = new Headers();
    for (const key of ['content-type', 'content-length', 'etag', 'last-modified']) {
      const value = upstream.headers.get(key);
      if (value) headers.set(key, value);
    }
    headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
    headers.set('X-Content-Type-Options', 'nosniff');
    return new Response(method === 'HEAD' ? null : upstream.body, { status: upstream.status, headers });
  } catch {
    return new Response('Media service is unavailable', { status: 502 });
  }
}

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxyPublicMedia(request, context, 'GET');
}

export async function HEAD(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxyPublicMedia(request, context, 'HEAD');
}
