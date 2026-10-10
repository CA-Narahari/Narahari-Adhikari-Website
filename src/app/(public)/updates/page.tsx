'use client';

import { useMemo, useState } from 'react';
import {
  Calendar,
  Search,
  ArrowRight,
  ExternalLink,
  Landmark,
  FileText,
  Percent,
  ShieldCheck,
  Megaphone,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { TaxUpdate } from '@/types';

const CATEGORIES = [
  { id: 'All', label: 'All', icon: null },
  { id: 'Income Tax', label: 'Income Tax', icon: Landmark },
  { id: 'VAT', label: 'VAT', icon: Percent },
  { id: 'Corporate Tax', label: 'Corporate Tax', icon: FileText },
  { id: 'Customs', label: 'Customs', icon: ShieldCheck },
  { id: 'Finance Acts', label: 'Finance Acts', icon: FileText },
  { id: 'Circulars', label: 'Circulars', icon: Megaphone },
  { id: 'Notices', label: 'Notices', icon: Megaphone },
];

const DATE_FILTERS = [
  { id: 'all', label: 'All Time' },
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: '3m', label: 'Last 3 Months' },
  { id: '6m', label: 'Last 6 Months' },
  { id: 'custom', label: 'Custom Range' },
];

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function getCategoryTag(item: TaxUpdate): { label: string; colorClass: string } {
  const cat = (item.category || item.topic || '').toLowerCase();

  if (cat.includes('income')) {
    return { label: 'Income Tax', colorClass: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]' };
  }
  if (cat.includes('vat')) {
    return { label: 'VAT', colorClass: 'bg-[#EFF6FF] text-[#0369A1] border-[#BAE6FD]' };
  }
  if (cat.includes('corporate')) {
    return { label: 'Corporate Tax', colorClass: 'bg-[#F0FDF4] text-[#15803D] border-[#DCFCE7]' };
  }
  if (cat.includes('custom')) {
    return { label: 'Customs', colorClass: 'bg-[#FAF5FF] text-[#7E22CE] border-[#F3E8FF]' };
  }
  if (cat.includes('finance')) {
    return { label: 'Finance Acts', colorClass: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#DBEAFE]' };
  }
  if (cat.includes('notice')) {
    return { label: 'Notices', colorClass: 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]' };
  }
  if (cat.includes('circular')) {
    return { label: 'Circulars', colorClass: 'bg-[#FAF5FF] text-[#7E22CE] border-[#F3E8FF]' };
  }

  return { label: item.category || 'General', colorClass: 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]' };
}

function matchesCategoryFilter(item: TaxUpdate, selectedCat: string): boolean {
  if (selectedCat === 'All') return true;
  const itemCat = (item.category || '').toLowerCase();
  const itemTopic = (item.topic || '').toLowerCase();
  const target = selectedCat.toLowerCase();

  return itemCat === target || itemTopic === target || itemCat.includes(target) || target.includes(itemCat);
}

export default function UpdatesPage() {
  const { taxUpdates, taxUpdatesLoaded } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');
  const [dateFilterNow, setDateFilterNow] = useState<number | null>(null);
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [activeModalUpdate, setActiveModalUpdate] = useState<TaxUpdate | null>(null);

  // Purely dynamic CMS/Database data
  const publishedUpdates = useMemo(() => {
    return taxUpdates.filter((u) => u.status === 'published');
  }, [taxUpdates]);

  // Date filtering logic
  const dateFilteredUpdates = useMemo(() => {
    return publishedUpdates.filter((item) => {
      if (selectedDateFilter === 'all') return true;
      const pubTime = new Date(item.published_at || item.effective_date || '').getTime();
      if (Number.isNaN(pubTime)) return true;

      const diffMs = (dateFilterNow ?? 0) - pubTime;
      const dayMs = 86400000;

      if (selectedDateFilter === '7d') return diffMs <= 7 * dayMs;
      if (selectedDateFilter === '30d') return diffMs <= 30 * dayMs;
      if (selectedDateFilter === '3m') return diffMs <= 90 * dayMs;
      if (selectedDateFilter === '6m') return diffMs <= 180 * dayMs;
      if (selectedDateFilter === 'custom') {
        const startMs = customStartDate ? new Date(customStartDate).getTime() : 0;
        const endMs = customEndDate ? new Date(customEndDate).getTime() + dayMs : Infinity;
        return pubTime >= startMs && pubTime <= endMs;
      }
      return true;
    });
  }, [publishedUpdates, selectedDateFilter, customStartDate, customEndDate, dateFilterNow]);

  // Category & search filtering
  const filteredUpdates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return dateFilteredUpdates.filter((item) => {
      const matchCat = matchesCategoryFilter(item, activeCategory);
      if (!matchCat) return false;

      if (!query) return true;
      return (
        item.title?.toLowerCase().includes(query) ||
        item.summary?.toLowerCase().includes(query) ||
        item.content?.toLowerCase().includes(query) ||
        item.source_name?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.topic?.toLowerCase().includes(query)
      );
    });
  }, [dateFilteredUpdates, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAFCFD] pb-24">
      {/* 1. Header Section matching other pages */}
      <section id="hero-section" className="relative overflow-hidden bg-hero-gradient py-10 sm:py-14">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#023A51] sm:text-5xl leading-tight">
              Latest Updates &amp; News<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-[17px] text-[#4A5259] leading-relaxed">
              Stay informed with the latest government notices, tax changes, accounting guidelines, and important updates in the fiscal sector.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Category Filter Pills Bar */}
      <section className="max-w-[1240px] mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4.5 py-2 text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#023A51] text-white shadow-xs'
                    : 'bg-white border border-[#E2E8F0] text-[#475569] hover:border-[#023A51] hover:text-[#023A51]'
                }`}
              >
                {Icon && <Icon className={`size-3.5 sm:size-4 ${isActive ? 'text-white' : 'text-[#64748B]'}`} />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Main Content (List Layout + Clean Date Filter Sidebar) */}
      <main className="max-w-[1240px] mx-auto px-6 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: List-style update cards */}
          <div className="lg:col-span-8 space-y-4">
            {searchQuery && (
              <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs text-[#475569]">
                <span>
                  Showing results for: <strong className="text-[#023A51]">&ldquo;{searchQuery}&rdquo;</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-[#023A51] hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            )}

            {!taxUpdatesLoaded ? (
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-12 text-center text-sm text-[#64748B]">
                Loading updates…
              </div>
            ) : publishedUpdates.length === 0 ? (
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-12 text-center shadow-xs">
                <FileText className="mx-auto size-10 text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-[#023A51]">No updates published yet</h3>
                <p className="mt-1 text-xs text-[#64748B]">
                  Official notices, statutory circulars, and tax policy changes will appear here when published in the CMS.
                </p>
              </div>
            ) : filteredUpdates.length === 0 ? (
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-12 text-center shadow-xs">
                <FileText className="mx-auto size-10 text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-[#023A51]">No updates match these filters</h3>
                <p className="mt-1 text-xs text-[#64748B]">
                  Try adjusting your search query, topic category, or selected date range.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('All');
                    setSelectedDateFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#023A51] hover:underline cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredUpdates.map((item, idx) => {
                const tag = getCategoryTag(item);
                const isLatest = idx < 2 || item.is_urgent;

                return (
                  <article
                    key={item.id}
                    onClick={() => setActiveModalUpdate(item)}
                    className="group rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer relative"
                  >
                    {/* Top Badges */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${tag.colorClass}`}
                      >
                        {tag.label}
                      </span>

                      {isLatest && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                          </span>
                          Latest
                        </span>
                      )}
                    </div>

                    {/* Title & Arrow */}
                    <div className="mt-3.5 flex items-start justify-between gap-4">
                      <h2 className="text-base sm:text-lg font-bold text-[#023A51] group-hover:text-[#14864B] transition-colors leading-snug">
                        {item.title}
                      </h2>
                      <div className="shrink-0 mt-0.5">
                        <ArrowRight className="size-5 text-slate-400 group-hover:text-[#023A51] group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>

                    {/* Summary */}
                    {item.summary && (
                      <p className="mt-2 text-xs sm:text-sm text-[#475569] leading-relaxed line-clamp-2">
                        {item.summary}
                      </p>
                    )}

                    {/* Footer Metadata */}
                    <div className="mt-4 pt-3.5 border-t border-[#F1F5F9] flex items-center gap-2 text-xs text-[#64748B]">
                      <Calendar className="size-3.5 text-[#94A3B8]" />
                      <span>{formatDate(item.published_at || item.effective_date)}</span>
                      {item.source_name && (
                        <>
                          <span className="text-slate-300">|</span>
                          <span className="font-medium text-[#475569]">{item.source_name}</span>
                        </>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* Right Column: Clean Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Search Input */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#023A51] mb-2">
                Search Updates
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Keyword, Act, IRD notice…"
                  className="h-10 w-full rounded-xl border border-[#E2E8F0] bg-[#FAFCFD] pl-9.5 pr-4 text-xs sm:text-sm text-[#023A51] outline-none transition-all focus:border-[#023A51] focus:bg-white"
                />
              </div>
            </div>

            {/* Filter by Date */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-[#023A51]">
                <Calendar className="size-4.5 text-[#023A51]" />
                <span>Filter by Date</span>
              </div>

              <div className="space-y-3 pt-1">
                {DATE_FILTERS.map((df) => {
                  const isChecked = selectedDateFilter === df.id;
                  return (
                    <label
                      key={df.id}
                      className="flex items-center gap-3 text-xs sm:text-sm text-[#475569] hover:text-[#023A51] cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="date_filter"
                        value={df.id}
                        checked={isChecked}
                        onChange={() => {
                          setDateFilterNow(Date.now());
                          setSelectedDateFilter(df.id);
                        }}
                        className="size-4 text-[#023A51] focus:ring-[#023A51] accent-[#023A51] cursor-pointer"
                      />
                      <span className={isChecked ? 'font-bold text-[#023A51]' : 'font-normal'}>
                        {df.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              {selectedDateFilter === 'custom' && (
                <div className="pt-3 border-t border-[#F1F5F9] space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#64748B] mb-1">From Date</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full h-9 rounded-lg border border-[#E2E8F0] bg-[#FAFCFD] px-2.5 text-xs text-[#023A51] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#64748B] mb-1">To Date</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full h-9 rounded-lg border border-[#E2E8F0] bg-[#FAFCFD] px-2.5 text-xs text-[#023A51] outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* 4. Modal Dialog for Full Update Details */}
      {activeModalUpdate && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveModalUpdate(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-9 shadow-2xl border border-[#E2E8F0]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModalUpdate(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                  getCategoryTag(activeModalUpdate).colorClass
                }`}
              >
                {getCategoryTag(activeModalUpdate).label}
              </span>
              {activeModalUpdate.is_urgent && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]">
                  Urgent
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#023A51] leading-snug">
              {activeModalUpdate.title}
            </h2>

            <div className="mt-3 pb-4 border-b border-[#F1F5F9] flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748B]">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5 text-[#94A3B8]" />
                {formatDate(activeModalUpdate.published_at || activeModalUpdate.effective_date)}
              </span>
              {activeModalUpdate.source_name && (
                <span className="font-medium text-[#475569]">
                  Source: {activeModalUpdate.source_name}
                </span>
              )}
            </div>

            {activeModalUpdate.summary && (
              <div className="mt-4 rounded-xl bg-[#F8FAFC] p-4 text-xs sm:text-sm font-medium text-[#334155] leading-relaxed border border-[#E2E8F0]">
                {activeModalUpdate.summary}
              </div>
            )}

            <div className="mt-5 space-y-4 text-xs sm:text-sm text-[#475569] leading-relaxed whitespace-pre-line">
              {activeModalUpdate.content || activeModalUpdate.summary}
            </div>

            <div className="mt-8 pt-5 border-t border-[#F1F5F9] flex items-center justify-between gap-4">
              {activeModalUpdate.source_url ? (
                <a
                  href={activeModalUpdate.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#023A51] hover:text-[#2CBC63] hover:underline"
                >
                  <span>View Official Source</span>
                  <ExternalLink className="size-3.5" />
                </a>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => setActiveModalUpdate(null)}
                className="px-5 py-2 rounded-full bg-[#023A51] hover:bg-[#14864B] text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
