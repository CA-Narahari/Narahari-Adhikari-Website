'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, BookOpen, ArrowUpRight } from 'lucide-react';
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
                Practical tax advisories, corporate compliance blueprints, and business accounting guides authored by CA Narahari Adhikari.
              </p>
            </div>
          </div>
      </section>

      {/* 2. Grid with same 3-column architecture as Service Cards */}
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
              <div key={post.id} className="flex flex-col">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col h-full bg-[#E5F1F6] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-white/60"
                >
                  {/* Article Top Image */}
                  <div className="relative h-[210px] sm:h-[220px] w-full overflow-hidden bg-slate-200 shrink-0">
                    <Image
                      src={publicMediaUrl(post.featured_image) || '/Logo.png'}
                      alt={post.image_alt || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-white/95 backdrop-blur-xs text-[#023A51] flex items-center justify-center shadow-md">
                      <BookOpen className="w-4 h-4 text-[#023A51]" />
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10.5px] font-bold border border-white/20">
                      <Clock className="w-3 h-3 text-[#2CBC63]" />
                      <span>{post.read_time || '5 min read'}</span>
                    </div>
                  </div>

                  {/* Article Bottom Details matching Home Service Cards */}
                  <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 bg-[#E5F1F6]">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#2CBC63]">
                          {post.category}
                        </span>
                        <span className="text-[11px] text-[#1D5367]/75 font-medium">
                          {post.published_at}
                        </span>
                      </div>
                      <h3 className="mt-2 text-[18px] sm:text-[19px] font-bold text-[#023A51] leading-snug group-hover:text-[#2CBC63] transition-colors">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-[13px] sm:text-[13.5px] text-[#1D5367] leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Explore Link + Yellow Arrow Circle */}
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-bold text-[#023A51] group-hover:text-[#2CBC63] transition-colors">
                          Read Article
                        </span>
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FFD000] flex items-center justify-center text-[#023A51] shadow-xs group-hover:scale-110 group-hover:rotate-12 transition-transform duration-200">
                          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-[#1D5367]/80">
                        {post.author ? post.author.split(',')[0] : 'CA Narahari'}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Bottom Consultation Banner matching Services */}
      <section className="max-w-[1240px] mx-auto px-6 mt-16 sm:mt-20">
        <div className="rounded-3xl bg-[#023A51] p-8 sm:p-12 text-white relative overflow-hidden shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2CBC63]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 relative z-10 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2CBC63]">
              Chartered Advisory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold !text-white text-white tracking-tight">
              Require specific regulatory or tax guidance?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Schedule an in-person meeting or online session with CA Narahari Adhikari to analyze your company&apos;s financial and statutory standing.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              href="/book-appointment"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2CBC63] hover:bg-[#25a556] text-[#023A51] font-bold text-sm transition-all shadow-md active:scale-95"
            >
              <span>Book Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
