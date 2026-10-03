'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  Building,
  CheckCircle,
  ExternalLink,
  MapPin,
} from 'lucide-react';

export default function BookAppointmentPage() {
  const { services, addAppointment } = useApp();

  const [bookingMode, setBookingMode] = useState<'form' | 'calendly'>('form');

  // Direct Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [serviceTitle, setServiceTitle] = useState(
    services[0]?.title || 'Audit & Assurance Services'
  );
  const [preferredDate, setPreferredDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('11:00 AM – 11:45 AM');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const availableSlots = [
    '10:30 AM – 11:15 AM',
    '11:30 AM – 12:15 PM',
    '02:00 PM – 02:45 PM',
    '03:00 PM – 03:45 PM',
    '04:00 PM – 04:45 PM',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError('');
    if (!clientName || !clientEmail || !clientPhone) {
      alert('Please fill out your full name, email address, and phone number.');
      return;
    }

    setSubmitting(true);
    const today = new Date();
    const localToday = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
    if (preferredDate < localToday) {
      setSubmitting(false);
      setSubmissionError('Choose today or a later date for your meeting.');
      return;
    }
    try {
      const saved = await addAppointment({
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        service_title: serviceTitle,
        consultation_type: 'Office Meeting',
        date: preferredDate,
        time_slot: timeSlot,
        notes: companyName ? `Organization: ${companyName}\n\n${notes}` : notes,
        status: 'pending',
      });
      if (!saved) {
        setSubmissionError('We could not save your request. Please try again or contact the practice directly.');
        return;
      }
      setConfirmed(true);
    } catch {
      setSubmissionError('We could not save your request. Please try again or contact the practice directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-28 overflow-x-hidden bg-[#FAFCFD]">
      {/* 1. Hero Header */}
      <section
        id="hero-section"
        className="relative bg-hero-gradient pt-8 pb-12 sm:pt-12 sm:pb-16 overflow-hidden"
      >
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              Schedule a Consultation<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-[17px] text-[#4A5259] leading-relaxed">
              Request a meeting at our Kathmandu office, or choose an available online time through Calendly.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main Booking Experience */}
      <div className="max-w-[1000px] mx-auto px-6 pt-10 sm:pt-14">
        {/* Tab Switcher: Form first, Calendly second */}
        <div className="flex items-center gap-2 p-1.5 bg-[#F1F5F9] rounded-2xl border border-[#E2E8F0] mb-8">
          <button
            type="button"
            onClick={() => setBookingMode('form')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              bookingMode === 'form'
                ? 'bg-white text-[#023A51] shadow-xs border border-[#CBD5E1]'
                : 'text-[#64748B] hover:text-[#023A51]'
            }`}
          >
            <Clock className="w-4 h-4 text-[#2CBC63]" />
            <span>Request an office meeting</span>
          </button>

          <button
            type="button"
            onClick={() => setBookingMode('calendly')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              bookingMode === 'calendly'
                ? 'bg-white text-[#023A51] shadow-xs border border-[#CBD5E1]'
                : 'text-[#64748B] hover:text-[#023A51]'
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-[#2CBC63]" />
            <span>Book online with Calendly</span>
          </button>
        </div>

        {/* DEFAULT TAB: DIRECT ON-SITE FORM */}
        {bookingMode === 'form' && (
          <div className="bg-white rounded-3xl border border-[#E8EBEF] p-6 sm:p-10 shadow-sm">
            {confirmed ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-[#2CBC63]/15 rounded-full flex items-center justify-center mx-auto text-[#2CBC63]">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023A51]">
                  Consultation Request Received
                </h2>
                <p className="text-xs sm:text-sm text-[#4A5259] max-w-lg mx-auto leading-relaxed">
                  Thank you, <strong>{clientName}</strong>. Your request for an office meeting about <strong>{serviceTitle}</strong> on <strong>{preferredDate}</strong> has been recorded.
                </p>
                <div className="p-4 bg-[#E8F4F8] rounded-2xl max-w-md mx-auto text-xs text-[#023A51] leading-relaxed border border-[#CCD7DC]">
                  Our office coordinator will review your request and confirm your appointment slot via email at <strong>{clientEmail}</strong> or telephone at <strong>{clientPhone}</strong> within one working day.
                </div>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmed(false);
                      setClientName('');
                      setClientEmail('');
                      setClientPhone('');
                      setCompanyName('');
                      setNotes('');
                    }}
                    className="px-7 py-3 bg-[#023A51] hover:bg-[#2CBC63] text-white rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-[#E8EBEF] pb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#023A51]">
                    Tell us about your requirements
                  </h2>
                  <p className="text-xs sm:text-[13px] text-[#59667D] mt-1">
                    Provide your contact details and preferred meeting date. We will confirm your slot promptly.
                  </p>
                </div>

                {/* Personal & Organization Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Ramesh Shrestha"
                        className="h-11 w-full rounded-xl pl-10 text-xs sm:text-sm bg-[#F8FAFC] border-[#CCD7DC] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+977 98XXXXXXXX"
                        className="h-11 w-full rounded-xl pl-10 text-xs sm:text-sm bg-[#F8FAFC] border-[#CCD7DC] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="h-11 w-full rounded-xl pl-10 text-xs sm:text-sm bg-[#F8FAFC] border-[#CCD7DC] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                      Company / Organization Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Nepal Trading Pvt. Ltd."
                        className="h-11 w-full rounded-xl pl-10 text-xs sm:text-sm bg-[#F8FAFC] border-[#CCD7DC] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Practice Area and meeting location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                      Practice Area / Service
                    </label>
                    <select
                      value={serviceTitle}
                      onChange={(e) => setServiceTitle(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs sm:text-sm rounded-xl border border-[#CCD7DC] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2CBC63] cursor-pointer"
                    >
                      <option value="Tax Advisory & IRD Compliance">Tax Advisory & IRD Compliance</option>
                      <option value="Audit & Assurance Services">Audit & Assurance Services</option>
                      <option value="Mergers & Acquisitions">Mergers & Acquisitions</option>
                      <option value="Business Advisory & Strategy">Business Advisory & Strategy</option>
                      <option value="Business Support & BPO">Business Support & BPO</option>
                      <option value="NFRS/IFRS Implementation">NFRS/IFRS Implementation</option>
                      <option value="Training & Professional Seminars">Training & Professional Seminars</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-[#CCD7DC] bg-[#F8FAFC] px-4 py-3">
                    <MapPin aria-hidden="true" className="size-5 shrink-0 text-[#2CBC63]" />
                    <div>
                      <p className="text-xs font-bold text-[#023A51]">Meeting location</p>
                      <p className="mt-0.5 text-sm text-[#59667D]">In person at our Kathmandu office</p>
                    </div>
                  </div>
                </div>

                {/* Preferred Date & Time Window */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                      Preferred Date
                    </label>
                    <Input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="h-11 w-full rounded-xl bg-[#F8FAFC] border-[#CCD7DC] text-xs sm:text-sm focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                      Preferred Time Slot
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs sm:text-sm rounded-xl border border-[#CCD7DC] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2CBC63] cursor-pointer"
                    >
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Context & Description */}
                <div>
                  <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                    Brief Summary of Your Inquiry (Optional)
                  </label>
                  <Textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide relevant context regarding your audit year, IRD notice, or advisory topic..."
                    className="min-h-24 w-full rounded-xl text-xs sm:text-sm bg-[#F8FAFC] border-[#CCD7DC] focus:bg-white"
                  />
                </div>

                <label className="flex items-start gap-2 text-xs leading-5 text-[#59667D]">
                  <input type="checkbox" required className="mt-0.5 size-4 accent-[#023A51]" />
                  <span>I have read the <Link href="/privacy" className="font-semibold text-[#023A51] underline underline-offset-2">Privacy Policy</Link> and consent to the use of my details to respond to this request.</span>
                </label>

                {submissionError && (
                  <p role="alert" className="text-sm font-medium text-red-700">{submissionError}</p>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="h-12 w-full rounded-full bg-[#023A51] hover:bg-[#2CBC63] text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                  >
                    {submitting ? 'Submitting request...' : 'Send Consultation Request'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* OPTION B: CALENDLY WIDGET */}
        {bookingMode === 'calendly' && (
          <div className="bg-white rounded-3xl border border-[#E8EBEF] p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8EBEF]">
              <div>
                <h2 className="text-xl font-bold text-[#023A51]">
                  Instant Video Consultation (30 Minutes)
                </h2>
              <p className="text-xs text-[#59667D] mt-0.5">
                  Pick an available time on CA Narahari Adhikari&apos;s calendar for an online meeting.
                </p>
              </div>
              <a
                href="https://calendly.com/narahariadhikari/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E8F4F8] hover:bg-[#2CBC63] text-[#023A51] hover:text-white text-xs font-bold transition-colors shrink-0"
              >
                <span>Open in new tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="w-full rounded-2xl overflow-hidden border border-[#E8EBEF] bg-[#FBFDFE]">
              <iframe
                src="https://calendly.com/narahariadhikari/30min?hide_landing_page_details=1&hide_gdpr_banner=1"
                width="100%"
                height="700"
                frameBorder="0"
                title="Calendly Scheduling - CA Narahari Adhikari"
                className="w-full min-h-[680px]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
