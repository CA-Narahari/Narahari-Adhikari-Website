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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-3">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>Scheduled Client Engagements</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2">
          Schedule a Consultation With a Senior CA
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Book an in-office advisory session in Kathmandu or arrange a confidential telephone or video conference.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        {confirmed ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Consultation Scheduled!
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{clientName}</strong>. Your consultation for <strong>{serviceTitle}</strong> on <strong>{date}</strong> at <strong>{timeSlot}</strong> ({consultationType}) has been logged.
            </p>
            <div className="pt-4 p-4 bg-slate-50 border border-slate-200 rounded max-w-sm mx-auto text-xs text-slate-700">
              Our office coordination desk will transmit the meeting link / office directions to <strong>{clientEmail}</strong>.
            </div>
            <div className="pt-4">
              <button
                onClick={() => setConfirmed(false)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800"
              >
                Book Another Session
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 text-xs">
            {/* Step 1: Service Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                1. Select Advisory Practice Area
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((srv) => (
                  <button
                    type="button"
                    key={srv.id}
                    onClick={() => setServiceTitle(srv.title)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      serviceTitle === srv.title
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
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
              <label className="block text-sm font-bold text-slate-900 mb-2">
                2. Select Preferred Consultation Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { mode: 'Office Meeting', desc: 'In-person at New Baneshwor', icon: <Building className="w-4 h-4" /> },
                  { mode: 'Phone Consultation', desc: 'Direct confidential telephone call', icon: <Phone className="w-4 h-4" /> },
                  { mode: 'Online Meeting', desc: 'Google Meet / Zoom conference', icon: <Video className="w-4 h-4" /> },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.mode}
                    onClick={() => setConsultationType(item.mode as any)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      consultationType === item.mode
                        ? 'border-slate-900 bg-slate-900 text-white'
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

            {/* Step 3: Date & Live Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  3. Select Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  4. Available Time Slot
                </label>
                <div className="space-y-2">
                  {availableSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setTimeSlot(slot)}
                      className={`w-full p-2 rounded border text-left font-mono text-xs flex justify-between items-center transition-all ${
                        timeSlot === slot
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{slot}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-sans font-bold">
                        Available
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Contact Details */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="text-sm font-bold text-slate-900">
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
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
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
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
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
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-md text-sm shadow transition-colors"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Confirm & Lock Appointment</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
