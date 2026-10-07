'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { Phone, Mail, MapPin, ArrowUp } from 'lucide-react';

export default function Footer() {
  const { settings } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-[#E8EBEF] pt-16 pb-8">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14">
          {/* Col 1: Logo + Description (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block">
              <Image
                src="/Logo.png"
                alt="Narahari Adhikari Chartered Accountants"
                width={240}
                height={65}
                className="h-[44px] w-auto object-contain"
              />
            </Link>

            <p className="text-[14px] text-[#59667D] leading-relaxed pr-6">
              Tax, audit, financial reporting, and business advisory support for organisations in Nepal.
            </p>

          </div>

          {/* Col 2: Overview links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[15px] font-bold text-[#023A51] tracking-tight">
              Overview
            </h3>
            <ul className="space-y-2.5 text-[14px] text-[#33475B]">
              <li>
                <Link href="/services" className="hover:text-[#2CBC63] transition-colors duration-200">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/updates" className="hover:text-[#2CBC63] transition-colors duration-200">
                  Updates
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#2CBC63] transition-colors duration-200">
                  Who we are
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-[#2CBC63] transition-colors duration-200">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#2CBC63] transition-colors duration-200">
                  News & Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Secondary links (2 cols) */}
          <div className="lg:col-span-2 space-y-4 lg:mt-[29px]">
            <ul className="space-y-2.5 text-[14px] text-[#33475B]">
              <li>
                <Link href="/book-appointment" className="hover:text-[#2CBC63] transition-colors duration-200">
                  Book Consultation
                </Link>
              </li>
              {settings.careers_enabled && (
                <li>
                  <Link href="/careers" className="hover:text-[#2CBC63] transition-colors duration-200">
                    Careers
                  </Link>
                </li>
              )}
              <li>
                <Link href="/about#faqs" className="hover:text-[#2CBC63] transition-colors duration-200">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#2CBC63] transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#2CBC63] transition-colors duration-200">
                  Terms of Website Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Business Info (4 cols) — matching Avada reference with pill buttons */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-[15px] font-bold text-[#023A51] tracking-tight">
              Business Info
            </h3>

            <div className="flex items-start gap-2.5 text-[14px] text-[#4A5259]">
              <MapPin className="w-4 h-4 text-[#2CBC63] shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>

            {/* Phone Button — Pill shape matching Avada reference */}
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center justify-center gap-2.5 w-full py-3 px-6 bg-[#F4F6F8] hover:bg-[#E0ECF0] text-[#023A51] border border-[#E8EBEF] rounded-full text-[14px] font-semibold transition-all duration-200 hover:shadow-xs active:scale-[0.98]"
            >
              <Phone className="w-4 h-4 text-[#2CBC63]" />
              <span>{settings.phone}</span>
            </a>

            {/* Email Button — Pill shape matching Avada reference */}
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center justify-center gap-2.5 w-full py-3 px-6 bg-[#F4F6F8] hover:bg-[#E0ECF0] text-[#023A51] border border-[#E8EBEF] rounded-full text-[14px] font-semibold transition-all duration-200 hover:shadow-xs active:scale-[0.98]"
            >
              <Mail className="w-4 h-4 text-[#2CBC63]" />
              <span>{settings.email}</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#E8EBEF] flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#93999F]">
          <div>
            <p>© {new Date().getFullYear()} {settings.company_name} • Chartered Accountants</p>
            {settings.tagline && <p className="mt-1 text-[11px]">{settings.tagline}</p>}
            {settings.ca_reg_number && <p className="mt-1 text-[11px]">{settings.ca_reg_number}</p>}
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-[#023A51] hover:text-[#2CBC63] font-medium transition-colors duration-200 cursor-pointer text-[13px]"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
