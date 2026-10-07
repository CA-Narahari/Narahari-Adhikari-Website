'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, ExternalLink, Eye, LoaderCircle, Megaphone, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AdminAnnouncementsPage() {
  const { settings, settingsLoaded, updateSettings } = useApp();
  const [text, setText] = useState(settings.announcement_text);
  const [link, setLink] = useState(settings.announcement_link);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!settingsLoaded) return;
    setText(settings.announcement_text || '');
    setLink(settings.announcement_link || '');
  }, [settings.announcement_link, settings.announcement_text, settingsLoaded]);

  const saveContent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    let saved = false;
    try { saved = await updateSettings({ announcement_text: text.trim(), announcement_link: link.trim() }); } catch { saved = false; }
    setFeedback(saved
      ? { kind: 'success', message: 'Notice text and link saved to the database.' }
      : { kind: 'error', message: 'The notice could not be saved. Check your CMS access and connection, then try again.' });
    setSaving(false);
  };

  const toggleVisibility = async () => {
    const nextActive = !settings.announcement_active;
    if (nextActive && !text.trim()) {
      setFeedback({ kind: 'error', message: 'Add a notice message before turning the banner on.' });
      return;
    }
    setSaving(true);
    setFeedback(null);
    let saved = false;
    try {
      saved = await updateSettings({
        announcement_text: text.trim(),
        announcement_link: link.trim(),
        announcement_active: nextActive,
      });
    } catch { saved = false; }
    setFeedback(saved
      ? { kind: 'success', message: nextActive ? 'The announcement is now visible on the public website.' : 'The announcement banner is now hidden.' }
      : { kind: 'error', message: 'The banner status could not be changed. Try again.' });
    setSaving(false);
  };

  const active = settings.announcement_active;
  const inputClass = 'mt-2 h-11 w-full rounded-xl border border-[#D6E3DD] bg-white px-3.5 text-sm text-[#143F40] outline-none transition placeholder:text-[#91A19C] focus:border-[#168A4A] focus:ring-4 focus:ring-[#168A4A]/10 disabled:cursor-wait disabled:bg-[#F6F9F7]';

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-10">
      <header className="flex flex-col gap-5 rounded-3xl border border-[#E2ECE6] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#168A4A]"><Megaphone className="size-4" /> Public website content</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#073E43] sm:text-3xl">Announcement banner</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66797A]">Show a short notice at the top of public pages. Save the message first, then turn the banner on when it is ready.</p>
        </div>
        <Link href="/" target="_blank" rel="noreferrer" className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl border border-[#D8E4DE] px-4 text-sm font-semibold text-[#143F40] transition hover:bg-[#F5FAF7]">View website <ExternalLink className="size-4 text-[#168A4A]" /></Link>
      </header>

      {!settingsLoaded ? <div role="status" className="flex min-h-40 items-center justify-center gap-2 rounded-2xl border border-[#E2ECE6] bg-white text-sm text-[#66797A]"><LoaderCircle className="size-4 animate-spin text-[#168A4A]" /> Loading saved notice…</div> : <>
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <form onSubmit={saveContent} className="rounded-2xl border border-[#E2ECE6] bg-white p-5 sm:p-7">
            <div className="mb-5 flex items-start gap-3 border-b border-[#EDF2EF] pb-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#FFF5DE] text-[#B87508]"><Megaphone className="size-5" /></span>
              <div><h2 className="text-base font-bold text-[#123F40]">Notice content</h2><p className="mt-1 text-xs text-[#718181]">Keep the message brief so it fits on mobile screens.</p></div>
            </div>
            <label className="block text-xs font-semibold text-[#365555]">Banner message *<textarea required maxLength={240} rows={3} value={text} onChange={(event) => { setText(event.target.value); setFeedback(null); }} disabled={saving} placeholder="For example: The office will be closed on Friday…" className="mt-2 w-full rounded-xl border border-[#D6E3DD] bg-white px-3.5 py-3 text-sm leading-6 text-[#143F40] outline-none transition placeholder:text-[#91A19C] focus:border-[#168A4A] focus:ring-4 focus:ring-[#168A4A]/10 disabled:bg-[#F6F9F7]" /><span className="mt-1 block text-right text-[11px] font-normal text-[#82918D]">{text.length}/240</span></label>
            <label className="mt-4 block text-xs font-semibold text-[#365555]">Optional destination link<input type="text" maxLength={500} value={link} onChange={(event) => { setLink(event.target.value); setFeedback(null); }} disabled={saving} placeholder="/updates or https://example.com" className={inputClass} /><span className="mt-1.5 block text-[11px] font-normal text-[#82918D]">Use a path such as /updates for this website or a full https:// link.</span></label>
            <div className="mt-6 flex flex-col gap-3 border-t border-[#EDF2EF] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div aria-live="polite" className="min-h-5 text-sm">{feedback && <p role={feedback.kind === 'error' ? 'alert' : 'status'} className={`flex items-center gap-2 ${feedback.kind === 'success' ? 'text-[#177449]' : 'text-rose-700'}`}>{feedback.kind === 'success' ? <CheckCircle2 className="size-4 shrink-0" /> : <AlertCircle className="size-4 shrink-0" />}{feedback.message}</p>}</div>
              <button type="submit" disabled={saving || !text.trim()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0B4B4C] px-5 text-sm font-semibold text-white transition hover:bg-[#083D3F] disabled:cursor-wait disabled:opacity-60">{saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4 text-[#65D99A]" />}{saving ? 'Saving…' : 'Save notice'}</button>
            </div>
          </form>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-[#E2ECE6] bg-white p-5" aria-labelledby="visibility-heading">
              <div className="flex items-start justify-between gap-3">
                <div><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#728481]">Visibility</p><h2 id="visibility-heading" className="mt-1 text-base font-bold text-[#123F40]">{active ? 'Banner is live' : 'Banner is hidden'}</h2><p className="mt-1 text-xs leading-5 text-[#66797A]">{active ? 'Visitors can see this notice across public pages.' : 'Only CMS users can preview this notice.'}</p></div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${active ? 'bg-[#EAF8F1] text-[#177449]' : 'bg-slate-100 text-slate-600'}`}>{active ? 'LIVE' : 'OFF'}</span>
              </div>
              <button type="button" onClick={() => void toggleVisibility()} disabled={saving || (!active && !text.trim())} aria-pressed={active} className={`mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-50 ${active ? 'border border-[#DCE7E1] bg-white text-[#365555] hover:bg-[#F5FAF7]' : 'bg-[#168A4A] text-white hover:bg-[#117740]'}`}>
                {saving ? <LoaderCircle className="size-4 animate-spin" /> : active ? <ToggleRight className="size-5" /> : <ToggleLeft className="size-5" />}{active ? 'Turn banner off' : 'Turn banner on'}
              </button>
            </section>

            <section className="rounded-2xl border border-[#E2ECE6] bg-white p-5" aria-labelledby="preview-heading">
              <h2 id="preview-heading" className="flex items-center gap-2 text-sm font-bold text-[#123F40]"><Eye className="size-4 text-[#168A4A]" /> Preview</h2>
              <div className="mt-3 rounded-xl bg-[#073F43] px-4 py-3 text-sm leading-5 text-white"><p>{text.trim() || 'Your announcement message will appear here.'}</p>{link.trim() && <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#65D99A]">{link} <ExternalLink className="size-3" /></span>}</div>
              <p className="mt-2 text-[11px] leading-5 text-[#82918D]">Preview uses the current unsaved text. It will only appear publicly when the banner is turned on.</p>
            </section>
          </aside>
        </section>
      </>}
    </div>
  );
}
