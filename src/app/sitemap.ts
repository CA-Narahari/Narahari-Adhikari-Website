import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.narahariadhikari.com.np';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['', '/about', '/contact', '/services', '/blog', '/updates', '/careers', '/resources', '/resources/downloads', '/resources/tools', '/privacy', '/terms', '/book-appointment'];
  const entries: MetadataRoute.Sitemap = routes.map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: 'weekly', priority: path === '' ? 1 : 0.6 }));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return entries;
  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const [{ data: services }, { data: posts }, { data: updates }] = await Promise.all([
    client.from('services').select('slug, updated_at'),
    client.from('posts').select('slug, updated_at').eq('status', 'published'),
    client.from('tax_updates').select('slug, updated_at').eq('status', 'published'),
  ]);
  for (const item of services ?? []) entries.push({ url: `${siteUrl}/services/${item.slug}`, lastModified: item.updated_at, changeFrequency: 'monthly', priority: 0.7 });
  for (const item of posts ?? []) entries.push({ url: `${siteUrl}/blog/${item.slug}`, lastModified: item.updated_at, changeFrequency: 'monthly', priority: 0.7 });
  for (const item of updates ?? []) entries.push({ url: `${siteUrl}/updates/${item.slug}`, lastModified: item.updated_at, changeFrequency: 'weekly', priority: 0.6 });
  return entries;
}
