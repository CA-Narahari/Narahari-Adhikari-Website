'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { sanitizeHtml } from '@/lib/sanitize-html';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Check,
  Copy,
  ArrowRight,
  Phone,
  FileText,
  BookOpen,
} from 'lucide-react';

export default function BlogArticlePage() {
  const { blogPosts, settings } = useApp();
  const params = useParams();
  const slugParam = typeof params?.slug === 'string' ? params.slug : '';

  const [copied, setCopied] = useState(false);

  const post = blogPosts.find(
    (item) => item.status === 'published' && item.slug.toLowerCase() === slugParam.toLowerCase()
  );

  const structuredData = post ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.meta_description || post.excerpt,
    datePublished: post.published_at,
    author: { '@type': 'Person', name: post.author || 'CA Narahari Adhikari' },
    image: post.featured_image ? [post.featured_image] : undefined,
  } : null;

  // Extract headings from content for dynamic Table of Contents
  const headings = useMemo(() => {
    if (!post?.content) return [];
    const list: { id: string; text: string }[] = [];

    // Check for HTML h2 tags
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
    let match;
    let index = 0;
    while ((match = h2Regex.exec(post.content)) !== null) {
      const cleanText = match[1].replace(/<[^>]+>/g, '').trim();
      if (cleanText) {
        list.push({
          id: `heading-${index++}`,
          text: cleanText,
        });
      }
    }

    // If no HTML h2 tags, check for lines starting with numbers like "1. ", "2. "
    if (list.length === 0) {
      const lines = post.content.split('\n');
      lines.forEach((line) => {
        const trimmed = line.trim();
        if (/^\d+\.\s+[A-Za-z]/.test(trimmed)) {
          list.push({
            id: `sec-${index++}`,
            text: trimmed,
          });
        }
      });
    }

    return list;
  }, [post?.content]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return blogPosts
      .filter((p) => p.status === 'published' && p.id !== post.id)
      .slice(0, 3);
  }, [blogPosts, post]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Convert plain text into HTML paragraphs if raw text is provided
  const formattedHtml = useMemo(() => {
    if (!post?.content) return '<p>No content published yet.</p>';
    if (
      post.content.includes('<p>') ||
      post.content.includes('<div') ||
      post.content.includes('<h1') ||
      post.content.includes('<h2') ||
      post.content.includes('<figure')
    ) {
      return sanitizeHtml(post.content);
    }
    return sanitizeHtml(post.content
      .split(/\n\n+/)
      .map((block) => {
        const trimmed = block.trim();
        if (/^\d+\.\s+[A-Za-z]/.test(trimmed)) {
          const [title, ...rest] = trimmed.split('\n');
          return `<h2 class="text-xl sm:text-2xl font-bold text-[#023A51] mt-8 mb-3">${title}</h2><p class="leading-relaxed text-[#33475B]">${rest.join('<br/>')}</p>`;
        }
        return `<p class="my-4 leading-relaxed text-[#33475B]">${trimmed.replace(/\n/g, '<br/>')}</p>`;
      })
      .join(''));
  }, [post?.content]);

  if (!post) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-[#023A51]">Article Not Found</h1>
        <p className="mt-2 text-sm text-[#59667D]">
          The article you are looking for has not been published yet or the link may have changed.
        </p>
        <Link
          href="/blog"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#023A51] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#2CBC63] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to All Articles
        </Link>
      </div>
    );
  }

  return (
    <article className="pb-28 bg-[#FAFCFD] overflow-x-hidden">
      {structuredData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />}
      {/* 1. Header Section */}
      <section id="hero-section" className="relative bg-hero-gradient pt-8 pb-12 sm:pt-12 sm:pb-16 overflow-hidden">
        <div className="mx-auto max-w-[1140px] px-6">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#59667D] hover:text-[#023A51] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all articles
          </Link>

          {/* Title & Metadata */}
          <div className="mt-6 max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-[#E8F4F8] text-[#023A51] text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#023A51] leading-[1.2] tracking-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-[13px] text-[#59667D] pt-1">
              <span className="font-semibold text-[#023A51]">{post.author || 'CA Narahari Adhikari, FCA'}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#2CBC63]" />
                {post.published_at}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#2CBC63]" />
                {post.read_time || '6 min read'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Hero Featured Image */}
      {post.featured_image && (
        <div className="mx-auto max-w-[1140px] px-6 pt-8 sm:pt-10">
          <div className="relative aspect-[16/8] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden shadow-md border border-[#E8EBEF] bg-slate-100">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1140px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* 3. Two Column Editorial Body */}
      <div className="mx-auto max-w-[1140px] px-6 pt-10 sm:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Sticky Sidebar (~30%) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-[#E8EBEF] p-6 shadow-xs space-y-5">
              {headings.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    Table of Contents
                  </h3>
                  <nav className="mt-3 space-y-1.5" aria-label="Article outline">
                    {headings.map((sec, i) => (
                      <div
                        key={sec.id}
                        className="py-1.5 px-3 rounded-lg text-xs font-semibold text-[#64748B] hover:text-[#023A51] hover:bg-slate-50 transition-colors"
                      >
                        <span className="text-[#2CBC63] mr-1.5">{String(i + 1).padStart(2, '0')}.</span>
                        <span>{sec.text}</span>
                      </div>
                    ))}
                  </nav>
                </div>
              )}

              {/* Share Article */}
              <div className="pt-4 border-t border-[#E8EBEF] space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Share this article
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#E8F4F8] text-[#023A51] hover:bg-[#2CBC63] hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
                    title="Share on WhatsApp"
                  >
                    W
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#E8F4F8] text-[#023A51] hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
                    title="Share on LinkedIn"
                  >
                    in
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full bg-[#E8F4F8] text-[#023A51] hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#2CBC63]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Consultation Box */}
            <div className="bg-[#023A51] text-white rounded-2xl p-6 shadow-sm space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2CBC63]/20 rounded-full blur-xl pointer-events-none" />
              <h4 className="text-sm font-bold !text-white text-white relative z-10">
                Facing a Tax or Audit Inquery?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed relative z-10">
                Speak directly with CA Narahari Adhikari to review your statutory records and advisory requirements.
              </p>
              <div className="pt-1 relative z-10 flex flex-col gap-2">
                <Link
                  href="/book-appointment"
                  className="w-full py-2.5 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-xs text-center transition-all shadow-xs"
                >
                  Schedule Consultation
                </Link>
                <a
                  href={`tel:${settings.phone}`}
                  className="w-full py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs text-center transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3 h-3 text-[#2CBC63]" />
                  <span>Call {settings.phone}</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Right Column: Dynamic Narrative Editorial Content */}
          <main className="lg:col-span-8 space-y-8 text-[#33475B]">
            {/* Lead Excerpt */}
            {post.excerpt && (
              <div className="p-6 rounded-2xl bg-[#E8F4F8]/70 border border-[#CCD7DC] text-[#023A51] text-base sm:text-[17px] font-medium leading-relaxed shadow-2xs">
                {post.excerpt}
              </div>
            )}

            {/* Dynamic Article HTML/Text Content */}
            <div
              className="prose prose-slate max-w-none text-[15px] sm:text-base leading-[1.85] text-[#33475B] prose-headings:text-[#023A51] prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:my-4 prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1.5 prose-blockquote:border-l-4 prose-blockquote:border-[#2CBC63] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[#023A51] prose-img:rounded-2xl prose-img:shadow-md prose-img:my-6 prose-a:text-[#1A8F4B] prose-a:underline"
              dangerouslySetInnerHTML={{ __html: formattedHtml }}
            />

            {/* Tags footer */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-6 border-t border-[#E8EBEF] flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#023A51]">Tags:</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-slate-100 hover:bg-[#E8F4F8] text-xs font-medium text-slate-700 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author Profile Block */}
            <div className="mt-12 rounded-3xl border border-[#CCD7DC] bg-[#E8F4F8] p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-2xs">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-sm shrink-0 bg-white border border-[#CCD7DC]">
                <Image
                  src="/profile-picture.png"
                  alt="CA Narahari Adhikari"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2CBC63]">
                  Author Profile
                </span>
                <h3 className="text-lg font-bold text-[#023A51]">
                  CA Narahari Adhikari, FCA
                </h3>
                <p className="text-xs sm:text-[13px] text-[#4A5259] leading-relaxed">
                  Principal Chartered Accountant at Narahari Adhikari &amp; Co. Advising Nepali enterprises, joint ventures, and multinational organisations on tax litigation, statutory audit, and NFRS financial reporting.
                </p>
                <div className="pt-2">
                  <Link
                    href="/book-appointment"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#023A51] hover:text-[#2CBC63]"
                  >
                    <span>Request direct consultation with the author</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#2CBC63]" />
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* 4. Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#E8EBEF]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2CBC63]">
                  Knowledge Base
                </span>
                <h3 className="text-2xl font-bold text-[#023A51] mt-1">
                  Related Practice Articles
                </h3>
              </div>
              <Link
                href="/blog"
                className="text-xs font-bold text-[#023A51] hover:text-[#2CBC63] inline-flex items-center gap-1"
              >
                <span>View all articles</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2CBC63]" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group bg-white rounded-2xl border border-[#E8EBEF] p-5 hover:shadow-lg hover:border-[#CCD7DC] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold uppercase text-[#2CBC63]">
                      {rel.category}
                    </span>
                    <h4 className="font-bold text-[#023A51] text-base leading-snug group-hover:text-[#2CBC63] transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-[#59667D] leading-relaxed line-clamp-2">
                      {rel.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#023A51] group-hover:text-[#2CBC63]">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#2CBC63] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
