'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Calendar, Clock, Mail } from 'lucide-react';

interface BlogPostItem {
  id: string;
  category: string;
  categoryColor?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}

const FEATURED_POST: BlogPostItem = {
  id: 'featured-1',
  category: 'Taxation & Compliance',
  title: 'New Corporate Tax Directives & E-Billing (CBMS) Implementation in Nepal',
  excerpt:
    'A practical analysis of mandatory digital invoicing synchronizations, revised credit note timelines, and IRD inspection readiness for commercial entities.',
  content: `The Inland Revenue Department (IRD) has tightened electronic billing mandates under the Central Billing Monitoring System (CBMS). Commercial taxpayers with turnover exceeding prescribed thresholds must now maintain real-time sync with tax authorities.

Key Operational Priorities:
1. System Integration: Verify API synchronization between your billing ERP/POS and the IRD CBMS servers.
2. Credit Note Documentation: Issue credit notes strictly within 7 working days from return of goods.
3. Daily Sales Backups: Maintain local encrypted copies of daily closing sales logs.

Our practice advises corporate clients on pre-audit reconciliation to prevent punitive assessments under Section 19 of the VAT Act.`,
  author: 'CA Narahari Adhikari',
  authorRole: 'Chartered Accountant',
  authorAvatar: '/profile-picture.png',
  date: 'Sep 24, 2026',
  readTime: '6 min read',
  image: '/services/service-tax.jpg',
  tags: ['Income Tax', 'CBMS Invoicing', 'VAT Compliance'],
};

const BLOG_POSTS: BlogPostItem[] = [
  {
    id: '1',
    category: 'Statutory Audit',
    categoryColor: 'text-[#4F46E5]',
    title: 'Internal Audit Frameworks: Safeguarding Enterprise Value and Governance',
    excerpt:
      'Designing risk-based internal control systems that detect operational bottlenecks and comply with Nepal Standards on Auditing.',
    content: `Internal audit is not merely a formality before year-end compliance; it is an active management tool. By systematically evaluating transaction trails, segregation of duties, and authorization hierarchies, management can pre-empt regulatory vulnerabilities.`,
    author: 'CA Narahari Adhikari',
    authorRole: 'Audit Practice Lead',
    authorAvatar: '/profile-picture.png',
    date: 'Sep 18, 2026',
    readTime: '5 min read',
    image: '/services/service-audit.jpg',
    tags: ['Internal Controls', 'NSA Standards'],
  },
  {
    id: '2',
    category: 'Corporate Finance',
    categoryColor: 'text-[#0284C7]',
    title: 'Navigating Corporate Mergers and Due Diligence in Nepal',
    excerpt:
      'Strategic considerations for buy-side and sell-side transactions, asset valuation techniques, and regulatory filings with SEBON and OCR.',
    content: `Mergers and acquisitions in Nepal demand meticulous scrutiny of past tax filings, contingent liabilities, and title verification of immovable property. A structured due diligence review provides the foundation for accurate share swap ratios.`,
    author: 'CA Narahari Adhikari',
    authorRole: 'M&A Advisory',
    authorAvatar: '/profile-picture.png',
    date: 'Sep 12, 2026',
    readTime: '7 min read',
    image: '/services/service-ma.jpg',
    tags: ['Valuation', 'Due Diligence'],
  },
  {
    id: '3',
    category: 'Financial Reporting',
    categoryColor: 'text-[#7C3AED]',
    title: 'First-Time NFRS/IFRS Adoption: Strategic Roadmap for Corporates',
    excerpt:
      'Step-by-step guidance on opening balance sheet adjustments, complex financial instrument disclosures, and accounting policy alignment.',
    content: `Transitioning to Nepal Financial Reporting Standards (NFRS) requires moving from historical cost models to fair value assessments, particularly for leases (NFRS 16) and credit impairment (NFRS 9).`,
    author: 'CA Narahari Adhikari',
    authorRole: 'Technical Standards',
    authorAvatar: '/profile-picture.png',
    date: 'Sep 05, 2026',
    readTime: '8 min read',
    image: '/services/service-ifrs.jpg',
    tags: ['NFRS Compliance', 'Financial Statements'],
  },
  {
    id: '4',
    category: 'Strategic Advisory',
    categoryColor: 'text-[#059669]',
    title: 'Strategic Financial Restructuring for Growing Enterprises',
    excerpt:
      'Actionable approaches to capital optimization, debt restructuring, and building bankable project feasibility reports for institutions.',
    content: `When scaling operations or managing high debt servicing burdens, restructuring capital structure and optimizing working capital cycles provide the liquidity cushion required for sustainable expansion.`,
    author: 'CA Narahari Adhikari',
    authorRole: 'Advisory Practice',
    authorAvatar: '/profile-picture.png',
    date: 'Aug 28, 2026',
    readTime: '5 min read',
    image: '/services/service-advisory.jpg',
    tags: ['Working Capital', 'Restructuring'],
  },
  {
    id: '5',
    category: 'Payroll & HR Compliance',
    categoryColor: 'text-[#D97706]',
    title: 'Outsourced Accounting and Payroll Operations in Nepal',
    excerpt:
      'Leveraging cloud-based bookkeeping and payroll administration to maintain strict compliance with Labor Act 2074 and SSF mandates.',
    content: `Mandatory employer (20%) and employee (11%) Social Security Fund (SSF) contributions, alongside progressive salary TDS withholding, necessitate error-free monthly reconciliation to avoid penal interest.`,
    author: 'CA Narahari Adhikari',
    authorRole: 'BPO Services',
    authorAvatar: '/profile-picture.png',
    date: 'Aug 20, 2026',
    readTime: '4 min read',
    image: '/services/service-bpo.jpg',
    tags: ['Labor Act 2074', 'SSF Online'],
  },
  {
    id: '6',
    category: 'Corporate Governance',
    categoryColor: 'text-[#DC2626]',
    title: 'Company Secretarial Compliance: Annual OCR Filings & Share Registry',
    excerpt:
      'A checklist of statutory compliance under Company Act 2063, covering annual general meeting minutes, share transfers, and board resolutions.',
    content: `Timely submission of annual returns (Section 51 and Section 78) to the Office of the Company Registrar (OCR) ensures your company status remains active and prevents statutory fines against directors.`,
    author: 'CA Narahari Adhikari',
    authorRole: 'Corporate Law Advisory',
    authorAvatar: '/profile-picture.png',
    date: 'Aug 14, 2026',
    readTime: '6 min read',
    image: '/services/service-training.jpg',
    tags: ['Company Act', 'OCR Nepal'],
  },
];

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPostItem | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setIsSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="pb-24 overflow-x-hidden">
      {/* 1. Header Section matching Reference Layout */}
      <section
        id="hero-section"
        className="relative bg-hero-gradient pt-8 pb-12 sm:pt-12 sm:pb-16 overflow-hidden"
      >
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              Fiscal Briefings & Professional Insights<span className="text-[#2CBC63]">.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-[17px] text-[#33475B] font-normal leading-relaxed">
              Authoritative commentary, statutory gazette analyses, and auditing frameworks curated by Fellow Chartered Accountants in Nepal.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-6 pt-10 sm:pt-12 space-y-12">
        {/* ======================================================== */}
        {/* 2. FEATURED HERO ARTICLE CARD matching Reference Image */}
        {/* ======================================================== */}
        <section>
          <div
            onClick={() => setSelectedPost(FEATURED_POST)}
            className="group relative w-full rounded-[28px] sm:rounded-[36px] overflow-hidden min-h-[380px] sm:min-h-[460px] flex items-end cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {/* Background Image */}
            <Image
              src={FEATURED_POST.image}
              alt={FEATURED_POST.title}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent pointer-events-none" />

            {/* Overlay Content */}
            <div className="relative z-10 p-6 sm:p-10 text-white w-full space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white border border-white/20">
                    {FEATURED_POST.category}
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-white leading-tight tracking-tight group-hover:text-[#8BE0A8] transition-colors">
                    {FEATURED_POST.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl line-clamp-2">
                    {FEATURED_POST.excerpt}
                  </p>
                </div>

                {/* Arrow Icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 group-hover:bg-[#2CBC63] group-hover:border-[#2CBC63] transition-all">
                  <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>

              {/* Bottom Meta Row */}
              <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs">
                {/* Author & Date */}
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full overflow-hidden relative border border-white/40 shrink-0">
                      <Image
                        src={FEATURED_POST.authorAvatar}
                        alt={FEATURED_POST.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-semibold text-white">{FEATURED_POST.author}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-300" />
                    <span>{FEATURED_POST.date}</span>
                  </div>
                </div>

                {/* Tag Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {FEATURED_POST.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] text-white border border-white/15"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. BLOG POSTS GRID (3 Columns, clean human editorial) */}
        {/* (No topic selector tabs, no search bar, as requested) */}
        {/* ======================================================== */}
        <section className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group flex flex-col justify-between cursor-pointer space-y-4"
              >
                <div>
                  {/* Top Image */}
                  <div className="relative aspect-[16/10] w-full rounded-[22px] overflow-hidden bg-slate-100 border border-[#E8EBEF] shadow-xs">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Category Label */}
                  <div className="mt-4">
                    <span
                      className={`text-xs font-bold tracking-normal ${
                        post.categoryColor || 'text-[#4F46E5]'
                      }`}
                    >
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[17.5px] sm:text-[18.5px] font-bold text-[#023A51] leading-snug group-hover:text-[#2CBC63] transition-colors mt-1.5 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-[13px] text-[#59667D] leading-relaxed mt-2 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                {/* Bottom Meta Row: Author Avatar + Name on Left, Read Time on Right */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#59667D]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden relative border border-slate-200 shrink-0">
                      <Image
                        src={post.authorAvatar}
                        alt={post.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-semibold text-[#023A51] text-[12px]">{post.author}</span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{post.readTime}</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. NEWSLETTER / DIGEST SUBSCRIPTION (Minimal, Clean) */}
        {/* ======================================================== */}
        <section className="pt-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#E8F4F8] border border-[#CCD7DC]/70 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 max-w-lg text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-bold text-[#023A51]">
                <Mail className="w-4 h-4 text-[#2CBC63]" />
                <span>Receive Editorial Briefings</span>
              </div>
              <p className="text-xs text-[#59667D] leading-relaxed">
                Stay informed with our periodic technical summaries covering national budget analyses, IRD directives, and auditing standards.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email address"
                className="px-4 py-2.5 rounded-full border border-[#CCD7DC] bg-white text-xs text-[#023A51] placeholder:text-[#93999F] focus:outline-none focus:border-[#023A51] w-full sm:w-64"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#023A51] hover:bg-[#2CBC63] text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Article Detail Reading Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto space-y-5 border border-[#E8EBEF] shadow-2xl">
            <div className="flex items-start justify-between border-b pb-4 gap-4">
              <div>
                <span className="text-xs font-bold text-[#2CBC63] uppercase tracking-wider">
                  {selectedPost.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#023A51] mt-1">
                  {selectedPost.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 font-mono">
                  <span>By {selectedPost.author}</span>
                  <span>&bull;</span>
                  <span>{selectedPost.date}</span>
                  <span>&bull;</span>
                  <span>{selectedPost.readTime}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="relative h-60 w-full rounded-2xl overflow-hidden">
              <Image
                src={selectedPost.image}
                alt={selectedPost.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-4 text-xs sm:text-[13.5px] text-[#33475B] leading-relaxed whitespace-pre-line">
              <p className="font-semibold text-[#023A51]">{selectedPost.excerpt}</p>
              <p>{selectedPost.content}</p>
              <p>
                For tailored assessment or confidential advisory regarding these matters, you may request a direct consultation with our practice.
              </p>
            </div>

            <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {selectedPost.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-[#023A51] font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2 rounded-full bg-[#023A51] text-white text-xs font-bold hover:bg-[#2CBC63] transition-colors cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
