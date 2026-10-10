'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  CalendarDays,
  Calendar,
  Clock,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Search,
  ExternalLink,
  UserRound,
} from 'lucide-react';
import type { Appointment } from '@/types';

type StatusFilter = 'all' | Appointment['status'];

const dateLabel = (value: string) => {
  const parsed = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(parsed.getTime())
    ? value
    : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(parsed);
};

export default function AdminAppointmentsPage() {
  const { appointments, updateAppointmentStatus } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [decisionError, setDecisionError] = useState<{ id: string; message: string } | null>(null);

  const counts = useMemo(
    () => ({
      all: appointments.length,
      pending: appointments.filter((item) => item.status === 'pending').length,
      confirmed: appointments.filter((item) => item.status === 'confirmed').length,
      rescheduled: appointments.filter((item) => item.status === 'rescheduled').length,
      cancelled: appointments.filter((item) => item.status === 'cancelled').length,
    }),
    [appointments]
  );

  const filters: { key: StatusFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All consultations', count: counts.all },
    { key: 'pending', label: 'Pending response', count: counts.pending },
    { key: 'confirmed', label: 'Confirmed meetings', count: counts.confirmed },
    { key: 'rescheduled', label: 'Needs new time', count: counts.rescheduled },
    { key: 'cancelled', label: 'Cancelled / closed', count: counts.cancelled },
  ];

  const normalizedSearch = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    return appointments.filter((item) => {
      const matchesSearch = [
        item.client_name,
        item.client_email,
        item.client_phone,
        item.company_name,
        item.service_title,
        item.notes,
      ].some((v) => v?.toLowerCase().includes(normalizedSearch));
      const matchesFilter = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesFilter;
    });
  }, [appointments, statusFilter, normalizedSearch]);

  const handleStatusChange = async (id: string, status: Appointment['status']) => {
    const appointment = appointments.find((item) => item.id === id);
    if (!appointment || appointment.status === status) return;
    if (status === 'cancelled' && !window.confirm(`Close the appointment request from ${appointment.client_name}? This records the decision in the CMS; it does not notify the client.`)) return;
    setUpdatingId(id);
    setDecisionError(null);
    try {
      const saved = await updateAppointmentStatus(id, status);
      if (!saved) setDecisionError({ id, message: 'The appointment decision was not saved. Refresh the booking list and try again.' });
    } catch {
      setDecisionError({ id, message: 'The appointment decision was not saved. Check the CMS connection and try again.' });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-6 pb-10">
      {/* 1. Header (Matching /admin/messages) */}
      <header className="flex flex-col gap-5 rounded-3xl border border-[#E2ECE6] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 shadow-xs">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#168A4A]">
            Practice inbox
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#073E43] sm:text-3xl">
            Consultation requests
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66797A]">
            Meeting appointments requested through the online booking system. Respond to clients and confirm schedule slots.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/book-appointment"
            target="_blank"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-[#D8E4DE] px-4 text-xs font-semibold text-[#143F40] hover:bg-[#F5FAF7] transition-colors"
          >
            <span>Public Booking Form</span>
            <ExternalLink className="size-3.5 text-[#168A4A]" />
          </Link>
        </div>
      </header>

      {/* 2. Filter Stats Strip (Matching /admin/messages) */}
      <section aria-label="Appointment totals" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setStatusFilter(filter.key)}
            aria-pressed={statusFilter === filter.key}
            className={`rounded-2xl border p-4 text-left transition cursor-pointer ${
              statusFilter === filter.key
                ? 'border-[#A9D7B9] bg-[#F1FAF4]'
                : 'border-[#E2ECE6] bg-white hover:border-[#C6D9CE]'
            }`}
          >
            <span className="block text-[10px] font-bold uppercase tracking-[.11em] text-[#718181]">
              {filter.label}
            </span>
            <span className="mt-1 block text-2xl font-bold tabular-nums text-[#073E43]">
              {filter.count}
            </span>
          </button>
        ))}
      </section>

      {/* 3. Main Card Container (Matching /admin/messages) */}
      <section className="overflow-hidden rounded-2xl border border-[#E2ECE6] bg-white shadow-xs">
        <div className="flex flex-col gap-3 border-b border-[#EDF2EF] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[#EAF8F1] text-[#14864B]">
              <CalendarDays className="size-5" />
            </span>
            <div>
              <h2 className="font-bold text-[#123F40]">Appointment Bookings</h2>
              <p className="text-xs text-[#718181]">
                {filtered.length} shown · {appointments.length} total
              </p>
            </div>
          </div>

          <label className="flex h-10 w-full items-center gap-2 rounded-xl border border-[#D5E0DC] px-3 text-sm focus-within:border-[#168A4A] sm:max-w-sm">
            <Search className="size-4 shrink-0 text-[#82918D]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search client, email, company, or service"
              aria-label="Search appointments"
              className="min-w-0 flex-1 bg-transparent text-xs text-[#143F40] outline-none placeholder:text-[#91A19C]"
            />
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <CalendarDays className="mx-auto size-8 text-[#98B8A6]" />
            <h3 className="text-sm font-bold text-[#123F40]">
              {appointments.length ? 'No matching consultation requests' : 'No appointments yet'}
            </h3>
            <p className="mx-auto max-w-md text-xs leading-5 text-[#718181]">
              {appointments.length
                ? 'Try another search query or select a different filter status.'
                : 'When clients submit meeting requests via the booking form, they will appear here.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#EDF2EF]">
            {filtered.map((item) => (
              <li
                key={item.id}
                className="grid gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_280px] sm:p-6 hover:bg-[#FAFCFB] transition-colors"
              >
                <div className="min-w-0">
                  {/* Top user row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="grid size-9 place-items-center rounded-full bg-[#EAF8F1] text-[#168A4A]">
                      <UserRound className="size-4" />
                    </span>
                    <h3 className="font-bold text-[#123F40] text-sm">{item.client_name}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        item.status === 'pending'
                          ? 'bg-[#FFF5DE] text-[#98610D]'
                          : item.status === 'confirmed'
                          ? 'bg-[#EAF3FF] text-[#2869A8]'
                          : item.status === 'rescheduled'
                          ? 'bg-[#F3ECFF] text-[#6938B8]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.status === 'pending'
                        ? 'Pending response'
                        : item.status === 'confirmed'
                        ? 'Confirmed'
                        : item.status === 'rescheduled'
                        ? 'Rescheduled'
                        : 'Cancelled'}
                    </span>
                    <time className="text-xs text-[#82918D]">
                      Requested: {dateLabel(item.created_at)}
                    </time>
                  </div>

                  {/* Contact & Meeting specifics row */}
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#52706C]">
                    <a
                      className="inline-flex items-center gap-1.5 hover:text-[#168A4A]"
                      href={`mailto:${item.client_email}`}
                    >
                      <Mail className="size-3.5" />
                      {item.client_email}
                    </a>
                    {item.client_phone && (
                      <a
                        className="inline-flex items-center gap-1.5 hover:text-[#168A4A]"
                        href={`tel:${item.client_phone}`}
                      >
                        <Phone className="size-3.5" />
                        {item.client_phone}
                      </a>
                    )}
                    {item.company_name && (
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 className="size-3.5" />
                        {item.company_name}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#023A51]">
                      <Briefcase className="size-3.5 text-emerald-600" />
                      {item.service_title}
                    </span>
                  </div>

                  {/* Meeting Slot Box */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs bg-[#F0FAF4] border border-[#D0ECD9] rounded-xl px-3.5 py-2 text-[#0D4B2D]">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Calendar className="size-3.5" />
                      Scheduled: {item.date ? dateLabel(item.date) : 'Pending date'}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1.5 font-bold">
                      <Clock className="size-3.5" />
                      {item.time_slot || 'Pending slot'}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] font-medium">
                      Mode: {item.consultation_type || 'Office Meeting'}
                    </span>
                  </div>

                  {/* Client requirement notes */}
                  {item.notes && (
                    <p className="mt-3 whitespace-pre-wrap rounded-xl bg-[#F7FAF8] p-3.5 text-xs leading-relaxed text-[#405A5B]">
                      {item.notes}
                    </p>
                  )}
                </div>

                <aside className="rounded-2xl border border-[#D7E5EE] bg-[#F5FAFD] p-4 sm:self-start">
                  <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#637B8A]">Booking decision</p>
                  <p className="mt-1 text-sm font-bold text-[#123F40]">Requested slot</p>
                  <p className="mt-1 text-xs font-semibold text-[#2869A8]">{item.date ? dateLabel(item.date) : 'Date not provided'} · {item.time_slot || 'Time not provided'}</p>
                  <p className="mt-2 text-[11px] leading-5 text-[#718181]">Confirm only after checking the requested time with your calendar. A different time still needs to be arranged with the client.</p>
                  <div className="mt-3 grid gap-2">
                    {item.status === 'confirmed' ? <span className="rounded-xl border border-[#BFE5CB] bg-white px-3 py-2 text-center text-[11px] font-semibold text-[#176C43]">Confirmed · current decision</span> : <button type="button" disabled={updatingId === item.id} onClick={() => void handleStatusChange(item.id, 'confirmed')} className="min-h-9 rounded-xl bg-[#0B4B4C] px-3 text-xs font-semibold text-white hover:bg-[#083D3F] disabled:opacity-50">Confirm requested slot</button>}
                    {item.status === 'rescheduled' ? <span className="rounded-xl border border-[#D8C8F3] bg-white px-3 py-2 text-center text-[11px] font-semibold text-[#6938B8]">Needs a new time · current</span> : <button type="button" disabled={updatingId === item.id} onClick={() => void handleStatusChange(item.id, 'rescheduled')} className="min-h-9 rounded-xl border border-[#D8C8F3] bg-white px-3 text-xs font-semibold text-[#6938B8] hover:bg-[#F7F2FF] disabled:opacity-50">Needs a different time</button>}
                    {item.status === 'cancelled' ? <button type="button" disabled={updatingId === item.id} onClick={() => void handleStatusChange(item.id, 'pending')} className="min-h-9 rounded-xl border border-[#D5E0DC] bg-white px-3 text-xs font-semibold text-[#365555] disabled:opacity-50">Reopen request</button> : <button type="button" disabled={updatingId === item.id} onClick={() => void handleStatusChange(item.id, 'cancelled')} className="min-h-9 rounded-xl border border-[#E7C7C7] bg-white px-3 text-xs font-semibold text-[#9D3D3D] hover:bg-rose-50 disabled:opacity-50">Close request…</button>}
                  </div>
                  {updatingId === item.id && <span role="status" className="mt-2 block text-[11px] text-[#82918D]">Saving booking decision…</span>}
                  {decisionError?.id === item.id && <span role="alert" className="mt-2 block text-[11px] leading-4 text-rose-700">{decisionError.message}</span>}
                </aside>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
