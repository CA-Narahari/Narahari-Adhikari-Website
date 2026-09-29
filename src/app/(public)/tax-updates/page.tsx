'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  Clock,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Mail,
  ArrowRight,
  Sparkles,
  Building,
  CheckCircle2,
  Download,
  AlertTriangle,
  Receipt,
  MessageSquare,
} from 'lucide-react';
import { TaxUpdate } from '@/types';

export default function TaxUpdatesPage() {
  const { taxUpdates, downloads } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(taxUpdates[0]?.id || null);

  const [digestEmail, setDigestEmail] = useState('');
  const [digestSubscribed, setDigestSubscribed] = useState(false);

  // Type Filters
  const types = ['All', 'Update', 'Deadline', 'Guide', 'Sector Note'];

  // Topic Filters
  const topics = ['All', 'VAT', 'Income Tax', 'Corporate Tax', 'Finance Acts', 'Circulars'];

  // Compliance Deadlines for Standing Calendar Widget
  const upcomingDeadlines = [
    {
      title: 'Monthly VAT Return & E-TDS Deposit',
      frequency: 'Monthly Recurring',
      dueDate: '25th of Every Nepali Month',
      appliesTo: 'All VAT registered entities & withholding agents',
      penaltyNote: 'Sec 19 fine: 0.1%/day or NPR 1,000/month',
      isUrgent: true,
    },
    {
      title: '1st Advance Corporate Tax Installment (40%)',
      frequency: 'Fiscal Milestone',
      dueDate: 'End of Poush (Mid January)',
      appliesTo: 'All corporate entities with taxable income > 0',
      penaltyNote: 'Sec 118 statutory interest 15% on shortfall',
      isUrgent: false,
    },
    {
      title: '2nd Advance Corporate Tax Installment (70%)',
      frequency: 'Fiscal Milestone',
      dueDate: 'End of Chaitra (Mid April)',
      appliesTo: 'All corporate taxpayers (cumulative 70%)',
      penaltyNote: 'Statutory interest applicable under Sec 118',
      isUrgent: false,
    },
    {
      title: 'Annual Income Tax Return (ITR) Filing',
      frequency: 'Annual',
      dueDate: 'End of Ashwin (Extended to Poush)',
      appliesTo: 'All commercial entities, sole proprietors, firms',
      penaltyNote: 'Sec 117 fee + disqualification of tax clearance',
      isUrgent: false,
    },
  ];

  // Filtered Tax Updates
  const filteredUpdates = taxUpdates.filter((item) => {
    if (item.status !== 'published') return false;

    // Filter by Type
    const matchesType =
      selectedType === 'All' ||
      item.update_type === selectedType ||
      (selectedType === 'Update' && !item.update_type);

    // Filter by Topic
    const matchesTopic = selectedTopic === 'All' || item.category === selectedTopic;

    // Filter by Search Query
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      item.topic?.toLowerCase().includes(q) ||
      item.sector?.toLowerCase().includes(q);

    return matchesType && matchesTopic && matchesSearch;
  });

  const handleDigestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (digestEmail) {
      setDigestSubscribed(true);
      setDigestEmail('');
    }
  };

  return (
    <div className="pb-24 overflow-x-hidden">
      {/* 1. Header Section */}
      <section
        id="hero-section"
        className="relative bg-hero-gradient pt-8 pb-14 sm:pt-12 sm:pb-16 overflow-hidden"
      >
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              Tax & Regulatory Updates<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-[17px] text-[#33475B] font-normal leading-relaxed">
              Clear, timely insights on IRD circulars, VAT amendments, and statutory deadlines in Nepal — focused on what it actually means for your business.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-6 pt-10 sm:pt-14 space-y-12 sm:space-y-14">
        {/* ======================================================== */}
        {/* STANDING COMPLIANCE CALENDAR / DEADLINE REMINDERS WIDGET */}
        {/* ======================================================== */}
        <section className="bg-white rounded-3xl border border-[#E8EBEF] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8EBEF] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#023A51]">
                  Compliance Calendar & Deadline Reminders
                </h2>
                <p className="text-xs text-[#59667D]">
                  Statutory filing deadlines under Nepal Value Added Tax Act & Income Tax Act.
                </p>
              </div>
            </div>

            <Link
              href="/book-appointment"
              className="text-xs font-bold text-[#2CBC63] hover:text-[#25A456] flex items-center gap-1 shrink-0"
            >
              <span>Need filing assistance? Consult our team</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {upcomingDeadlines.map((dl, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  dl.isUrgent
                    ? 'bg-[#E5F1F6]/50 border-[#2CBC63]/40 shadow-xs'
                    : 'bg-[#F8FAFC] border-[#E8EBEF]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-500 uppercase tracking-wider">
                    {dl.frequency}
                  </span>
                  {dl.isUrgent && (
                    <span className="px-2 py-0.5 rounded-full bg-[#2CBC63] text-white font-bold text-[10px]">
                      Active
                    </span>
                  )}
                </div>

                <div className="font-bold text-[#023A51] text-sm mt-2 leading-snug">
                  {dl.title}
                </div>

                <div className="mt-2.5 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-[#023A51] font-semibold">
                    <Clock className="w-3.5 h-3.5 text-[#2CBC63]" />
                    <span>{dl.dueDate}</span>
                  </div>
                  <p className="text-[11px] text-[#59667D] leading-relaxed line-clamp-2">
                    {dl.appliesTo}
                  </p>
                  <p className="text-[10.5px] text-amber-700 font-medium">
                    {dl.penaltyNote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* SEARCH & CATEGORY FILTER BAR */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div className="bg-white border border-[#E8EBEF] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Type Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 mr-1 uppercase tracking-wider">
                Type:
              </span>
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedType === type
                      ? 'bg-[#023A51] text-white shadow-xs'
                      : 'bg-[#F4F6F8] text-[#59667D] hover:bg-slate-200'
                  }`}
                >
                  {type === 'Update' ? 'Regulatory Update' : type === 'Guide' ? 'Explainer Guide' : type}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search topics, circulars, sectors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#E8EBEF] rounded-xl text-xs text-[#023A51] focus:outline-none focus:border-[#2CBC63]"
              />
            </div>
          </div>

          {/* Topic Sub-filter pills */}
          <div className="flex flex-wrap items-center gap-1.5 px-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Topic:
            </span>
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  selectedTopic === t
                    ? 'bg-[#2CBC63] text-white font-bold'
                    : 'text-[#59667D] hover:bg-white border border-transparent hover:border-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* CORE FEED (Scannable, Actionable, Talk To Us CTA) */}
        {/* ======================================================== */}
        <section className="space-y-5">
          {filteredUpdates.length === 0 ? (
            <div className="bg-white border border-[#E8EBEF] rounded-2xl p-12 text-center text-slate-500">
              <FileText className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <h3 className="font-bold text-slate-800 text-sm">No updates matching your filter</h3>
              <p className="text-xs text-slate-400 mt-1">Try resetting type or topic filters.</p>
              <button
                onClick={() => {
                  setSelectedType('All');
                  setSelectedTopic('All');
                  setSearchQuery('');
                }}
                className="mt-3 px-4 py-1.5 bg-[#023A51] text-white rounded-full text-xs font-semibold"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredUpdates.map((post) => {
              const isExpanded = expandedPostId === post.id;
              const typeBadge = post.update_type || 'Update';

              return (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl border border-[#E8EBEF] shadow-xs hover:border-[#2CBC63]/60 transition-all overflow-hidden"
                >
                  <div
                    onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                    className="p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row md:items-start justify-between gap-4 select-none"
                  >
                    <div className="space-y-2 max-w-4xl">
                      {/* Meta Tags Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Type Badge */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            typeBadge === 'Deadline'
                              ? 'bg-amber-100 text-amber-800'
                              : typeBadge === 'Guide'
                              ? 'bg-purple-100 text-purple-800'
                              : typeBadge === 'Sector Note'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {typeBadge === 'Update' ? 'Regulatory Update' : typeBadge}
                        </span>

                        {/* Topic Tag */}
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {post.category}
                        </span>

                        {/* Sector Tag if present */}
                        {post.sector && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-[#023A51] border border-slate-200">
                            Sector: {post.sector}
                          </span>
                        )}

                        {/* Effective / Published Date */}
                        <span className="text-[11.5px] text-slate-400 flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>
                            {post.effective_date
                              ? `Effective: ${post.effective_date}`
                              : `Published: ${post.published_at}`}
                          </span>
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-lg sm:text-[20px] font-bold text-[#023A51] leading-snug group-hover:text-[#2CBC63] transition-colors">
                        {post.title}
                      </h2>

                      {/* Brief Summary */}
                      <p className="text-[13px] sm:text-[13.5px] text-[#59667D] leading-relaxed">
                        {post.summary}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                      <span className="text-xs font-bold text-[#023A51]">
                        {isExpanded ? 'Collapse' : 'Read details'}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content with 'Talk to us about this' CTA */}
                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-5 bg-[#FBFDFE]">
                      <div className="prose prose-sm max-w-none text-[#33475B] text-xs sm:text-[13.5px] leading-relaxed whitespace-pre-line">
                        {post.content}
                      </div>

                      {/* Talk to us about this CTA */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#E5F1F6] border border-[#CCD7DC]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="text-xs font-bold uppercase tracking-wider text-[#023A51]">
                            Unsure how this directive affects your enterprise?
                          </div>
                          <p className="text-xs text-[#1D5367] leading-relaxed">
                            Our tax advisory team provides impact assessments and filing representation.
                          </p>
                        </div>

                        <Link
                          href={`/book-appointment?service=Taxation+Consultancy+Services&ref=${encodeURIComponent(
                            post.title
                          )}`}
                          className="px-5 py-2.5 rounded-full bg-[#023A51] hover:bg-[#2CBC63] text-white text-xs font-bold transition-all shadow-xs shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Talk to us about this &rarr;</span>
                        </Link>
                      </div>

                      {/* Source Footnote */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Source: {post.source_name}</span>
                        {post.source_url && (
                          <a
                            href={post.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#023A51] hover:text-[#2CBC63] flex items-center gap-1 font-mono"
                          >
                            <span>Official Source</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>

        {/* ======================================================== */}
        {/* DOWNLOADABLE STATUTORY RESOURCES QUICK STRIP */}
        {/* ======================================================== */}
        <section className="bg-slate-50 border border-[#E8EBEF] rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8EBEF] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#023A51]">
                Statutory Checklists & Downloadable Guides
              </h3>
              <p className="text-xs text-[#59667D]">
                Official PDF schedules and requirements needed for tax compliance in Nepal.
              </p>
            </div>
            <Link
              href="/resources"
              className="text-xs font-bold text-[#2CBC63] hover:underline flex items-center gap-1"
            >
              <span>View all 12 tools & downloads &rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {downloads.slice(0, 4).map((dl) => (
              <div
                key={dl.id}
                className="bg-white border border-[#E8EBEF] rounded-xl p-3.5 flex flex-col justify-between space-y-2.5 shadow-xs"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#2CBC63] uppercase">
                    {dl.category}
                  </span>
                  <div className="text-xs font-bold text-[#023A51] mt-1 leading-snug">
                    {dl.title}
                  </div>
                </div>
                <a
                  href={dl.download_url}
                  download
                  onClick={(e) => {
                    if (dl.download_url === '#') {
                      e.preventDefault();
                      alert(`Downloading official "${dl.title}" file.`);
                    }
                  }}
                  className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-[#023A51] hover:text-white text-[#023A51] text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Download ({dl.file_format})</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* EMAIL DIGEST SIGNUP (Compact, Clean) */}
        {/* ======================================================== */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#E8F4F8] border border-[#CCD7DC]/70 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-lg text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-bold text-[#023A51]">
              <Mail className="w-4 h-4 text-[#2CBC63]" />
              <span>Subscribe to Regulatory Circulars</span>
            </div>
            <p className="text-xs text-[#59667D] leading-relaxed">
              Never miss a filing deadline or IRD notice. Receive succinct, vetted advisory digests directly to your email.
            </p>
          </div>

          <form onSubmit={handleDigestSubmit} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="email"
              required
              value={digestEmail}
              onChange={(e) => setDigestEmail(e.target.value)}
              placeholder="Enter corporate email"
              className="px-4 py-2.5 rounded-full border border-[#CCD7DC] bg-white text-xs text-[#023A51] placeholder:text-[#93999F] focus:outline-none focus:border-[#023A51] w-full sm:w-64"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#023A51] hover:bg-[#034A66] text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              {digestSubscribed ? 'Subscribed' : 'Join Digest'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
