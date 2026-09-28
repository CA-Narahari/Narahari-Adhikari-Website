'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  Building,
  CheckCircle,
  FileCheck2,
  Video,
  MapPin,
} from 'lucide-react';

export default function BookAppointmentPage() {
  const { services, addAppointment } = useApp();

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceTitle, setServiceTitle] = useState(services[0]?.title || 'Tax Advisory & Compliance');
  const [consultationType, setConsultationType] = useState<'Office Meeting' | 'Phone Consultation' | 'Online Meeting'>('Office Meeting');
  const [date, setDate] = useState('2026-09-30');
  const [timeSlot, setTimeSlot] = useState('11:00 AM – 11:45 AM');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const availableSlots = [
    '10:00 AM – 10:45 AM',
    '11:00 AM – 11:45 AM',
    '01:30 PM – 02:15 PM',
    '02:30 PM – 03:15 PM',
    '04:00 PM – 04:45 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) {
      alert('Please fill out all required contact fields.');
      return;
    }

    addAppointment({
      client_name: clientName,
      client_email: clientEmail,
      client_phone: clientPhone,
      service_title: serviceTitle,
      consultation_type: consultationType,
      date,
      time_slot: timeSlot,
      notes,
      status: 'pending',
    });

    setConfirmed(true);
  };

  return (
    <div className="space-y-16 pb-20 overflow-x-hidden">
      {/* 1. Hero Header */}
      <section className="relative bg-hero-gradient pt-10 pb-16 lg:pt-14 lg:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2CBC63]">
              Consultation
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#023A51] leading-[1.12] tracking-tight">
              Schedule a Consultation<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#33475B] font-normal leading-relaxed max-w-2xl">
              Book an in-office advisory session in Kathmandu or arrange a confidential telephone or video conference with a senior Chartered Accountant.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Form Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E8EBEF] rounded-2xl p-6 sm:p-10 shadow-xs">
          {confirmed ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 bg-[#2CBC63]/15 rounded-full flex items-center justify-center mx-auto text-[#2CBC63]">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-[#023A51]">
                Consultation Scheduled!
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5259] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{clientName}</strong>. Your consultation for <strong>{serviceTitle}</strong> on <strong>{date}</strong> at <strong>{timeSlot}</strong> ({consultationType}) has been logged.
              </p>
              <div className="pt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-sm mx-auto text-xs text-[#33475B]">
                Our coordination desk will transmit the meeting link / office directions to <strong>{clientEmail}</strong>.
              </div>
              <div className="pt-4">
                <button
                  onClick={() => setConfirmed(false)}
                  className="px-6 py-2.5 bg-[#023A51] text-white rounded-lg text-xs font-semibold hover:bg-[#034e6d] transition-colors cursor-pointer"
                >
                  Book Another Session
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 text-xs">
              {/* Step 1: Service Selection */}
              <div>
                <label className="block text-sm font-bold text-[#023A51] mb-2">
                  1. Select Advisory Practice Area
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((srv) => (
                    <button
                      type="button"
                      key={srv.id}
                      onClick={() => setServiceTitle(srv.title)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        serviceTitle === srv.title
                          ? 'border-[#023A51] bg-[#023A51] text-white shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold text-xs">{srv.title}</div>
                      <div className={`text-[11px] mt-0.5 line-clamp-1 ${serviceTitle === srv.title ? 'text-slate-300' : 'text-slate-500'}`}>
                        {srv.short_description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Consultation Mode */}
              <div>
                <label className="block text-sm font-bold text-[#023A51] mb-2">
                  2. Select Preferred Consultation Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { mode: 'Office Meeting', desc: 'In-person at New Baneshwor', icon: <Building className="w-4 h-4 text-[#2CBC63]" /> },
                    { mode: 'Phone Consultation', desc: 'Direct confidential telephone call', icon: <Phone className="w-4 h-4 text-[#2CBC63]" /> },
                    { mode: 'Online Meeting', desc: 'Google Meet / Zoom conference', icon: <Video className="w-4 h-4 text-[#2CBC63]" /> },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.mode}
                      onClick={() => setConsultationType(item.mode as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        consultationType === item.mode
                          ? 'border-[#023A51] bg-[#023A51] text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs">
                        {item.icon}
                        <span>{item.mode}</span>
                      </div>
                      <div className={`text-[11px] mt-1 ${consultationType === item.mode ? 'text-slate-300' : 'text-slate-500'}`}>
                        {item.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Date & Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#023A51] mb-2">
                    3. Select Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs focus:ring-1 focus:ring-[#2CBC63] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#023A51] mb-2">
                    4. Available Time Slot
                  </label>
                  <div className="space-y-2">
                    {availableSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setTimeSlot(slot)}
                        className={`w-full p-2 rounded-lg border text-left font-mono text-xs flex justify-between items-center transition-all cursor-pointer ${
                          timeSlot === slot
                            ? 'border-[#2CBC63] bg-[#2CBC63]/10 text-[#023A51] font-bold'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{slot}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2CBC63]/20 text-[#2CBC63] font-sans font-bold">
                          Available
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 4: Contact Information */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="text-sm font-bold text-[#023A51]">
                  5. Your Contact Information
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-[#2CBC63] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="email@company.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-[#2CBC63] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Phone / Mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+977 98XXXXXXXX"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-[#2CBC63] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Brief Agenda / Specific Documents for Review
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Discussing advance corporate tax installment calculations and VAT reconciliation..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-[#2CBC63] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Confirm & Lock Appointment</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
