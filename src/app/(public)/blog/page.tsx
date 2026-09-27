'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  BookOpen,
  Clock,
  User,
  ArrowRight,
  Search,
  ReceiptText,
  FileCheck,
  TrendingUp,
  Mail,
  Send,
} from 'lucide-react';

export default function BlogPage() {
  const { blogPosts } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const categories = ['All', 'Tax Updates', 'Finance', 'Business', 'Compliance', 'Accounting', 'Corporate Law'];

  const published = blogPosts.filter((p) => {
    if (p.status !== 'published') return false;
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-16 lg:space-y-20 py-12 pb-20">
      {/* 1. Hero Section matching Ideas/blogpage.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F26430]">
              <span>Our Blog</span>
              <span className="h-px w-8 bg-[#F26430] inline-block" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-[1.15]">
              Insights, Updates & Financial Knowledge
            </h1>

            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              Stay informed with the latest tax amendments, practical compliance blueprints, regulatory circulars, and expert advice from our Chartered Accountants.
            </p>

            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap gap-4 text-xs text-slate-600 font-medium">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-[#F26430]">
                <ReceiptText className="w-3.5 h-3.5" />
                <span>Latest Tax Updates</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Expert Insights</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Practical Guidance</span>
              </span>
            </div>
          </div>

          {/* Right Featured Article Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#14213D] text-white rounded-2xl p-8 border border-slate-800 shadow-xl space-y-4">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Featured Publication
              </div>

              <h2 className="text-xl font-serif font-bold leading-snug">
                New Tax Rules & E-Billing Directives: Key Takeaways for Corporate Taxpayers
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed">
                Stay updated with the latest Inland Revenue Department mandates and discover how they affect your business filings and withholding calculations.
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                    CA
                  </div>
                  <span className="text-slate-200 font-medium">CA Narahari Adhikari</span>
                </div>

                <Link
                  href="/tax-updates"
                  className="inline-flex items-center gap-1 font-bold text-[#F26430] hover:text-[#DC5322]"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Filter Pills (Matching Ideas/blogpage.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#F26430] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Main Two-Column Grid: Articles + Sidebar (Matching Ideas/blogpage.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Article Cards Grid (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {published.map((post) => (
                <article
                  key={post.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700">
                        {post.category}
                      </span>
                      <span className="font-mono">{post.published_at}</span>
                    </div>

                    <h2 className="text-base font-serif font-bold text-slate-900 group-hover:text-[#F26430] transition-colors mb-2 leading-snug">
                      {post.title}
                    </h2>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">{post.author}</span>
                    <span className="font-bold text-[#F26430] flex items-center gap-1 group-hover:underline">
                      <span>Read More</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right: Sidebar (4 cols) matching Ideas/blogpage.png */}
          <div className="lg:col-span-4 space-y-8">
            {/* Search Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-[#F26430] focus:outline-none"
                />
              </div>
            </div>

            {/* Categories Widget */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3 text-xs">
              <h3 className="font-serif font-bold text-slate-900 text-sm border-b pb-2">
                Categories
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'Tax Updates', count: 12 },
                  { name: 'Finance & Audits', count: 10 },
                  { name: 'Corporate Compliance', count: 8 },
                  { name: 'Accounting & Payroll', count: 7 },
                  { name: 'Company Secretarial', count: 5 },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setSelectedCategory(item.name === 'Tax Updates' ? 'Tax Updates' : 'All')}
                    className="w-full flex items-center justify-between text-slate-600 hover:text-[#F26430] py-1 transition-colors"
                  >
                    <span>{item.name}</span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter Subscribe Box (Matching Ideas/blogpage.png) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3 text-xs">
              <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F26430]">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-sm">
                Get the Latest Updates
              </h3>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Subscribe to our newsletter and never miss important tax circulars, deadline alerts, and regulatory changes.
              </p>

              {subscribed ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded font-semibold text-[11px]">
                  ✓ Subscribed! You will receive our tax circular digests.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubscribed(true);
                  }}
                  className="space-y-2 pt-1"
                >
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-[#F26430] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#F26430] hover:bg-[#DC5322] text-white font-semibold rounded text-xs transition-colors shadow-xs"
                  >
                    Subscribe Now
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
