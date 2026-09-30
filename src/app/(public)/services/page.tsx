'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { servicesData } from '@/lib/services-data';

export default function ServicesPage() {
  return (
    <div className="pb-28 overflow-x-hidden bg-[#FAFCFD]">
      {/* 1. Header Section */}
      <section
        id="hero-section"
        className="relative bg-white border-b border-[#E8EBEF] pt-10 pb-14 sm:pt-14 sm:pb-16"
      >
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#2CBC63]">
              Chartered Accountancy Practice
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              Our Professional Services<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-[17px] text-[#4A5259] leading-relaxed">
              Rigorous statutory audits, corporate tax structuring, accounting outsourcing, and financial advisory for enterprises in Nepal.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Grid with rich imagery from public/services */}
      <section className="max-w-[1240px] mx-auto px-6 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={service.slug}
                className="group flex flex-col justify-between bg-white rounded-3xl border border-[#E8EBEF] overflow-hidden hover:shadow-xl hover:border-[#CCD7DC] transition-all duration-300"
              >
                <div>
                  {/* Service Photo */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-xs text-[#023A51] flex items-center justify-center shadow-md">
                      <Icon className="w-4 h-4 text-[#023A51]" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 sm:p-7 space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#2CBC63]">
                      Practice Area 0{index + 1}
                    </span>
                    <h2 className="text-xl font-bold text-[#023A51] leading-snug group-hover:text-[#2CBC63] transition-colors">
                      <Link href={`/services/${service.slug}`}>
                        {service.title}
                      </Link>
                    </h2>
                    <p className="text-xs sm:text-[13.5px] text-[#4A5259] leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Direct Action */}
                <div className="px-6 sm:px-7 pb-6 pt-2">
                  <div className="pt-4 border-t border-[#E8EBEF] flex items-center justify-between">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#023A51] group-hover:text-[#2CBC63] transition-colors"
                    >
                      <span>Read service article</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#2CBC63] group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href="/book-appointment"
                      className="text-[11.5px] font-medium text-[#59667D] hover:text-[#023A51]"
                    >
                      Consult &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Consultation Banner */}
      <section className="max-w-[1240px] mx-auto px-6 mt-16 sm:mt-20">
        <div className="rounded-3xl bg-[#023A51] p-8 sm:p-12 text-white relative overflow-hidden shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2CBC63]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#2CBC63]">
              Bespoke Engagements
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Need assistance with multiple compliance areas?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We design integrated accounting and audit retainer packages for corporate groups, hydropower developers, and manufacturing units across Nepal.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <Link
              href="/book-appointment"
              className="px-7 py-3 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 transition-all shadow-sm"
            >
              <span>Schedule Direct Meeting</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
