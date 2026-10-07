'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

export default function ContactPage() {
  const { settings } = useApp();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSending(true);
    setError('');
    const values = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Message could not be sent. Please try again.');
      setSent(true);
      form.reset();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Message could not be sent. Please try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-[70vh] bg-[#FAFCFD] pb-20">
      <section className="bg-hero-gradient px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#16844A]">Get in touch</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#023A51] sm:text-5xl">Contact our practice<span className="text-[#2CBC63]">.</span></h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#4A5259]">Send a question about our practice or services. For a meeting request, use the dedicated consultation booking form.</p>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-3xl border border-[#E3ECE7] bg-white p-6 shadow-sm sm:p-9" aria-labelledby="contact-form-title">
          <h2 id="contact-form-title" className="text-2xl font-bold text-[#023A51]">Send a message</h2>
          <p className="mt-2 text-sm leading-6 text-[#59667D]">Fields marked required help us route your enquiry to the right person.</p>
          {sent && <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">Your message was sent. We will get back to you shortly.</p>}
          {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
          <form onSubmit={submit} className="mt-7 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-[#244647]">Full name *<input required name="name" maxLength={120} autoComplete="name" className="mt-2 h-11 w-full rounded-xl border border-[#D5E0DC] px-3 font-normal outline-none focus:border-[#2CBC63] focus:ring-2 focus:ring-[#2CBC63]/20" /></label>
              <label className="text-sm font-semibold text-[#244647]">Email address *<input required type="email" name="email" maxLength={254} autoComplete="email" className="mt-2 h-11 w-full rounded-xl border border-[#D5E0DC] px-3 font-normal outline-none focus:border-[#2CBC63] focus:ring-2 focus:ring-[#2CBC63]/20" /></label>
              <label className="text-sm font-semibold text-[#244647]">Phone number<input name="phone" maxLength={40} autoComplete="tel" className="mt-2 h-11 w-full rounded-xl border border-[#D5E0DC] px-3 font-normal outline-none focus:border-[#2CBC63] focus:ring-2 focus:ring-[#2CBC63]/20" /></label>
              <label className="text-sm font-semibold text-[#244647]">Organisation<input name="organization" maxLength={160} autoComplete="organization" className="mt-2 h-11 w-full rounded-xl border border-[#D5E0DC] px-3 font-normal outline-none focus:border-[#2CBC63] focus:ring-2 focus:ring-[#2CBC63]/20" /></label>
            </div>
            <label className="block text-sm font-semibold text-[#244647]">How can we help? *<textarea required name="message" maxLength={3000} rows={6} className="mt-2 w-full rounded-xl border border-[#D5E0DC] p-3 font-normal leading-6 outline-none focus:border-[#2CBC63] focus:ring-2 focus:ring-[#2CBC63]/20" /></label>
            <label className="flex items-start gap-3 text-sm leading-6 text-[#59667D]"><input required type="checkbox" name="privacy_consent" className="mt-1 size-4 accent-[#14864B]" /><span>I agree that the practice may use these details to respond to my enquiry. Read the <Link href="/privacy" className="font-semibold text-[#023A51] underline">Privacy Policy</Link>.</span></label>
            <button disabled={sending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#023A51] px-6 text-sm font-bold text-white transition-colors hover:bg-[#14864B] disabled:cursor-wait disabled:opacity-60"><Send className="size-4" />{sending ? 'Sending…' : 'Send message'}</button>
          </form>
        </section>
        <aside className="space-y-5">
          <div className="rounded-3xl border border-[#E3ECE7] bg-white p-6">
            <h2 className="text-lg font-bold text-[#023A51]">Practice details</h2>
            <dl className="mt-5 space-y-4 text-sm text-[#4A5259]">
              <div className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-[#14864B]" /><dd>{settings.address}</dd></div>
              <div className="flex gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-[#14864B]" /><dd><a href={`tel:${settings.phone}`} className="underline underline-offset-4">{settings.phone}</a></dd></div>
              <div className="flex gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-[#14864B]" /><dd><a href={`mailto:${settings.email}`} className="underline underline-offset-4">{settings.email}</a></dd></div>
            </dl>
          </div>
          <div className="rounded-3xl bg-[#073F43] p-6 text-white">
            <h2 className="text-lg font-bold">Need a meeting?</h2>
            <p className="mt-2 text-sm leading-6 text-white/80">Choose your preferred date and time on the consultation booking page.</p>
            <Link href="/book-appointment" className="mt-5 inline-flex min-h-10 items-center rounded-full bg-[#2CBC63] px-5 text-sm font-bold text-white hover:bg-[#25A456]">Book a consultation</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
