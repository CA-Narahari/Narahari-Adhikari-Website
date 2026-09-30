'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { servicesData } from '@/lib/services-data';

export default function ServicesPage() {
  return (
    <div className="pb-24 overflow-x-hidden">
      {/* 1. Heading Section matching Home Page background gradient and functionality */}
      <section
        id="hero-section"
        className="relative bg-hero-gradient pt-8 pb-14 sm:pt-12 sm:pb-16 overflow-hidden"
      >
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              Services<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-[17px] text-[#33475B] font-normal leading-relaxed">
              Practical accounting, audit, tax, and advisory support for businesses in Nepal.
            </p>
          </div>
        </div>
      </section>

      {/* 2. 3-Column Clean Grid with Uniform Cards and Detail Buttons */}
      <section className="max-w-[1240px] mx-auto px-6 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {servicesData.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.slug}
                className="group flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-[#E8EBEF] hover:border-[#2CBC63]/40 hover:shadow-lg hover:shadow-[#023A51]/5 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#E8F4F8] text-[#023A51] group-hover:bg-[#2CBC63]/15 group-hover:text-[#2CBC63] flex items-center justify-center shrink-0 transition-colors">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <h2 className="text-[18px] sm:text-[19px] font-bold text-[#023A51] leading-snug group-hover:text-[#2CBC63] transition-colors">
                      {service.title}
                    </h2>
                  </div>

                  <p className="text-[14px] text-[#4A5259] leading-relaxed font-normal">
                    {service.description}
                  </p>
                </div>

                {/* Direct Action Button to Detail Page */}
                <div className="pt-6 mt-4 border-t border-[#E8EBEF]/80">
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 text-[13.5px] font-bold text-[#023A51] group-hover:text-[#2CBC63] transition-colors"
                  >
                    <span>View details</span>
                    <ArrowRight className="w-4 h-4 text-[#2CBC63] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
