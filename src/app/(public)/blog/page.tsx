'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Search, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

export default function BlogPage() {
  const { blogPosts } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('View all');
  const [searchQuery, setSearchQuery] = useState('');

  const publishedPosts = blogPosts.filter((post) => post.status === 'published');

  const categories = [
    'View all',
    'Corporate Tax',
    'Audit & Assurance',
    'VAT & Invoicing',
    'Business Advisory',
    'Regulatory Law',
  ];

  const filteredPosts = publishedPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'View all' ||
      post.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-28 overflow-x-hidden bg-[#FAFCFD]">
      {/* 1. Header Section matching Ideas/BLOG IDEA.webp */}
      <section id="hero-section" className="relative border-b border-[#E8EBEF] bg-white pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#2CBC63]">
                Practice Journal & Articles
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#023A51] tracking-tight leading-tight">
                Tax, Business & Legal Insights<span className="text-[#2CBC63]">.</span>
              </h1>
              <p className="text-base sm:text-[17px] text-[#4A5259] leading-relaxed max-w-xl">
                Practical tax advisories, corporate compliance frameworks, and business accounting guides authored by CA Narahari Adhikari.
              </p>
            </div>

            <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[#023A51] underline decoration-[#2CBC63] underline-offset-4 hover:text-[#2CBC63] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#023A51]">
              Suggest a topic for the journal <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          {/* 2. Category Filter Tabs matching Untitled UI */}
          <div className="mt-10 sm:mt-12 flex items-center justify-between border-t border-[#E8EBEF] pt-4 overflow-x-auto no-scrollbar gap-4">
            <nav className="flex items-center gap-2 sm:gap-4 shrink-0" aria-label="Blog categories">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`relative py-2.5 px-3 text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'text-[#023A51]'
                        : 'text-[#64748B] hover:text-[#023A51]'
                    }`}
                  >
                    <span>{cat}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#023A51] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Search */}
            <div className="relative shrink-0 hidden md:block w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full h-9 pl-8 pr-3 text-xs rounded-full border border-[#E8EBEF] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2CBC63]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Article Grid matching Ideas/BLOG IDEA.webp */}
      <div className="mx-auto max-w-[1240px] px-6 pt-12 sm:pt-16">
        {filteredPosts.length === 0 ? (
          <div className="rounded-3xl border border-[#E8EBEF] bg-white p-16 text-center shadow-xs">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2CBC63]">
              No articles found
            </p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#023A51]">
              No articles match your selection.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-[#59667D]">
              Try selecting a different category or clearing your search query.
            </p>
            <Button
              onClick={() => {
                setSelectedCategory('View all');
                setSearchQuery('');
              }}
              className="mt-6 rounded-full bg-[#023A51] hover:bg-[#2CBC63] text-xs font-bold"
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 sm:gap-10">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col bg-white rounded-3xl border border-[#E8EBEF] overflow-hidden hover:shadow-xl hover:border-[#CCD7DC] transition-all duration-300"
              >
                {/* Featured Photo with Floating Glassmorphic Author Badge */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={post.featured_image || '/services/service-tax.jpg'}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient darkening at base for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Floating Glassmorphic Badge matching reference image */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl backdrop-blur-md bg-white/20 border border-white/30 px-3.5 py-2 text-white shadow-lg">
                    <div className="text-[12px] font-medium leading-tight">
                      <span className="font-bold">{post.author || 'CA Narahari Adhikari'}</span>
                      <span className="mx-1.5 opacity-60">•</span>
                      <span className="text-[11px] opacity-90">{post.published_at}</span>
                    </div>
                    <span className="rounded-md bg-white/30 backdrop-blur-xs px-2 py-0.5 text-[10.5px] font-bold text-white uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-[#59667D]">
                      <span className="inline-flex items-center gap-1 font-semibold text-[#023A51]">
                        <Clock className="w-3.5 h-3.5 text-[#2CBC63]" />
                        {post.read_time || '6 min read'}
                      </span>
                      <span>•</span>
                      <span className="text-slate-500">Income Tax & Reporting</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-[#023A51] leading-snug group-hover:text-[#2CBC63] transition-colors underline-offset-4 group-hover:underline">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-sm text-[#4A5259] leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E8EBEF] flex items-center justify-between">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#023A51] group-hover:text-[#2CBC63] transition-colors"
                    >
                      <span>Read article</span>
                      <ArrowUpRight className="w-4 h-4 text-[#2CBC63] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>

                    <Link
                      href="/book-appointment"
                      className="text-xs font-semibold text-[#59667D] hover:text-[#023A51]"
                    >
                      Consult on this topic &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Practice Consultation Banner at bottom */}
        <section className="mt-16 sm:mt-20 rounded-3xl bg-[#023A51] p-8 sm:p-12 text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2CBC63]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#2CBC63]">
                Direct Professional Advice
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Have a specific tax query or pending IRD audit?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Schedule a direct consultation with CA Narahari Adhikari to examine your books, review assessment notices, and structure your corporate compliance.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <Link
                href="/book-appointment"
                className="px-6 py-3 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-xs sm:text-sm text-center transition-all shadow-sm"
              >
                Schedule Consultation
              </Link>
              <Link
                href="/tax-updates"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm text-center transition-all border border-white/20"
              >
                View Tax Updates
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
