'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Calculator,
  Landmark,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function ResourcesGatewayPage() {
  const { governmentLinks } = useApp();

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
              Resources<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-[17px] text-[#33475B] font-normal leading-relaxed">
              Simple calculators for everyday planning, plus direct links to the authorities and documents businesses use most.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-6 pt-12 space-y-12 sm:space-y-16">
        {/* Two Main Cards Grid: Tools vs Downloads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Calculators & Tools */}
          <Link
            href="/resources/tools"
            className="group bg-white rounded-3xl border border-[#E8EBEF] p-8 sm:p-10 shadow-xs hover:shadow-xl hover:border-[#2CBC63] transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F4F8] text-[#023A51] group-hover:bg-[#2CBC63] group-hover:text-white transition-colors flex items-center justify-center">
                <Calculator className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#2CBC63] uppercase tracking-wider">
                  Work out an estimate
                </span>
                <h2 className="text-2xl font-bold text-[#023A51] group-hover:text-[#2CBC63] transition-colors mt-1">
                  Financial & Tax Calculators
                </h2>
                <p className="text-xs sm:text-[13.5px] text-[#59667D] leading-relaxed mt-2">
                  Check VAT, personal tax, TDS, loan repayments, payroll contributions, and other common figures without opening a spreadsheet.
                </p>
              </div>

              {/* Pill feature highlights */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-700">
                  VAT 13% Model
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-700">
                  Income Tax Slabs
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-700">
                  TDS Lookup
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-700">
                  SSF 31%
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-sm font-bold text-[#023A51] group-hover:text-[#2CBC63]">
              <span>Explore All 12 Calculators</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Regulatory Portals & Downloads */}
          <Link
            href="/resources/downloads"
            className="group bg-white rounded-3xl border border-[#E8EBEF] p-8 sm:p-10 shadow-xs hover:shadow-xl hover:border-[#2CBC63] transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F4F8] text-[#023A51] group-hover:bg-[#2CBC63] group-hover:text-white transition-colors flex items-center justify-center">
                <Landmark className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#2CBC63] uppercase tracking-wider">
                  Go to the source
                </span>
                <h2 className="text-2xl font-bold text-[#023A51] group-hover:text-[#2CBC63] transition-colors mt-1">
                  Regulatory Portals & Downloads
                </h2>
                <p className="text-xs sm:text-[13.5px] text-[#59667D] leading-relaxed mt-2">
                  Find official portals and practical checklists for tax filing, company records, audit preparation, and regulatory work.
                </p>
              </div>

              {/* Pill feature highlights */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-700">
                  ICAN & IRD Portals
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-700">
                  OCR & NRB Direct
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-700">
                  PDF Schedules
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-700">
                  Audit Checklists
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-sm font-bold text-[#023A51] group-hover:text-[#2CBC63]">
              <span>Access Portals & Downloads</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Quick Strip for Regulatory Authorities */}
        <section className="bg-slate-50 border border-[#E8EBEF] rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8EBEF] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#023A51]">
                Official Regulatory Directories ({governmentLinks.length})
              </h3>
              <p className="text-xs text-[#59667D]">
                Quick link access to primary revenue and corporate governance bodies.
              </p>
            </div>
            <Link
              href="/resources/downloads"
              className="text-xs font-bold text-[#2CBC63] hover:underline"
            >
              View all authorities &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
            {governmentLinks.slice(0, 8).map((portal) => (
              <a
                key={portal.id}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-[#E8EBEF] rounded-xl p-3 hover:border-[#2CBC63] transition-colors flex items-center justify-between text-xs font-bold text-[#023A51] group"
              >
                <span className="truncate mr-2">{portal.short_name || portal.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2CBC63] shrink-0" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
