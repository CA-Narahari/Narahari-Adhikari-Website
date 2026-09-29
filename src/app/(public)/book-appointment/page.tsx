'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  Building,
  CheckCircle,
  Video,
  MapPin,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export default function BookAppointmentPage() {
  const { services, settings, addAppointment } = useApp();

  const [bookingMode, setBookingMode] = useState<'calendly' | 'form'>('calendly');

  // Direct On-Site Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [serviceTitle, setServiceTitle] = useState(
    services[0]?.title || 'Audit & Assurance'
  );
  const [consultationType, setConsultationType] = useState<
    'Office Meeting' | 'Phone Consultation' | 'Online Meeting'
  >('Office Meeting');
  const [preferredDate, setPreferredDate] = useState('2026-10-02');
  const [timeSlot, setTimeSlot] = useState('11:00 AM – 11:45 AM');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const availableSlots = [
    '10:30 AM – 11:15 AM',
    '11:30 AM – 12:15 PM',
    '02:00 PM – 02:45 PM',
    '03:00 PM – 03:45 PM',
    '04:00 PM – 04:45 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) {
      alert('Please fill out your name, email, and phone number.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      addAppointment({
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        service_title: serviceTitle,
        consultation_type: consultationType,
        date: preferredDate,
        time_slot: timeSlot,
        notes: companyName ? `Company: ${companyName}\n\n${notes}` : notes,
        status: 'pending',
      });
      setSubmitting(false);
      setConfirmed(true);
    }, 300);
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-24 overflow-x-hidden">
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
            <p className="text-base sm:text-[17px] text-[#33475B] font-normal leading-relaxed">
              Book a direct consultation with CA Narahari Adhikari. Choose an instant slot via Calendly for virtual meetings, or submit a request for an in-person session at our Kathmandu office.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT: Booking Panel (Calendly or Direct Form) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Mode Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#F4F6F8] rounded-2xl border border-[#E8EBEF]">
              <button
                type="button"
                onClick={() => setBookingMode('calendly')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  bookingMode === 'calendly'
                    ? 'bg-white text-[#023A51] shadow-xs border border-[#CCD7DC]'
                    : 'text-[#59667D] hover:text-[#023A51]'
                }`}
              >
                <CalendarIcon className="w-4 h-4 text-[#2CBC63]" />
                <span>Instant Online Scheduling (Calendly)</span>
              </button>

              <button
                type="button"
                onClick={() => setBookingMode('form')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  bookingMode === 'form'
                    ? 'bg-white text-[#023A51] shadow-xs border border-[#CCD7DC]'
                    : 'text-[#59667D] hover:text-[#023A51]'
                }`}
              >
                <Clock className="w-4 h-4 text-[#2CBC63]" />
                <span>Direct Office Meeting Request</span>
              </button>
            </div>

            {/* OPTION A: CALENDLY WIDGET */}
            {bookingMode === 'calendly' && (
              <div className="bg-white rounded-3xl border border-[#E8EBEF] p-4 sm:p-8 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8EBEF]">
                  <div>
                    <h2 className="text-xl font-bold text-[#023A51]">
                      30-Minute Advisory Session
                    </h2>
                    <p className="text-xs text-[#59667D] mt-0.5">
                      Direct meeting with CA Narahari Adhikari via Google Meet or Phone.
                    </p>
                  </div>
                  <a
                    href="https://calendly.com/narahariadhikari/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E8F4F8] hover:bg-[#2CBC63] text-[#023A51] hover:text-white text-xs font-bold transition-colors shrink-0"
                  >
                    <span>Open Calendly in New Tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Embedded Calendly iframe */}
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

                <p className="text-[11.5px] text-[#59667D] text-center pt-2">
                  After booking through Calendly, an automatic calendar invitation with meeting coordinates will be emailed to you immediately.
                </p>
              </div>
            )}

            {/* OPTION B: DIRECT ON-SITE FORM */}
            {bookingMode === 'form' && (
              <div className="bg-white rounded-3xl border border-[#E8EBEF] p-6 sm:p-10 shadow-xs">
                {confirmed ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-14 h-14 bg-[#2CBC63]/15 rounded-full flex items-center justify-center mx-auto text-[#2CBC63]">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#023A51]">
                      Consultation Request Received
                    </h2>
                    <p className="text-xs sm:text-sm text-[#4A5259] max-w-md mx-auto leading-relaxed">
                      Thank you, <strong>{clientName}</strong>. Your consultation request for <strong>{serviceTitle}</strong> on <strong>{preferredDate}</strong> ({consultationType}) has been recorded.
                    </p>
                    <div className="p-4 bg-[#E8F4F8] rounded-xl max-w-sm mx-auto text-xs text-[#023A51]">
                      Our team will confirm your meeting slot via email at <strong>{clientEmail}</strong> or telephone at <strong>{clientPhone}</strong>.
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmed(false);
                          setClientName('');
                          setClientEmail('');
                          setClientPhone('');
                          setNotes('');
                        }}
                        className="px-6 py-2.5 bg-[#023A51] hover:bg-[#2CBC63] text-white rounded-full text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Submit Another Request
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="border-b border-[#E8EBEF] pb-4">
                      <h2 className="text-xl font-bold text-[#023A51]">
                        Submit Consultation Request
                      </h2>
                      <p className="text-xs text-[#59667D] mt-0.5">
                        Tell us your preferred timing and advisory requirements. We respond within 24 hours.
                      </p>
                    </div>

                    {/* Contact Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="e.g. Ramesh Shrestha"
                            className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#CCD7DC] focus:outline-none focus:border-[#2CBC63] focus:ring-1 focus:ring-[#2CBC63]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                          Direct Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                          <input
                            type="tel"
                            required
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            placeholder="+977 98XXXXXXXX"
                            className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#CCD7DC] focus:outline-none focus:border-[#2CBC63] focus:ring-1 focus:ring-[#2CBC63]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                          <input
                            type="email"
                            required
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            placeholder="name@organization.com"
                            className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#CCD7DC] focus:outline-none focus:border-[#2CBC63] focus:ring-1 focus:ring-[#2CBC63]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                          Organization / Company Name
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g. Kathmandu Trading Pvt. Ltd."
                            className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#CCD7DC] focus:outline-none focus:border-[#2CBC63] focus:ring-1 focus:ring-[#2CBC63]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Service & Meeting Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                          Practice Area
                        </label>
                        <select
                          value={serviceTitle}
                          onChange={(e) => setServiceTitle(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#CCD7DC] focus:outline-none focus:border-[#2CBC63] bg-white cursor-pointer"
                        >
                          <option value="Audit and Assurance">Audit and Assurance</option>
                          <option value="Taxation Consultancy Services">Taxation Consultancy Services</option>
                          <option value="Mergers and Acquisitions">Mergers and Acquisitions</option>
                          <option value="Advisory Services">Advisory Services</option>
                          <option value="Business Support and Outsourcing">Business Support and Outsourcing</option>
                          <option value="NFRS/IFRS Implementation">NFRS/IFRS Implementation</option>
                          <option value="Training and Seminar">Training and Seminar</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                          Meeting Mode
                        </label>
                        <select
                          value={consultationType}
                          onChange={(e) =>
                            setConsultationType(
                              e.target.value as 'Office Meeting' | 'Phone Consultation' | 'Online Meeting'
                            )
                          }
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#CCD7DC] focus:outline-none focus:border-[#2CBC63] bg-white cursor-pointer"
                        >
                          <option value="Office Meeting">In-Person Office Meeting (Kathmandu)</option>
                          <option value="Online Meeting">Online Video Meeting (Google Meet)</option>
                          <option value="Phone Consultation">Telephone Consultation</option>
                        </select>
                      </div>
                    </div>

                    {/* Date & Time Slot */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#CCD7DC] focus:outline-none focus:border-[#2CBC63] bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                          Preferred Time Window
                        </label>
                        <select
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#CCD7DC] focus:outline-none focus:border-[#2CBC63] bg-white cursor-pointer"
                        >
                          {availableSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Context / Notes */}
                    <div>
                      <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                        Brief Context or Specific Questions (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Briefly state your tax year, filing deadline, or consultation objective..."
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#CCD7DC] focus:outline-none focus:border-[#2CBC63] resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3.5 px-6 rounded-full bg-[#023A51] hover:bg-[#2CBC63] text-white font-bold text-xs sm:text-sm transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        {submitting ? 'Transmitting Request...' : 'Confirm Consultation Request'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Office & Contact Information */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#E8F4F8] rounded-3xl p-6 sm:p-8 border border-[#CCD7DC]/80 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#023A51]">
                  Direct Office Contact
                </h3>
                <p className="text-xs text-[#59667D] mt-1 leading-relaxed">
                  For immediate statutory matters or urgent tax assessment deadlines, reach our team directly.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-[13px] text-[#4A5259]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#2CBC63] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#023A51] block">Location:</span>
                    <span>{settings.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#2CBC63] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#023A51] block">Telephone:</span>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-[#023A51] font-mono hover:underline"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#2CBC63] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#023A51] block">Electronic Mail:</span>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-[#023A51] font-mono hover:underline"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#2CBC63] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#023A51] block">Office Hours:</span>
                    <span>Sunday &ndash; Friday: 10:00 AM &ndash; 5:00 PM</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp direct */}
              <div className="pt-2 border-t border-[#CCD7DC]/60">
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=Hello%20CA%20Narahari%20Adhikari%2C%20I%20would%20like%20to%20schedule%20a%20consultation.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#023A51] hover:text-[#2CBC63] border border-[#CCD7DC] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#2CBC63]" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Confidentiality & ICAN Notice */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8EBEF] text-xs text-[#59667D] space-y-2">
              <div className="font-bold text-[#023A51] text-xs">
                Confidentiality & Compliance
              </div>
              <p className="leading-relaxed">
                All client discussions, accounting records, and tax disclosures are held in strict professional confidence under the Institute of Chartered Accountants of Nepal (ICAN) Code of Ethics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
