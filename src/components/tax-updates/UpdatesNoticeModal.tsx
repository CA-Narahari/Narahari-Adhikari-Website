'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, MapPin, Phone, Globe, Briefcase, GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function UpdatesNoticeModal() {
  const { settings } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem('updates_banner_dismissed');
    if (!dismissed) {
      // Pop up smoothly when entering the updates section
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('updates_banner_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop with subtle blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative z-10 w-full max-w-[540px] my-auto"
          >
            {/* Main Notice Card */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#D9D3C7] bg-[#FCFBF7] text-[#2D3748] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)]">
              {/* Decorative top pattern */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#023A51] via-[#2CBC63] to-[#023A51]" />

              {/* Decorative confetti dots */}
              <div className="absolute top-3 right-6 flex items-center gap-1.5 opacity-40">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2CBC63]" />
                <span className="w-2 h-2 rounded-full bg-[#023A51]" />
                <span className="w-1 h-1 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#2CBC63]/60" />
              </div>

              {/* Card Header: Firm Logo */}
              <div className="pt-6 sm:pt-7 px-6 sm:px-8 pb-3 border-b border-[#EBE7DF] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src="/Logo.png"
                    alt={settings.company_name || 'Narahari Adhikari Chartered Accountants'}
                    width={220}
                    height={55}
                    priority
                    className="h-9 sm:h-11 w-auto object-contain"
                  />
                </div>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold tracking-wider uppercase bg-[#E7F6EC] text-[#16723B] border border-[#BFE5CB]">
                  Notice
                </span>
              </div>

              {/* Banner Graphic Center: "We are Hiring!" */}
              <div className="px-6 sm:px-8 pt-5 pb-4 text-center">
                <div className="inline-block relative">
                  {/* Speech bubble / brush banner */}
                  <div className="relative inline-flex items-center justify-center px-8 py-2.5 rounded-2xl bg-gradient-to-r from-[#D7EBF8] via-[#E2F0FB] to-[#D5E9F7] border border-[#B4D7EF] shadow-xs">
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#023A51] font-serif italic">
                      We are Hiring!
                    </span>
                  </div>

                  {/* Megaphone icon left */}
                  <div className="absolute -left-4 -top-1 w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-[#2CBC63] rotate-[-12deg]">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>

                {/* Trainees Pill */}
                <div className="mt-3.5 inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-white border border-[#CBD5E1] shadow-xs text-xs sm:text-[13px] font-bold text-[#023A51]">
                  <span>Article Trainees</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2CBC63]" />
                  <span>2 Vacancies</span>
                </div>
              </div>

              {/* Two Column Content: Contact / Info + Eligibility */}
              <div className="px-6 sm:px-8 py-4 grid grid-cols-1 sm:grid-cols-2 gap-5 text-left text-xs sm:text-[12.5px] border-t border-[#EBE7DF]">
                {/* Left Column: Application submission & contact */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[11px] font-extrabold tracking-wider uppercase text-[#023A51] mb-2 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#2CBC63]" />
                      <span>Send Your CV To:</span>
                    </h4>
                    <div className="space-y-1.5 text-[#4A5259]">
                      <a
                        href={`mailto:${settings.email}`}
                        className="font-semibold text-[#023A51] hover:text-[#2CBC63] transition-colors break-all block"
                      >
                        {settings.email || 'info@narahariadhikari.com'}
                      </a>
                      <p className="flex items-start gap-1 text-[11.5px] text-[#59667D]">
                        <MapPin className="w-3 h-3 text-[#7A889B] shrink-0 mt-0.5" />
                        <span>{settings.address || 'Putalisadak, Kathmandu, Nepal'}</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-extrabold tracking-wider uppercase text-[#023A51] mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#2CBC63]" />
                      <span>More Information:</span>
                    </h4>
                    <div className="space-y-1 text-[#4A5259] text-[11.5px]">
                      <p className="font-semibold text-[#023A51]">{settings.phone}</p>
                      <p className="flex items-center gap-1 text-[#59667D]">
                        <Globe className="w-3 h-3 text-[#7A889B]" />
                        <span>narahariadhikari.com</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Eligibility Criteria */}
                <div className="space-y-2 sm:border-l sm:border-[#EBE7DF] sm:pl-5">
                  <h4 className="text-[11px] font-extrabold tracking-wider uppercase text-[#023A51] mb-2 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#2CBC63]" />
                    <span>Eligibility Criteria:</span>
                  </h4>
                  <ul className="space-y-2 text-[#4A5259] text-[11.5px] leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2CBC63] shrink-0 mt-0.5" />
                      <span>Completed <strong>CAP-II / CA Intermediate</strong> level.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2CBC63] shrink-0 mt-0.5" />
                      <span>Completed 60 hrs ICAN IT training &amp; GMCS orientation.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2CBC63] shrink-0 mt-0.5" />
                      <span>Dedicated and eager to learn statutory auditing, taxation, and corporate advisory.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="px-6 sm:px-8 py-3.5 bg-[#F4F1EA] border-t border-[#E5E0D5] flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] font-medium text-[#74838A]">
                  ICAN Registered Chartered Accountancy Practice
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href="/careers"
                    onClick={handleClose}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <span>View Careers</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Circular Close Button exactly matching Image 2 */}
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-black shadow-lg flex items-center justify-center transition-all hover:scale-110 cursor-pointer border border-slate-200"
                aria-label="Close notice banner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
