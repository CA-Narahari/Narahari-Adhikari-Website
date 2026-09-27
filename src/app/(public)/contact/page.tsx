'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  Calendar,
  ArrowRight,
  Shield,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export default function ContactPage() {
  const { settings, officeHours } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Tax Advisory');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-20 lg:space-y-28 pb-20">
      {/* 1. Hero Section matching Ideas/contactpage.png */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/80 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F26430]">
              <span>Contact Us</span>
              <span className="h-px w-8 bg-[#F26430] inline-block" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-bold text-slate-900 leading-[1.15] tracking-tight">
              Get in Touch With Us
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              We&apos;re here to help. Whether you have a question, need expert tax advice, or want to book a consultation, feel free to reach out. Our team will get back to you promptly.
            </p>

            {/* 3 Trust Chips (Matching Ideas/contactpage.png) */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-50 border border-orange-200/60 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#F26430]" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-900 leading-tight">Quick Response</div>
                  <div className="text-slate-500 text-[11px]">Within 24 hours</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-900 leading-tight">Professional Support</div>
                  <div className="text-slate-500 text-[11px]">From our expert team</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-900 leading-tight">Your Trust Matters</div>
                  <div className="text-slate-500 text-[11px]">We&apos;re here for you</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Contact Grid matching Ideas/contactpage.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Office Contact Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 text-xs">
              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#F26430] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">Phone</span>
                    <a href={`tel:${settings.phone}`} className="text-slate-600 hover:text-slate-900 block mt-0.5">
                      {settings.phone}
                    </a>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Available Sun – Fri, 9:30 AM – 5:30 PM
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#F26430] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">Email</span>
                    <a href={`mailto:${settings.email}`} className="text-slate-600 hover:text-slate-900 block mt-0.5">
                      {settings.email}
                    </a>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Official client correspondence
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#F26430] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">Our Office</span>
                    <span className="text-slate-600 block mt-0.5">
                      {settings.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#F26430] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">Office Hours</span>
                    <span className="text-slate-600 block mt-0.5">
                      {settings.office_hours_summary}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp Redirect Button */}
              <div className="pt-4 border-t border-slate-100">
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=Hello%2C%20I%20have%20an%20inquiry%20regarding%20CA%20services.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Center Column: Form (Matching Ideas/contactpage.png) */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F26430] mb-1">
                  <span>Send Us a Message</span>
                  <span className="h-px w-8 bg-[#F26430] inline-block" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-900">
                  How Can We Help You?
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill out the form below and we&apos;ll get back to you shortly.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                  <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-bold text-emerald-900">Message Successfully Sent</h3>
                  <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
                    Thank you, {name}. Your inquiry has been routed to our practice partners. We will reach you at {email}.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded text-xs font-semibold hover:bg-emerald-800"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-[#F26430] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-[#F26430] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+977 ..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-[#F26430] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">
                        Subject
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-[#F26430] focus:outline-none"
                      >
                        <option value="Tax Advisory">Tax Planning & Filing</option>
                        <option value="Audit & Assurance">Statutory / Internal Audit</option>
                        <option value="Accounting & Bookkeeping">Accounting & Bookkeeping</option>
                        <option value="Company Registration">Company Registration / OCR</option>
                        <option value="General Inquiry">General Firm Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="How can we help you?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-[#F26430] focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#F26430] hover:bg-[#DC5322] text-white font-semibold rounded-lg text-xs shadow-sm transition-all"
                    >
                      <span>Send Message</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bottom Consultation Strip (Matching Ideas/contactpage.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-[#F26430]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F26430] block">
                Book an Appointment
              </span>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mt-0.5">
                Schedule a Consultation
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Need personalized advice? Book an appointment with our experts at your convenience.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/book-appointment"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#F26430] hover:bg-[#DC5322] text-white font-semibold rounded-lg text-sm shadow-sm transition-all"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
