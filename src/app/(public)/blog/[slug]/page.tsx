'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { addArticleHeadingIds, escapeArticleText, getArticleHeadings, toArticleHtml } from '@/lib/article-content';
import { normalizeMediaHtml, publicMediaUrl } from '@/lib/media-url';
import type { BlogPost } from '@/types';
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3, Copy, FileText, List, UserRound } from 'lucide-react';

function formatBlogContent(content: string): string {
  const source = String(content || '').trim();
  if (!source) return '';
  if (/<[a-z][^>]*>/i.test(source)) return addArticleHeadingIds(toArticleHtml(source));

  const html = source.split(/\r?\n\s*\r?\n/).map((block) => {
    const parts: string[] = [];
    let paragraph: string[] = [];
    let listItems: string[] = [];
    let listType: 'ul' | 'ol' = 'ul';
    const flushParagraph = () => {
      if (paragraph.length) parts.push(`<p>${paragraph.map(escapeArticleText).join('<br>')}</p>`);
      paragraph = [];
    };
    const flushList = () => {
      if (listItems.length) parts.push(`<${listType}>${listItems.map((item) => `<li>${escapeArticleText(item)}</li>`).join('')}</${listType}>`);
      listItems = [];
    };

    for (const rawLine of block.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line) continue;
      const bullet = line.match(/^(?:•|[-*])\s+(.+)$/);
      const numberedListItem = line.match(/^\d+\.\s+(.+)$/);
      const numberedHeading = line.match(/^(\d+)\.\s+(.{4,100})$/);
      const labelHeading = line.match(/^(.{4,100}):$/);
      if (bullet) {
        flushParagraph();
        if (listItems.length && listType !== 'ul') flushList();
        listType = 'ul';
        listItems.push(bullet[1]);
      } else if (numberedListItem && /[.!?]$/.test(numberedListItem[1])) {
        flushParagraph();
        if (listItems.length && listType !== 'ol') flushList();
        listType = 'ol';
        listItems.push(numberedListItem[1]);
      } else if (numberedHeading && !/[.!?]$/.test(numberedHeading[2])) {
        flushParagraph();
        flushList();
        parts.push(`<h2>${escapeArticleText(`${numberedHeading[1]}. ${numberedHeading[2]}`)}</h2>`);
      } else if (labelHeading) {
        flushParagraph();
        flushList();
        parts.push(`<h2>${escapeArticleText(labelHeading[1])}</h2>`);
      } else {
        flushList();
        paragraph.push(line);
      }
    }
    flushParagraph();
    flushList();
    return parts.join('');
  }).join('');

  return addArticleHeadingIds(toArticleHtml(html));
}

function formatDate(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function BlogArticlePage() {
  const { blogPosts } = useApp();
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const [directPost, setDirectPost] = useState<BlogPost | null>(null);
  const [checkedSlug, setCheckedSlug] = useState('');
  const loading = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) && checkedSlug !== slug;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    const client = createSupabaseBrowserClient();
    if (!client || !slug) return () => { active = false; };
    void client.from('posts').select('*').eq('slug', slug).eq('status', 'published').maybeSingle().then(({ data }) => {
      if (!active) return;
      setDirectPost(data as BlogPost | null);
      setCheckedSlug(slug);
    }, () => {
      if (active) setCheckedSlug(slug);
    });
    return () => { active = false; };
  }, [slug]);

  const post = blogPosts.find((item) => item.status === 'published' && item.slug.toLowerCase() === slug.toLowerCase())
    || (directPost?.slug.toLowerCase() === slug.toLowerCase() ? directPost : null);

  if (!post && loading) {
    return <div className="mx-auto flex min-h-[55vh] max-w-4xl items-center justify-center px-6 text-sm text-[#688093]">Loading article…</div>;
  }

  if (!post) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <FileText className="mb-4 h-10 w-10 text-slate-300" />
        <h1 className="text-2xl font-bold text-[#073F50]">Article not found</h1>
        <p className="mt-2 text-sm text-[#688093]">This article may not be published or its link may have changed.</p>
        <Link href="/blog" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#073F50] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#168A4A]">
          <ArrowLeft className="h-4 w-4" /> Back to articles
        </Link>
      </div>
    );
  }

  const articleHtml = formatBlogContent(post.content || '');
  const headings = getArticleHeadings(articleHtml);
  const recentPosts = blogPosts
    .filter((item) => item.status === 'published' && item.id !== post.id)
    .slice(0, 4);
  const isHistoricalTaxArticle = /FY\s*2081\s*\/\s*82/i.test(`${post.title} ${post.content}`);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.meta_description || post.excerpt,
    datePublished: post.published_at,
    author: { '@type': 'Person', name: post.author || 'CA Narahari Adhikari' },
    image: publicMediaUrl(post.featured_image) ? [publicMediaUrl(post.featured_image)!] : undefined,
  };
  const formattedDate = formatDate(post.published_at);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className="min-h-screen bg-[#F8FBFA] pb-20 text-[#073F50]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="mx-auto grid max-w-[1300px] grid-cols-1 items-start gap-8 px-5 pt-8 sm:px-8 sm:pt-10 lg:grid-cols-[minmax(0,1.9fr)_minmax(340px,1fr)] lg:gap-8">
        <main className="min-w-0">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[13px] font-medium text-[#668092] transition hover:text-[#073F50]">
            <ArrowLeft className="h-4 w-4" /> Back to Articles
          </Link>

          <header className="mt-7">
            <span className="inline-flex rounded-md bg-[#E5F5EF] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#078652]">{post.category || 'Article'}</span>
            <h1 className="mt-3 max-w-3xl text-[32px] font-bold leading-[1.22] tracking-[-0.025em] text-[#073F50] sm:text-[36px]">{post.title}</h1>
            {post.excerpt && <p className="mt-3.5 max-w-3xl text-[15px] leading-[1.7] text-[#668092]">{post.excerpt}</p>}
          </header>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-[#E1E9E9] pb-4 text-[11px] text-[#698393] sm:text-xs">
            {formattedDate && <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#168A73]" />{formattedDate}</span>}
            {post.read_time && <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#168A73]" />{post.read_time}</span>}
            <span className="inline-flex items-center gap-2"><UserRound className="h-4 w-4 text-[#168A73]" />{post.author || 'CA Narahari Adhikari'}</span>
            <span className="hidden h-5 w-px bg-[#DFE8E8] sm:block" />
            <span className="font-medium">Share</span>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window === 'undefined' ? '' : window.location.href)}`} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn" className="font-bold text-[#073F50] hover:text-[#168A4A]">in</a>
            <a href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${typeof window === 'undefined' ? '' : window.location.href}`)}`} target="_blank" rel="noreferrer" aria-label="Share on WhatsApp" className="font-bold text-[#073F50] hover:text-[#168A4A]">W</a>
            <button type="button" onClick={copyLink} aria-label="Copy article link" className="inline-flex items-center gap-1 text-[#073F50] hover:text-[#168A4A]">
              {copied ? <Check className="h-4 w-4 text-[#168A4A]" /> : <Copy className="h-4 w-4" />}{copied && <span>Copied</span>}
            </button>
          </div>

          {post.featured_image && <figure className="relative mt-6 aspect-[4/3] overflow-hidden rounded-lg border border-[#E2EAED] bg-slate-100 sm:aspect-[8/3]">
            <Image src={publicMediaUrl(post.featured_image) || post.featured_image} alt={post.image_alt || post.title} fill priority sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" />
          </figure>}

          {isHistoricalTaxArticle && <aside className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-6 text-amber-950" aria-label="Historical tax information">
            <strong>Historical reference: FY 2081/82.</strong> Tax rates and filing dates change by fiscal year. Verify current requirements with the <a href="https://ird.gov.np/category/incometax-1/" target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">Inland Revenue Department</a> before relying on figures in this article.
          </aside>}

          <div className="cms-article-content prose prose-slate mt-5 max-w-none text-[15px] leading-[1.85] text-[#5B7485] prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[#073F50] prose-h2:mb-3 prose-h2:mt-8 prose-h2:border-b prose-h2:border-[#E5ECEF] prose-h2:scroll-mt-28 prose-h2:pb-2 prose-h2:text-[21px] prose-h3:mb-2 prose-h3:mt-6 prose-h3:scroll-mt-28 prose-h3:text-lg prose-p:my-4 prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1.5 prose-blockquote:border-l-4 prose-blockquote:border-[#28B76A] prose-blockquote:pl-5 prose-blockquote:text-[#547083] prose-img:my-6 prose-img:rounded-lg prose-a:text-[#168A4A] prose-a:underline" dangerouslySetInnerHTML={{ __html: normalizeMediaHtml(articleHtml || '<p>Article content will be published here.</p>') }} />

          {post.tags?.length ? <div className="mt-7 flex flex-wrap items-center gap-2 border-t border-[#E5ECEF] pt-5">
            <span className="mr-1 text-xs font-semibold text-[#688093]">Tags</span>
            {post.tags.map((tag) => <span key={tag} className="rounded-full bg-[#EFF5F3] px-3 py-1 text-xs text-[#446574]">#{tag}</span>)}
          </div> : null}
        </main>

        <aside className="space-y-6 lg:sticky lg:top-24">
          {headings.length > 0 && <nav aria-label="Article table of contents" className="rounded-xl border border-[#E5ECEF] bg-white p-6 shadow-[0_8px_28px_rgba(7,63,80,0.04)]">
            <h2 className="flex items-center gap-2 border-b border-[#EDF1F3] pb-4 text-[15px] font-semibold"><List className="h-4 w-4 text-[#168A73]" /> Table of Contents</h2>
            <ol className="mt-2 space-y-0.5">
              {headings.map((heading, index) => <li key={heading.id} className={heading.level === 3 ? 'pl-5' : ''}>
                <a href={`#${heading.id}`} className="flex items-start gap-3 rounded-lg px-1.5 py-2.5 text-[12px] leading-5 text-[#3E5C6D] transition hover:bg-[#F0F8F5] hover:text-[#0B7358]">
                  {heading.level === 2 && <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DDF3EA] text-[10px] font-semibold text-[#168A73]">{headings.slice(0, index + 1).filter((item) => item.level === 2).length}</span>}
                  <span>{heading.text}</span>
                </a>
              </li>)}
            </ol>
          </nav>}

          {recentPosts.length > 0 && <section className="rounded-xl border border-[#E5ECEF] bg-white p-6 shadow-[0_8px_28px_rgba(7,63,80,0.04)]">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#EDF1F3] pb-4">
              <h2 className="flex items-center gap-2 text-[15px] font-semibold"><FileText className="h-4 w-4 text-[#168A73]" /> Recent Articles</h2>
              <Link href="/blog" className="inline-flex items-center gap-1 text-[11px] font-medium text-[#608092] hover:text-[#168A4A]">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
            <div className="space-y-4">
              {recentPosts.map((related) => <Link key={`post-${related.id}`} href={`/blog/${related.slug}`} className="group flex gap-3">
                <ArticleThumbnail src={related.featured_image} alt="" />
                <div className="min-w-0 py-1">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#7F9BAA]">{related.category || 'Article'}</span>
                  <h3 className="mt-1 line-clamp-2 text-[12px] font-medium leading-[1.45] text-[#17495B] group-hover:text-[#168A4A]">{related.title}</h3>
                  <p className="mt-1 text-[10px] text-[#8398A4]">{related.read_time || ''}</p>
                </div>
              </Link>)}
            </div>
          </section>}
        </aside>
      </div>
    </article>
  );
}

function ArticleThumbnail({ src, alt }: { src?: string; alt: string }) {
  return <div className="relative h-[76px] w-[84px] shrink-0 overflow-hidden rounded-lg bg-[#EAF2F2]">
    {src ? <Image src={publicMediaUrl(src) || src} alt={alt} fill sizes="84px" className="object-cover transition duration-300 group-hover:scale-105" /> : <FileText className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-[#8AA4A8]" />}
  </div>;
}
