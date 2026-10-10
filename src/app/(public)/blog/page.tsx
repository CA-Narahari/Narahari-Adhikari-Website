'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { publicMediaUrl } from '@/lib/media-url';

export default function BlogPage() {
  const { blogPosts } = useApp();
  const publishedPosts = blogPosts.filter((post) => post.status === 'published');

  return (
    <div className="pb-28 overflow-x-hidden bg-[#FAFCFD]">
      {/* 1. Header Section matching Services Hero */}
      <section
        id="hero-section"
        className="relative bg-hero-gradient pt-8 pb-14 sm:pt-12 sm:pb-16 overflow-hidden"
      >
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              Tax, Business &amp; Legal Insights<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-[17px] text-[#4A5259] leading-relaxed">
              Practical tax advisories, corporate compliance blueprints, and business accounting guides authored by Narahari Adhikari.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Grid with 3-column architecture matching Services */}
      <section className="max-w-[1240px] mx-auto px-6 pt-12 sm:pt-16">
        {publishedPosts.length === 0 ? (
          <div className="rounded-3xl border border-[#E8EBEF] bg-white p-16 text-center shadow-xs">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2CBC63]">
              No articles found
            </p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#023A51]">
              No articles published yet.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-[#59667D]">
              New practice publications will be posted here soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedPosts.map((post) => (
              <div
                key={post.id}
                className="group flex flex-col justify-between bg-white rounded-3xl border border-[#E8EBEF] overflow-hidden hover:shadow-xl hover:border-[#CCD7DC] transition-all duration-300"
              >
                <div>
                  {/* Article Photo: Clean, no floating icons */}
                  <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={publicMediaUrl(post.featured_image) || '/Logo.png'}
                      alt={post.image_alt || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>

                  {/* Card Content */}
                  <div className="p-6 sm:p-7 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#14864B]">
                        {post.category || 'Article'}
                      </span>
                      {post.published_at && (
                        <span className="text-[11px] text-[#59667D] font-medium">
                          {post.published_at}
                        </span>
                      )}
                    </div>
                    <h2 className="text-[17px] font-bold text-[#023A51] leading-snug group-hover:text-[#14864B] transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-xs sm:text-[13.5px] text-[#56686A] leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Direct Action and Author */}
                <div className="px-6 sm:px-7 pb-6 pt-2">
                  <div className="pt-4 border-t border-[#E8EBEF] flex items-center justify-between">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#023A51] group-hover:text-[#012534] transition-colors"
                    >
                      <span>Read Article</span>
                      <span className="w-6 h-6 rounded-full bg-[#F5B800] text-[#023A51] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                    </Link>

                    <div className="text-xs font-medium text-[#59667D] text-right truncate max-w-[180px]">
                      {post.author ? post.author.replace(/^CA\s+/i, '').split(',')[0].trim() : 'Narahari Adhikari'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
