'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ArrowRight } from 'lucide-react';

export default function EntryPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds on initial load if not dismissed in session
    const dismissed = sessionStorage.getItem('nh_entry_popup_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('nh_entry_popup_dismissed', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      handleClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.12 }}
            className="relative w-full max-w-[680px] bg-white rounded-2xl shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2"
          >
            {/* Close */}
            <button
              onClick={handleClose}
              aria-label="Close popup"
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left: Photo */}
            <div className="relative bg-gradient-to-b from-[#d4e8de] to-[#e8f0eb] min-h-[200px] md:min-h-[360px] flex items-end justify-center overflow-hidden">
              <Image
                src="/profile-picture.png"
                alt="Narahari Adhikari"
                width={340}
                height={420}
                className="relative z-10 w-full h-full max-h-[340px] object-cover object-top"
                priority
              />
            </div>

            {/* Right: Content */}
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              {submitted ? (
                <div className="text-center space-y-3 py-6">
                  <CheckCircle className="w-10 h-10 text-[#2CBC63] mx-auto" />
                  <h4 className="text-lg font-bold text-[#023A51]">Thank you!</h4>
                  <p className="text-sm text-[#59667D]">
                    We will get back to you shortly.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#023A51] leading-tight">
                      Looking for a reliable partner in business<span className="text-[#2CBC63]">?</span>
                    </h3>
                    <div className="h-0.5 w-10 bg-[#2CBC63] mt-3 rounded-full" />
                  </div>

                  <p className="text-sm text-[#4A5259] leading-relaxed">
                    Subscribe to receive updates on tax regulations, compliance deadlines, and financial advisory insights.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full h-11 px-4 rounded-lg border border-[#D5E0DC] bg-[#FAFDFB] text-sm text-[#0D3B3E] placeholder:text-[#9AAEB0] focus:border-[#2CBC63] focus:outline-none focus:ring-2 focus:ring-[#2CBC63]/20 transition-all"
                    />
                    <button
                      type="submit"
                      className="w-full h-11 rounded-lg bg-[#0C4A4E] hover:bg-[#083639] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
                    >
                      Subscribe
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  <p className="text-[10px] text-[#8C9EA1] text-center">
                    By subscribing, you agree to our{' '}
                    <Link href="/terms" className="underline hover:text-[#0D3B3E]">
                      Terms & Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
