import type { Metadata } from 'next';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { publicMediaUrl } from '@/lib/media-url';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  // Keep this selection compatible with the currently deployed posts schema;
  // optional SEO columns are not present in every Supabase deployment yet.
  const { data } = supabase ? await supabase.from('posts').select('title,excerpt,featured_image').eq('slug', slug).eq('status', 'published').maybeSingle() : { data: null };
  const title = data?.title || 'Practice Article';
  const description = data?.excerpt || 'Practical tax, audit, accounting, and financial reporting guidance.';
  return { title, description, alternates: { canonical: `/blog/${slug}` }, openGraph: { title, description, type: 'article', images: publicMediaUrl(data?.featured_image) } };
}

export default function BlogArticleLayout({ children }: { children: React.ReactNode }) { return children; }
