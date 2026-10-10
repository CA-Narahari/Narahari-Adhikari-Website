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
    author: { '@type': 'Person', name: (post.author || 'Narahari Adhikari').replace(/^CA\s+/i, '') },
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
    <article className="min-h-screen bg-[#FAFCFD] pb-24 text-[#023A51]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029') }} />

      {/* Article Header matching reference design */}
      <div className="max-w-[1240px] mx-auto px-6 pt-8 pb-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#56686A] hover:text-[#023A51] transition mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Articles
        </Link>

        <div className="space-y-3 max-w-4xl">
          <div>
            <span className="inline-flex rounded-full bg-[#EAF7F0] border border-[#D5EFE1] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#14864B]">
              {post.category || 'Article'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#023A51] tracking-tight leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-base sm:text-[16px] text-[#56686A] leading-relaxed max-w-3xl">
              {post.excerpt}
            </p>
          )}

          {/* Metadata Row matching Screenshot 1 */}
          <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#59667D]">
            {formattedDate && (
              <span className="inline-flex items-center gap-1.5 font-medium text-[#56686A]">
                <CalendarDays className="h-3.5 w-3.5 text-[#14864B]" /> {formattedDate}
              </span>
            )}
            {post.read_time && (
              <span className="inline-flex items-center gap-1.5 font-medium text-[#56686A]">
                <Clock3 className="h-3.5 w-3.5 text-[#14864B]" /> {post.read_time}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 font-medium text-[#56686A]">
              <UserRound className="h-3.5 w-3.5 text-[#14864B]" />
              {(post.author || 'Narahari Adhikari').replace(/^CA\s+/i, '')}
            </span>

            <span className="h-3.5 w-px bg-slate-300" />

            <div className="flex items-center gap-2.5">
              <span className="font-semibold text-[#56686A] text-xs">Share</span>
              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window === 'undefined' ? '' : window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Share on LinkedIn"
                className="font-bold text-[#0A66C2] hover:underline text-xs"
              >
                in
              </a>
              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${typeof window === 'undefined' ? '' : window.location.href}`)}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Share on WhatsApp"
                className="font-bold text-[#128C7E] hover:underline text-xs"
              >
                w
              </a>
              {/* Copy */}
              <button
                type="button"
                onClick={copyLink}
                aria-label="Copy article link"
                title={copied ? 'Link copied' : 'Copy link'}
                className="text-slate-500 hover:text-[#023A51] transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#14864B]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Body Content */}
      <div className="max-w-[1240px] mx-auto px-6 pt-10 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.9fr)_minmax(320px,1fr)] gap-10 items-start">
          <main className="min-w-0">

          {post.featured_image && (
            <figure className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#E8EBEF] bg-slate-100 shadow-sm mb-6">
              <Image
                src={publicMediaUrl(post.featured_image) || post.featured_image}
                alt={post.image_alt || post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 850px"
                className="object-cover"
              />
            </figure>
          )}

          {isHistoricalTaxArticle && (
            <aside
              className="mt-4 mb-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-[13px] leading-relaxed text-amber-950"
              aria-label="Historical tax information"
            >
              <strong>Historical reference: FY 2081/82.</strong> Tax rates and filing dates change by fiscal year. Verify current requirements with the{' '}
              <a
                href="https://ird.gov.np/category/incometax-1/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline underline-offset-2 text-[#023A51]"
              >
                Inland Revenue Department
              </a>{' '}
              before relying on figures in this article.
            </aside>
          )}

          <div
            className="cms-article-content prose prose-slate max-w-none text-[16px] leading-[1.85] text-[#0F172A] prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#023A51] prose-h2:mb-3 prose-h2:mt-8 prose-h2:border-b prose-h2:border-[#E8EBEF] prose-h2:scroll-mt-28 prose-h2:pb-2 prose-h2:text-[22px] prose-h3:mb-2 prose-h3:mt-6 prose-h3:scroll-mt-28 prose-h3:text-lg prose-p:my-4 prose-p:text-[#0F172A] prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1.5 prose-blockquote:border-l-4 prose-blockquote:border-[#023A51] prose-blockquote:pl-5 prose-blockquote:text-[#334155] prose-img:my-6 prose-img:rounded-xl prose-a:text-[#023A51] prose-a:font-bold hover:prose-a:underline"
            dangerouslySetInnerHTML={{
              __html: normalizeMediaHtml(articleHtml || '<p>Article content will be published here.</p>'),
            }}
          />

          {post.tags?.length ? (
            <div className="mt-7 flex flex-wrap items-center gap-2 border-t border-[#E5ECEF] pt-5">
              <span className="mr-1 text-xs font-bold text-[#0F172A]">Tags:</span>
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-medium text-[#0F172A]">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </main>

        <aside className="space-y-6 lg:sticky lg:top-24">
          {headings.length > 0 && (
            <nav aria-label="Article table of contents" className="rounded-2xl border border-[#E5ECEF] bg-white p-6 shadow-xs">
              <h2 className="flex items-center gap-2 border-b border-[#EDF1F3] pb-4 text-[15px] font-bold text-[#023A51]">
                <List className="h-4 w-4 text-[#14864B]" /> Table of Contents
              </h2>
              <ol className="mt-3 space-y-1">
                {headings.map((heading, index) => (
                  <li key={heading.id} className={heading.level === 3 ? 'pl-5' : ''}>
                    <a
                      href={`#${heading.id}`}
                      className="flex items-start gap-2.5 rounded-lg px-2 py-1.5 text-[12.5px] leading-snug text-[#56686A] transition hover:bg-[#F5FAF7] hover:text-[#023A51]"
                    >
                      {heading.level === 2 && (
                        <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#EAF7F0] text-[10px] font-bold text-[#14864B]">
                          {headings.slice(0, index + 1).filter((item) => item.level === 2).length}
                        </span>
                      )}
                      <span>{heading.text}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {recentPosts.length > 0 && (
            <section className="rounded-2xl border border-[#E5ECEF] bg-white p-6 shadow-xs">
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#EDF1F3] pb-4">
                <h2 className="flex items-center gap-2 text-[15px] font-bold text-[#023A51]">
                  <FileText className="h-4 w-4 text-[#14864B]" /> Recent Articles
                </h2>
                <Link href="/blog" className="inline-flex items-center gap-1 text-xs font-semibold text-[#56686A] hover:text-[#023A51] transition">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="space-y-4">
                {recentPosts.map((related) => (
                  <Link key={`post-${related.id}`} href={`/blog/${related.slug}`} className="group flex gap-3">
                    <ArticleThumbnail src={related.featured_image} alt="" />
                    <div className="min-w-0 py-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                        {related.category || 'Article'}
                      </span>
                      <h3 className="mt-1 line-clamp-2 text-[13px] font-bold leading-snug text-[#023A51] group-hover:text-[#14864B] transition-colors">
                        {related.title}
                      </h3>
                      <p className="mt-1 text-[11px] text-[#64748B]">{related.read_time || ''}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </aside>
        </div>
      </div>
    </article>
  );
}

function ArticleThumbnail({ src, alt }: { src?: string; alt: string }) {
  return <div className="relative h-[76px] w-[84px] shrink-0 overflow-hidden rounded-lg bg-[#EAF2F2]">
    {src ? <Image src={publicMediaUrl(src) || src} alt={alt} fill sizes="84px" className="object-cover transition duration-300 group-hover:scale-105" /> : <FileText className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-[#8AA4A8]" />}
  </div>;
}
