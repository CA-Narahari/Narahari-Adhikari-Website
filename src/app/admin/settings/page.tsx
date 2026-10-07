'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Building2, CheckCircle2, LoaderCircle, Phone, Save, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { SiteSettings } from '@/types';

type EditableSettings = Pick<SiteSettings,
  'company_name' | 'tagline' | 'ca_reg_number' | 'email' | 'phone' | 'whatsapp_number' | 'address' | 'office_hours_summary'
>;

const fields: { key: keyof EditableSettings; label: string; required?: boolean; type?: string; hint?: string }[] = [
  { key: 'company_name', label: 'Firm name', required: true },
  { key: 'ca_reg_number', label: 'ICAN registration number', hint: 'Shown in the CMS and firm information.' },
  { key: 'tagline', label: 'Firm tagline', hint: 'Used as the short firm description in the website footer.' },
  { key: 'email', label: 'Public email address', required: true, type: 'email' },
  { key: 'phone', label: 'Telephone number', required: true, type: 'tel' },
  { key: 'whatsapp_number', label: 'WhatsApp number', required: true, type: 'tel', hint: 'Include the country code, for example +977…' },
  { key: 'address', label: 'Office address', required: true },
  { key: 'office_hours_summary', label: 'Office hours', hint: 'Shown on the public contact page.' },
];

export default function AdminSettingsPage() {
  const { settings, settingsLoaded, updateSettings } = useApp();
  const [form, setForm] = useState<EditableSettings>(() => ({
    company_name: settings.company_name,
    tagline: settings.tagline,
    ca_reg_number: settings.ca_reg_number,
    email: settings.email,
    phone: settings.phone,
    whatsapp_number: settings.whatsapp_number,
    address: settings.address,
    office_hours_summary: settings.office_hours_summary,
  }));
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);
  const hasEdited = useRef(false);

  useEffect(() => {
    if (!settingsLoaded || hasEdited.current) return;
    setForm({
      company_name: settings.company_name,
      tagline: settings.tagline,
      ca_reg_number: settings.ca_reg_number,
      email: settings.email,
      phone: settings.phone,
      whatsapp_number: settings.whatsapp_number,
      address: settings.address,
      office_hours_summary: settings.office_hours_summary,
    });
  }, [settings, settingsLoaded]);

  const updateField = (key: keyof EditableSettings, value: string) => {
    hasEdited.current = true;
    setFeedback(null);
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    let saved = false;
    try { saved = await updateSettings(form); } catch { saved = false; }
    if (!saved) {
      setFeedback({ kind: 'error', message: 'Settings could not be saved. Check your CMS access and connection, then try again.' });
      setSaving(false);
      return;
    }
    hasEdited.current = false;
    setFeedback({ kind: 'success', message: 'Firm details saved to the database and updated across the website.' });
    setSaving(false);
  };

  const inputClass = 'mt-2 h-11 w-full rounded-xl border border-[#D6E3DD] bg-white px-3.5 text-sm text-[#143F40] outline-none transition placeholder:text-[#91A19C] focus:border-[#168A4A] focus:ring-4 focus:ring-[#168A4A]/10 disabled:cursor-wait disabled:bg-[#F6F9F7]';

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-10">
      <header className="flex flex-col gap-4 rounded-3xl border border-[#E2ECE6] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#168A4A]"><ShieldCheck className="size-4" /> Website configuration</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#073E43] sm:text-3xl">Firm details</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66797A]">Manage the contact and identity details shown on the public website. Saved values update the footer, contact page, and WhatsApp links.</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#EAF8F1] px-3 py-1.5 text-xs font-semibold text-[#177449]"><span className="size-2 rounded-full bg-[#2CBC63]" /> Supabase settings</span>
      </header>

      {!settingsLoaded ? (
        <div role="status" className="flex min-h-48 items-center justify-center gap-2 rounded-2xl border border-[#E2ECE6] bg-white text-sm text-[#66797A]"><LoaderCircle className="size-4 animate-spin text-[#168A4A]" /> Loading saved firm details…</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-5">
          <section className="rounded-2xl border border-[#E2ECE6] bg-white p-5 sm:p-7" aria-labelledby="identity-heading">
            <div className="mb-5 flex items-start gap-3 border-b border-[#EDF2EF] pb-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#EAF8F1] text-[#168A4A]"><Building2 className="size-5" /></span>
              <div><h2 id="identity-heading" className="text-base font-bold text-[#123F40]">Firm identity</h2><p className="mt-1 text-xs text-[#718181]">Basic details that identify your practice.</p></div>
            </div>
            <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
              {fields.slice(0, 3).map((field) => <label key={field.key} className="block text-xs font-semibold text-[#365555]">{field.label}{field.required ? ' *' : ''}<input className={inputClass} type={field.type || 'text'} required={field.required} maxLength={field.key === 'tagline' ? 180 : 160} value={form[field.key]} onChange={(event) => updateField(field.key, event.target.value)} disabled={saving} />{field.hint && <span className="mt-1.5 block text-[11px] font-normal text-[#82918D]">{field.hint}</span>}</label>)}
            </div>
          </section>

          <section className="rounded-2xl border border-[#E2ECE6] bg-white p-5 sm:p-7" aria-labelledby="contact-heading">
            <div className="mb-5 flex items-start gap-3 border-b border-[#EDF2EF] pb-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#EAF3FF] text-[#2877D2]"><Phone className="size-5" /></span>
              <div><h2 id="contact-heading" className="text-base font-bold text-[#123F40]">Public contact details</h2><p className="mt-1 text-xs text-[#718181]">Used for website enquiries, calls, and direct WhatsApp contact.</p></div>
            </div>
            <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
              {fields.slice(3, 7).map((field) => <label key={field.key} className="block text-xs font-semibold text-[#365555]">{field.label}{field.required ? ' *' : ''}<input className={inputClass} type={field.type || 'text'} required={field.required} maxLength={field.key === 'address' ? 240 : 254} value={form[field.key]} onChange={(event) => updateField(field.key, event.target.value)} disabled={saving} />{field.hint && <span className="mt-1.5 block text-[11px] font-normal text-[#82918D]">{field.hint}</span>}</label>)}
            </div>
            <label className="mt-4 block text-xs font-semibold text-[#365555]">Office hours<input className={inputClass} type="text" maxLength={180} value={form.office_hours_summary} onChange={(event) => updateField('office_hours_summary', event.target.value)} disabled={saving} placeholder="Sunday–Friday, 9:30 AM–5:30 PM" /><span className="mt-1.5 block text-[11px] font-normal text-[#82918D]">Displayed on the public contact page.</span></label>
          </section>

          <div className="flex flex-col gap-3 rounded-2xl border border-[#E2ECE6] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div aria-live="polite" className="min-h-5 text-sm">
              {feedback && <p className={`flex items-center gap-2 ${feedback.kind === 'success' ? 'text-[#177449]' : 'text-rose-700'}`} role={feedback.kind === 'error' ? 'alert' : 'status'}>{feedback.kind === 'success' ? <CheckCircle2 className="size-4 shrink-0" /> : null}{feedback.message}</p>}
            </div>
            <button type="submit" disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0B4B4C] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#083D3F] disabled:cursor-wait disabled:opacity-60">
              {saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4 text-[#65D99A]" />}{saving ? 'Saving…' : 'Save firm details'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
