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
    // Show popup after 1.8 seconds on initial load if not dismissed in session
    const dismissed = sessionStorage.getItem('nh_entry_popup_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1800);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#022A3A]/60 backdrop-blur-sm">
          {/* Backdrop Click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0"
          />

          {/* Modal Container matching Ideas/Entry Popup Card.png */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-12 border border-[#E8EBEF]"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              aria-label="Close popup"
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Column: Professional Portrait Photo */}
            <div className="md:col-span-5 relative bg-gradient-to-br from-[#9ec2c0]/40 to-[#e3efe9] min-h-[220px] md:min-h-[420px] flex items-end justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/60 via-transparent to-transparent pointer-events-none" />
              <Image
                src="/profile-picture.png"
                alt="CA Narahari Adhikari"
                width={400}
                height={500}
                className="relative z-10 w-full h-full max-h-[380px] object-cover object-top drop-shadow-md"
                priority
              />
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-xs py-1.5 px-3 rounded-lg text-center z-10 border border-white/60 shadow-xs">
                <span className="text-[11px] font-bold text-[#023A51] block leading-tight">CA Narahari Adhikari</span>
                <span className="text-[9.5px] text-[#59667D]">Managing Partner • ICAN Fellow Member</span>
              </div>
            </div>

            {/* Right Column: Content matching Ideas/Entry Popup Card.png */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center relative">
              {/* Subtle background hexagon/soft shape */}
              <div className="absolute top-6 right-6 w-24 h-24 bg-[#9ec2c0]/15 rounded-full blur-2xl pointer-events-none" />

              <div>
                <h3 className="text-2xl sm:text-[28px] font-extrabold text-[#023A51] leading-tight tracking-tight">
                  Looking For A Reliable Partner In Business<span className="text-[#2CBC63]">?</span>
                </h3>

                {/* Accent line */}
                <div className="h-1 w-12 bg-[#2CBC63] mt-3 mb-4 rounded-full" />

                <p className="text-xs sm:text-[13px] text-[#4A5259] leading-relaxed mb-6">
                  We are preparing a new home for our Tax Business Advisory & Offshore Accounting Services. In the meantime, our team remains fully reachable — please get in touch through any of the options below.
                </p>

                {submitted ? (
                  <div className="py-6 px-4 bg-[#2CBC63]/10 border border-[#2CBC63]/30 rounded-xl text-center space-y-2">
                    <CheckCircle className="w-8 h-8 text-[#2CBC63] mx-auto" />
                    <h4 className="text-sm font-bold text-[#023A51]">Thank you for reaching out!</h4>
                    <p className="text-xs text-[#33475B]">
                      Our advisory team will contact you shortly with your consultation details.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email *"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-[#023A51] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2CBC63] focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="w-full py-3 px-6 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Subscribe & Inquire</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 text-center">
                      By entering your email, you are agreed to our{' '}
                      <Link href="/about" onClick={handleClose} className="underline text-slate-600 hover:text-[#023A51]">
                        Terms & Conditions
                      </Link>
                      .
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
