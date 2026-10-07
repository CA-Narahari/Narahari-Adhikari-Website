'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Building2, CheckCircle2, LoaderCircle, Mail, MapPin, Phone, Save } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { SiteSettings } from '@/types';

type EditableSettings = Pick<SiteSettings, 'company_name' | 'email' | 'phone' | 'whatsapp_number' | 'address'>;

const countryCodes = [
  ['Nepal', '+977'], ['India', '+91'], ['United States', '+1'], ['United Kingdom', '+44'],
  ['Australia', '+61'], ['United Arab Emirates', '+971'], ['Qatar', '+974'], ['Saudi Arabia', '+966'],
  ['Japan', '+81'], ['Singapore', '+65'], ['Malaysia', '+60'], ['Bangladesh', '+880'],
];

function splitPhone(value: string): { code: string; local: string } {
  const match = value.trim().match(/^(\+\d{1,4})\s*(.*)$/);
  return match ? { code: match[1], local: match[2] } : { code: '+977', local: value.trim() };
}

export default function AdminSettingsPage() {
  const { settings, settingsLoaded, updateSettings } = useApp();
  const [form, setForm] = useState<EditableSettings>({ company_name: '', email: '', phone: '', whatsapp_number: '', address: '' });
  const [phoneCode, setPhoneCode] = useState('+977');
  const [phoneLocal, setPhoneLocal] = useState('');
  const [whatsappCode, setWhatsappCode] = useState('+977');
  const [whatsappLocal, setWhatsappLocal] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);
  const hasEdited = useRef(false);

  useEffect(() => {
    if (!settingsLoaded || hasEdited.current) return;
    const phone = splitPhone(settings.phone || '');
    const whatsapp = splitPhone(settings.whatsapp_number || '');
    setForm({ company_name: settings.company_name || '', email: settings.email || '', phone: settings.phone || '', whatsapp_number: settings.whatsapp_number || '', address: settings.address || '' });
    setPhoneCode(phone.code); setPhoneLocal(phone.local);
    setWhatsappCode(whatsapp.code); setWhatsappLocal(whatsapp.local);
  }, [settings, settingsLoaded]);

  const setValue = (key: keyof EditableSettings, value: string) => {
    hasEdited.current = true;
    setFeedback(null);
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true); setFeedback(null);
    const payload: EditableSettings = {
      ...form,
      phone: `${phoneCode} ${phoneLocal.trim()}`.trim(),
      whatsapp_number: `${whatsappCode} ${whatsappLocal.trim()}`.trim(),
    };
    const saved = await updateSettings(payload);
    setSaving(false);
    if (!saved) { setFeedback({ kind: 'error', message: 'Details could not be saved. Check your CMS access and try again.' }); return; }
    hasEdited.current = false;
    setForm(payload);
    setFeedback({ kind: 'success', message: 'Practice details saved and updated across the website.' });
  };

  const inputClass = 'mt-2 h-11 w-full rounded-xl border border-[#D6E3DD] bg-white px-3.5 text-sm text-[#143F40] outline-none transition placeholder:text-[#91A19C] focus:border-[#168A4A] focus:ring-4 focus:ring-[#168A4A]/10 disabled:bg-[#F6F9F7]';

  return <div className="mx-auto max-w-5xl space-y-6 pb-10">
    <header className="rounded-3xl border border-[#E2ECE6] bg-white p-6 sm:p-8">
      <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#168A4A]"><Building2 className="size-4" /> Practice details</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#073E43] sm:text-3xl">Site settings</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66797A]">Update the firm name and public contact details shown throughout the website.</p>
    </header>

    {!settingsLoaded ? <div role="status" className="flex min-h-40 items-center justify-center gap-2 rounded-2xl border border-[#E2ECE6] bg-white text-sm text-[#66797A]"><LoaderCircle className="size-4 animate-spin text-[#168A4A]" />Loading saved details…</div> : <form onSubmit={save} className="space-y-5">
      <section className="rounded-2xl border border-[#E2ECE6] bg-white p-5 sm:p-7">
        <div className="mb-5 flex items-start gap-3 border-b border-[#EDF2EF] pb-4"><span className="grid size-10 place-items-center rounded-xl bg-[#EAF8F1] text-[#168A4A]"><Building2 className="size-5" /></span><div><h2 className="text-base font-bold text-[#123F40]">Firm identity</h2><p className="mt-1 text-xs text-[#718181]">The public firm name appears in the website footer and CMS dashboard.</p></div></div>
        <label className="block text-xs font-semibold text-[#365555]">Firm name *<input required maxLength={160} value={form.company_name} onChange={(event) => setValue('company_name', event.target.value)} disabled={saving} className={inputClass} /></label>
      </section>

      <section className="rounded-2xl border border-[#E2ECE6] bg-white p-5 sm:p-7">
        <div className="mb-5 flex items-start gap-3 border-b border-[#EDF2EF] pb-4"><span className="grid size-10 place-items-center rounded-xl bg-[#EAF3FF] text-[#2877D2]"><Phone className="size-5" /></span><div><h2 className="text-base font-bold text-[#123F40]">Public contact details</h2><p className="mt-1 text-xs text-[#718181]">These values power contact links and enquiry details on the public site.</p></div></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-[#365555]">Public email address *<input type="email" required maxLength={254} value={form.email} onChange={(event) => setValue('email', event.target.value)} disabled={saving} className={inputClass} /></label>
          <label className="block text-xs font-semibold text-[#365555]">Firm phone *<span className="mt-1.5 grid grid-cols-[minmax(100px,0.42fr)_1fr] gap-2"><input id="phone-country-code" list="country-codes" value={phoneCode} onChange={(event) => { setPhoneCode(event.target.value); setFeedback(null); }} className={inputClass} aria-label="Phone country code" placeholder="+977" /><input required type="tel" maxLength={40} value={phoneLocal} onChange={(event) => { setPhoneLocal(event.target.value); setFeedback(null); }} disabled={saving} className={inputClass} aria-label="Firm phone number" placeholder="1 4423890" /></span></label>
          <label className="block text-xs font-semibold text-[#365555]">WhatsApp number *<span className="mt-1.5 grid grid-cols-[minmax(100px,0.42fr)_1fr] gap-2"><input id="whatsapp-country-code" list="country-codes" value={whatsappCode} onChange={(event) => { setWhatsappCode(event.target.value); setFeedback(null); }} className={inputClass} aria-label="WhatsApp country code" placeholder="+977" /><input required type="tel" maxLength={40} value={whatsappLocal} onChange={(event) => { setWhatsappLocal(event.target.value); setFeedback(null); }} disabled={saving} className={inputClass} aria-label="WhatsApp number" placeholder="9851000000" /></span></label>
          <datalist id="country-codes">{countryCodes.map(([country, code]) => <option key={code} value={code}>{country}</option>)}</datalist>
          <label className="block text-xs font-semibold text-[#365555] sm:col-span-2">Office address *<textarea required maxLength={240} rows={3} value={form.address} onChange={(event) => setValue('address', event.target.value)} disabled={saving} className="mt-2 w-full rounded-xl border border-[#D6E3DD] bg-white px-3.5 py-3 text-sm leading-6 text-[#143F40] outline-none transition focus:border-[#168A4A] focus:ring-4 focus:ring-[#168A4A]/10 disabled:bg-[#F6F9F7]" /></label>
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-2xl border border-[#E2ECE6] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div aria-live="polite" className="min-h-5 text-sm">{feedback && <p className={feedback.kind === 'success' ? 'flex items-center gap-2 text-[#177449]' : 'text-rose-700'} role={feedback.kind === 'error' ? 'alert' : 'status'}>{feedback.kind === 'success' && <CheckCircle2 className="size-4" />}{feedback.message}</p>}</div><button type="submit" disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0B4B4C] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#083D3F] disabled:opacity-60">{saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4 text-[#65D99A]" />}{saving ? 'Saving…' : 'Save details'}</button></div>
    </form>}
  </div>;
}
