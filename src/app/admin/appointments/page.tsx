'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Building,
  Video,
  User,
} from 'lucide-react';

export default function AdminAppointmentsPage() {
  const { appointments, updateAppointmentStatus } = useApp();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Appointments & Consultations Manager
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review booked consultation sessions, approve slots, and manage client engagement modes.
        </p>
      </div>

      {/* Appointments List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-700">
            All Appointments ({appointments.length})
          </span>
        </div>

        <div className="divide-y divide-slate-200">
          {appointments.map((apt) => (
            <div key={apt.id} className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-900">{apt.client_name}</h2>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        apt.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Service: <strong className="text-slate-900">{apt.service_title}</strong> <span className="hidden sm:inline">•</span> <br className="sm:hidden" />Mode: <span className="font-semibold text-slate-800">{apt.consultation_type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-colors"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-medium border border-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Contact & Slot Details */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                <div className="flex flex-wrap items-center gap-6 text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <strong>Date: {apt.date}</strong>
                  </span>
                  <span className="flex items-center gap-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Slot: {apt.time_slot}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`mailto:${apt.client_email}`} className="text-slate-800 hover:underline">
                      {apt.client_email}
                    </a>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`tel:${apt.client_phone}`} className="text-slate-800 hover:underline">
                      {apt.client_phone}
                    </a>
                  </span>
                </div>

                {apt.notes && (
                  <div className="pt-2 text-slate-700 leading-relaxed border-t border-slate-200">
                    <strong>Client Agenda:</strong> {apt.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
