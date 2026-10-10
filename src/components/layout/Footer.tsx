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
    <footer className="bg-white border-t border-[#E8EBEF] pt-14 sm:pt-16 pb-8">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">
          {/* Col 1: Logo + Tagline (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/Logo.png"
                alt="Narahari Adhikari"
                width={260}
                height={65}
                className="h-[48px] w-auto object-contain"
              />
            </Link>

            <p className="text-[13.5px] text-[#59667D] leading-relaxed max-w-[280px]">
              Trusted financial advisory, statutory audits, and corporate tax consultancy for businesses across Nepal.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              <a href="#" className="w-8 h-8 rounded-lg bg-[#F4F6F8] hover:bg-[#E0ECF0] flex items-center justify-center text-[#59667D] hover:text-[#023A51] transition-all" aria-label="Facebook">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-[#F4F6F8] hover:bg-[#E0ECF0] flex items-center justify-center text-[#59667D] hover:text-[#023A51] transition-all" aria-label="X / Twitter">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-[#F4F6F8] hover:bg-[#E0ECF0] flex items-center justify-center text-[#59667D] hover:text-[#023A51] transition-all" aria-label="LinkedIn">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[14px] font-bold text-[#023A51] tracking-tight uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-[13.5px] text-[#33475B]">
              <li>
                <Link href="/services" className="hover:text-[#2CBC63] transition-colors duration-200">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#2CBC63] transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#2CBC63] transition-colors duration-200">
                  News &amp; Articles
                </Link>
              </li>
              <li>
                <Link href="/updates" className="hover:text-[#2CBC63] transition-colors duration-200">
                  Updates
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-[#2CBC63] transition-colors duration-200">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[14px] font-bold text-[#023A51] tracking-tight uppercase">
              Support
            </h3>
            <ul className="space-y-2.5 text-[13.5px] text-[#33475B]">
              <li>
                <Link href="/contact" className="hover:text-[#2CBC63] transition-colors duration-200">
                  Contact
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
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Business Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4 flex flex-col items-center text-center">
            <h3 className="text-[14px] font-bold text-[#023A51] tracking-tight uppercase">
              Get in Touch
            </h3>

            <div className="space-y-3.5 w-full max-w-[280px] flex flex-col items-center">
              <div className="flex items-start justify-center gap-2 text-[13px] text-[#59667D] leading-relaxed text-center">
                <MapPin className="w-4 h-4 text-[#2CBC63] shrink-0 mt-0.5" />
                <span>{settings.address || 'Kathmandu, Nepal'}</span>
              </div>

              {/* Phone Pill Button */}
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center justify-center gap-2.5 w-full py-2.5 px-5 bg-[#F4F6F8] hover:bg-[#E0ECF0] text-[#023A51] border border-[#E8EBEF] rounded-full text-[13.5px] font-semibold transition-all duration-200 hover:shadow-xs active:scale-[0.98]"
              >
                <Phone className="w-4 h-4 text-[#2CBC63]" />
                <span>{settings.phone}</span>
              </a>

              {/* Email Pill Button */}
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center justify-center gap-2.5 w-full py-2.5 px-5 bg-[#F4F6F8] hover:bg-[#E0ECF0] text-[#023A51] border border-[#E8EBEF] rounded-full text-[13.5px] font-semibold transition-all duration-200 hover:shadow-xs active:scale-[0.98]"
              >
                <Mail className="w-4 h-4 text-[#2CBC63]" />
                <span>{settings.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#E8EBEF] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px] text-[#93999F]">
          <p>© {new Date().getFullYear()} {settings.company_name}. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[#023A51] hover:text-[#2CBC63] font-medium transition-colors duration-200 cursor-pointer text-[12.5px]"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
