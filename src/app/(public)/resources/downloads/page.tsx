'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import {
  ExternalLink,
  Download,
  Search,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { getPortalLogo } from '@/lib/portal-logo';

export default function ResourcesDownloadsPage() {
  const { governmentLinks, downloads } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredGovLinks = governmentLinks.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.short_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableDownloads = downloads.filter(
    (item) => item.download_url && item.download_url !== '#'
  );

  const downloadCategories = [
    'All',
    ...Array.from(new Set(availableDownloads.map((d) => d.category || 'General'))),
  ];

  const filteredDownloads = availableDownloads.filter((dl) => {
    const matchesCategory =
      selectedCategory === 'All' || dl.category === selectedCategory;
    const matchesSearch =
      dl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dl.file_format.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-28 overflow-x-hidden bg-[#FAFCFD]">
      {/* 1. Header Section */}
      <section
        id="hero-section"
        className="relative bg-hero-gradient pt-8 pb-14 sm:pt-12 sm:pb-16 overflow-hidden"
      >
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              Regulatory Portals &amp; Downloads<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-[17px] text-[#4A5259] leading-relaxed">
              Direct access to Nepal&apos;s statutory authorities, official e-filing portals, and standardized compliance templates.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-6 pt-12 space-y-20">
        {/* ======================================================== */}
        {/* SECTION 1: GOVERNMENT REGULATORY PORTALS (REDESIGNED)  */}
        {/* ======================================================== */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8EBEF] pb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2CBC63]">
                Official Directory
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023A51] tracking-tight mt-1">
                Government Regulatory Authorities ({governmentLinks.length})
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5259] mt-1.5">
                Official revenue administration, corporate registry, and central banking portals in Nepal.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search portal or authority..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full pl-10 text-xs sm:text-sm rounded-xl border-[#CCD7DC] bg-white focus:border-[#2CBC63]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGovLinks.map((portal) => {
              const logo = getPortalLogo(portal);
              const cleanUrl = portal.url
                .replace(/^https?:\/\//i, '')
                .replace(/\/$/, '');

              const displayName =
                portal.short_name &&
                !portal.name.toLowerCase().includes(`(${portal.short_name.toLowerCase()})`)
                  ? `${portal.name} (${portal.short_name})`
                  : portal.name;

              return (
                <a
                  key={portal.id}
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-white rounded-3xl border border-[#E8EBEF] p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-[#CCD7DC] transition-all duration-300 flex items-start gap-4 sm:gap-5"
                >
                  {/* LEFT: Square Logo (height of box, ~25-30% width) */}
                  <div className="w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] aspect-square rounded-2xl bg-[#F8FAFC] border border-[#E8EBEF] p-2 flex items-center justify-center shrink-0 shadow-xs overflow-hidden group-hover:border-[#2CBC63]/40 transition-colors">
                    {logo ? (
                      <Image
                        src={logo}
                        alt={portal.logo_alt || `${portal.name} Logo`}
                        width={80}
                        height={80}
                        unoptimized
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full rounded-xl border border-dashed border-[#D2DCE2] bg-white flex items-center justify-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        LOGO
                      </div>
                    )}
                  </div>

                  {/* RIGHT: Details Column (Category, Name (Short Form), URL, Description) */}
                  <div className="flex-1 min-w-0 space-y-1.5 pr-5">
                    <span className="text-[10px] font-bold text-[#2CBC63] uppercase tracking-wider block truncate">
                      {portal.category || 'Regulatory Authority'}
                    </span>
                    <h3 className="text-[15px] sm:text-[16px] font-bold text-[#023A51] group-hover:text-[#14864B] transition-colors leading-snug">
                      {displayName}
                    </h3>
                    <p className="text-[11.5px] font-mono text-[#59667D] truncate">
                      {cleanUrl}
                    </p>
                    <p className="text-xs text-[#4A5259] leading-relaxed line-clamp-2">
                      {portal.description}
                    </p>
                  </div>

                  {/* BOTTOM RIGHT: External Link Icon (matching sketch) */}
                  <div className="absolute right-4 bottom-4 p-1 rounded-lg text-slate-400 group-hover:text-[#023A51] transition-colors">
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: DOWNLOAD RESOURCES (COMPLETELY REDESIGNED)   */}
        {/* ======================================================== */}
        <section className="space-y-8 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8EBEF] pb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2CBC63]">
                Compliance Documents
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023A51] tracking-tight mt-1">
                Standard Downloads &amp; Templates
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5259] mt-1.5">
                Download verified tax rate schedules, corporate filing checklists, and audit preparation guidelines.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {downloadCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#023A51] text-white shadow-xs'
                      : 'bg-[#F4F6F8] text-[#59667D] hover:bg-[#E8EBEF] hover:text-[#023A51]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredDownloads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDownloads.map((dl) => {
                const isSpreadsheet =
                  dl.file_format.toLowerCase().includes('xls') ||
                  dl.file_format.toLowerCase().includes('csv');

                return (
                  <div
                    key={dl.id}
                    className="bg-white rounded-3xl border border-[#E8EBEF] p-6 shadow-sm hover:shadow-xl hover:border-[#CCD7DC] transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-3.5">
                      {/* Category & Format Pill */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E6F7ED] text-[#2CBC63]">
                          {dl.category || 'Statutory Resource'}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-[#59667D] bg-[#F4F6F8] px-2 py-0.5 rounded-md border border-[#E8EBEF]">
                          {isSpreadsheet ? (
                            <FileSpreadsheet className="w-3 h-3 text-[#2CBC63]" />
                          ) : (
                            <FileText className="w-3 h-3 text-[#023A51]" />
                          )}
                          <span>
                            {dl.file_format} • {dl.file_size}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-[#023A51] leading-snug">
                        {dl.title}
                      </h3>

                      <p className="text-xs text-[#59667D] leading-relaxed">
                        Official document schedule verified for corporate and statutory use in Nepal.
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 mt-4 border-t border-[#E8EBEF]">
                      <a
                        href={dl.download_url}
                        target={dl.download_url.toLowerCase().endsWith('.pdf') ? undefined : '_blank'}
                        rel={dl.download_url.toLowerCase().endsWith('.pdf') ? undefined : 'noopener noreferrer'}
                        className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#023A51] hover:bg-[#034a66] text-white font-bold text-xs transition-all duration-200 shadow-xs active:scale-[0.98]"
                      >
                        <Download className="w-3.5 h-3.5 text-[#2CBC63]" />
                        <span>Download Document</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E8EBEF] p-12 text-center shadow-xs">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#023A51]">No downloads found in this category</h3>
              <p className="text-xs text-[#59667D] mt-1 max-w-sm mx-auto">
                Check other categories or use the official regulatory portals above to access current forms.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
