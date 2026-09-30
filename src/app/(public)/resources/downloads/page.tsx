'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ExternalLink,
  Download,
  Search,
} from 'lucide-react';

export default function ResourcesDownloadsPage() {
  const { governmentLinks, downloads } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGovLinks = governmentLinks.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.short_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const availableDownloads = downloads.filter((item) => item.download_url && item.download_url !== '#');

  return (
    <div className="pb-24 overflow-x-hidden">
      {/* Header */}
      <section
        id="hero-section"
        className="relative bg-hero-gradient pt-8 pb-14 sm:pt-12 sm:pb-16 overflow-hidden"
      >
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              Regulatory Portals & Downloads<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-[17px] text-[#33475B] font-normal leading-relaxed">
              One place for official links and the working documents businesses commonly need. Always confirm a filing requirement with the issuing authority.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-6 pt-10 space-y-14">
        {/* ======================================================== */}
        {/* SECTION 1: 11 OFFICIAL GOVERNMENT REGULATORY PORTALS */}
        {/* ======================================================== */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8EBEF] pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023A51] tracking-tight">
                Government Regulatory Authorities ({governmentLinks.length})<span className="text-[#2CBC63]">.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#59667D] mt-1">
                Direct external access to official portals for tax filing, corporate registration, and statutory compliances.
              </p>
            </div>

            {/* Quick Filter */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search authorities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full pl-8 text-xs md:w-64"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGovLinks.map((portal) => (
              <a
                key={portal.id}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl border border-[#E8EBEF] p-5 shadow-xs hover:shadow-md hover:border-[#2CBC63] transition-all flex flex-col justify-between space-y-3 cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold text-[#2CBC63] uppercase tracking-wider bg-[#F4F6F8] px-2 py-0.5 rounded border border-[#E8EBEF]">
                      {portal.category || 'Regulatory Authority'}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2CBC63] transition-colors" />
                  </div>
                  <h3 className="text-[14.5px] font-bold text-[#023A51] group-hover:text-[#2CBC63] transition-colors leading-snug">
                    {portal.name}
                  </h3>
                  <p className="text-xs text-[#59667D] leading-relaxed line-clamp-2">
                    {portal.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11.5px] font-medium text-[#023A51]">
                  <span className="truncate text-slate-500 font-mono text-[11px] max-w-[200px]">
                    {portal.url}
                  </span>
                  <span className="text-xs font-bold text-[#2CBC63] group-hover:translate-x-0.5 transition-transform shrink-0">
                    Visit Portal &rarr;
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

              {/* Downloadable resources */}
        {/* ======================================================== */}
        <section className="space-y-6 pt-4 border-t border-[#E8EBEF]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2CBC63]">
              Statutory Resources
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023A51] tracking-tight mt-1">
              Downloads and templates<span className="text-[#2CBC63]">.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#59667D] mt-1">
              Files appear here when they are ready to download.
            </p>
          </div>

          {availableDownloads.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableDownloads.map((dl) => (
              <div
                key={dl.id}
                className="bg-white border border-[#E8EBEF] rounded-2xl p-5 shadow-xs hover:border-[#2CBC63]/60 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {dl.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {dl.file_format} &bull; {dl.file_size}
                    </span>
                  </div>
                  <div className="font-bold text-[#023A51] text-xs sm:text-[13px] leading-snug">
                    {dl.title}
                  </div>
                </div>

                <Button asChild size="sm" variant="secondary" className="w-full rounded-[8px] text-xs">
                  <a
                  href={dl.download_url}
                  download
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download file</span>
                  </a>
                </Button>
              </div>
            ))}
          </div>
          ) : (
            <p className="border-y border-[#E8EBEF] bg-white px-5 py-8 text-sm text-[#59667D]">
              There are no files published yet. Use the official portals above for current forms and schedules.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
