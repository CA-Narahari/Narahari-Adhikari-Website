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
              Premier Chartered Accountancy practice providing corporate tax advisory, statutory audit, internal controls, and corporate secretarial solutions across Nepal.
            </p>

            {/* Social Icons Row */}
            <div className="flex items-center gap-3.5 pt-2">
              <a href="#" className="text-[#59667D] hover:text-[#3B5998] transition-colors duration-200" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z"/></svg>
              </a>
              <a href="#" className="text-[#59667D] hover:text-[#023A51] transition-colors duration-200" aria-label="X / Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="text-[#59667D] hover:text-[#3F729B] transition-colors duration-200" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
              <a href="#" className="text-[#59667D] hover:text-[#0A66C2] transition-colors duration-200" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
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
                <Link href="/tax-updates" className="hover:text-[#2CBC63] transition-colors duration-200">
                  Tax Updates
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
          <div className="lg:col-span-2 space-y-4 lg:pt-[29px]">
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
                  Terms of Service
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
            © {new Date().getFullYear()} {settings.company_name} • Chartered Accountants
          </div>

          <div className="flex items-center gap-6">
            {/* Duplicated Social Icons in bottom per Avada reference */}
            <div className="flex items-center gap-3">
              <a href="#" className="text-[#93999F] hover:text-[#3B5998] transition-colors duration-200" aria-label="Facebook">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z"/></svg>
              </a>
              <a href="#" className="text-[#93999F] hover:text-[#023A51] transition-colors duration-200" aria-label="X / Twitter">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="text-[#93999F] hover:text-[#3F729B] transition-colors duration-200" aria-label="Instagram">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
              <a href="#" className="text-[#93999F] hover:text-[#0A66C2] transition-colors duration-200" aria-label="LinkedIn">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>

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
