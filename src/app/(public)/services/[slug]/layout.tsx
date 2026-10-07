import type { Metadata } from 'next';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { publicMediaUrl } from '@/lib/media-url';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.from('services').select('title,meta_title,meta_description,image').eq('slug', slug).maybeSingle() : { data: null };
  const title = data?.meta_title || data?.title || 'Professional Services';
  const description = data?.meta_description || 'Tax, audit, accounting, and business advisory services from CA Narahari Adhikari.';
  return { title, description, alternates: { canonical: `/services/${slug}` }, openGraph: { title, description, type: 'article', images: publicMediaUrl(data?.image) } };
}

export default function ServiceLayout({ children }: { children: React.ReactNode }) { return children; }
