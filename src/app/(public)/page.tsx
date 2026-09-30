'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import {
  MapPin,
  Mail,
  Clock,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import MagicRings from '@/components/ui/MagicRings';
import ServicesCarousel from '@/components/ui/ServicesCarousel';

export default function HomePage() {
  const { settings } = useApp();

  return (
    <div className="space-y-20 lg:space-y-28 pb-20 overflow-x-hidden">
      {/* 1. Hero Section matching Ideas/LandingPage.png */}
      <section id="hero-section" className="relative bg-hero-gradient pt-8 pb-16 lg:pt-14 lg:pb-12 overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 space-y-6 lg:pb-6 text-left"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#022A3A] leading-[1.12] tracking-tight">
                Narahari Adhikari. Clear guidance for your next business decision<span className="text-[#2CBC63]">.</span>
              </h1>

              <p className="text-base sm:text-[17.5px] text-[#16384C] font-normal leading-relaxed max-w-xl">
                Talk with a Chartered Accountant about tax, audit, reporting, or the next step for your business in Nepal.
              </p>

              {/* Action Buttons: Clean Pill Style Matching Avada Reference */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/book-appointment"
                  className="px-7 py-3 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-[15px] shadow-sm hover:shadow-md transition-all active:scale-[0.98] inline-flex items-center justify-center cursor-pointer"
                >
                  Book a consultation
                </Link>

                <Link
                  href="/services"
                  className="px-7 py-3 rounded-full bg-white hover:bg-slate-50 text-[#023A51] font-bold text-[15px] shadow-sm hover:shadow-md transition-all active:scale-[0.98] inline-flex items-center justify-center cursor-pointer border border-white/80"
                >
                  Our Services
                </Link>
              </div>
            </motion.div>

            {/* Right Component: Centered Profile Picture with MagicRings */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="lg:col-span-5 flex items-center justify-center relative py-4 lg:py-6"
            >
              <div className="relative w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[500px] h-[440px] sm:h-[480px] lg:h-[510px] flex items-center justify-center">
                {/* MagicRings Component as interactive background aura */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-auto overflow-visible">
                  <div className="w-[520px] h-[520px] sm:w-[580px] sm:h-[580px] lg:w-[620px] lg:h-[620px] shrink-0">
                    <MagicRings
                      color="#ffffff"
                      colorTwo="#2CBC63"
                      ringCount={5}
                      speed={0.7}
                      attenuation={14}
                      lineThickness={2.2}
                      baseRadius={0.34}
                      radiusStep={0.09}
                      scaleRate={0.07}
                      opacity={0.9}
                      blur={0}
                      noiseAmount={0}
                      rotation={-15}
                      ringGap={1.4}
                      fadeIn={0.6}
                      fadeOut={0.4}
                      followMouse={true}
                      mouseInfluence={0.25}
                      hoverScale={1.12}
                      parallax={0.04}
                      clickBurst={true}
                      alphaMode="coverage"
                    />
                  </div>
                </div>

                {/* Profile Picture centered */}
                <div className="relative z-10 flex items-center justify-center pointer-events-none">
                  <Image
                    src="/profile-picture.png?v=fresh2"
                    alt="CA Narahari Adhikari - Chartered Accountant Nepal"
                    width={450}
                    height={520}
                    unoptimized={true}
                    priority
                    className="w-auto h-[380px] sm:h-[430px] lg:h-[470px] object-contain drop-shadow-2xl select-none"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Practice Areas & Services Carousel */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl sm:text-[38px] font-bold text-[#023A51] tracking-tight leading-tight">
              Our Professional Services<span className="text-[#2CBC63]">.</span>
            </h2>
          </div>
          <Link
            href="/services"
            className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[13.5px] font-bold text-[#023A51] hover:text-[#2CBC63] transition-all shadow-xs border border-[#E8EBEF] inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 text-[#2CBC63]" />
          </Link>
        </div>

        <div>
          <ServicesCarousel />
        </div>
      </section>

      {/* 3. Improvised Contact & Consultation Section */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="bg-[#023A51] rounded-[28px] sm:rounded-[36px] p-8 sm:p-12 lg:p-14 text-white shadow-xl relative overflow-hidden">
          {/* Subtle luminous ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2CBC63]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start relative z-10">
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white tracking-tight">
                  Have a tax, audit, or reporting question<span className="text-[#2CBC63]">?</span>
                </h2>
                <p className="text-[14.5px] text-slate-300 leading-relaxed font-normal">
                  Tell us what you are working through. We will point you to the right person, next step, or meeting format.
                </p>
              </div>

              {/* Direct Info List */}
              <div className="space-y-5 text-sm">
                {/* Office */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-[#2CBC63]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                      <div className="font-bold text-white text-[14px]">Meet at our Kathmandu office</div>
                    <div className="text-xs sm:text-[13px] text-slate-300 mt-1 leading-relaxed">
                      Send a request for an in-person consultation. We will confirm the time with you.
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-[#2CBC63]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                      <div className="font-bold text-white text-[14px]">A direct reply</div>
                    <div className="text-xs sm:text-[13px] text-slate-300 mt-1 space-y-1">
                      <a href={`mailto:${settings.email}`} className="hover:text-[#2CBC63] transition-colors block">
                        {settings.email}
                      </a>
                      <a href={`tel:${settings.phone}`} className="hover:text-[#2CBC63] transition-colors block">
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Open Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-[#2CBC63]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-[14px]">Office Hours</div>
                    <div className="text-xs sm:text-[13px] text-slate-300 mt-1 leading-relaxed">
                      Sunday &ndash; Friday: 10:00 AM &ndash; 5:00 PM<br />
                      Saturday: Closed (Appointments Available)
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action Link */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=Hello%20CA%20Team%2C%20I%20would%20like%20to%20consult%20regarding%20tax%20and%20audit%20in%20Nepal.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2CBC63]/20 hover:bg-[#2CBC63]/30 text-[#8BE0A8] text-xs font-semibold border border-[#2CBC63]/30 transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-[#2CBC63]" />
                  <span>Immediate query? Chat directly on WhatsApp &rarr;</span>
                </a>
              </div>
            </div>

            {/* Consultation booking actions */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl p-6 sm:p-9 text-[#33475B] shadow-2xl flex min-h-[360px] flex-col justify-center">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2CBC63]">Talk with our team</p>
                <h3 className="mt-3 text-2xl font-bold text-[#023A51]">Request an in-person consultation</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#59667D]">
                  Share what you need help with and your preferred date. We will review the request and contact you to confirm the meeting at our Kathmandu office.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="/book-appointment" className="inline-flex items-center justify-center rounded-full bg-[#2CBC63] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#25A456]">
                    Request a meeting
                  </Link>
                  <Link href="/book-appointment" className="inline-flex items-center justify-center rounded-full border border-[#DCE3E8] px-6 py-3 text-sm font-semibold text-[#023A51] transition-colors hover:bg-slate-50">
                    View consultation options
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
