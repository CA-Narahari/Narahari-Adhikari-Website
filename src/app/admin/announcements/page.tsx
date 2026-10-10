'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileImage,
  Globe,
  LoaderCircle,
  MapPin,
  Megaphone,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
  Home,
  FileText,
  Calendar,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import MediaLibraryModal from '@/components/admin/MediaLibraryModal';
import type { Announcement } from '@/types';

type FormState = Omit<Announcement, 'id' | 'created_at'>;

const emptyForm = (): FormState => ({
  title: '',
  message: '',
  link_url: null,
  poster_url: null,
  is_active: true,
  display_location: 'all_pages',
  target_path: null,
  expires_at: null,
});

const QUICK_PAGE_SUGGESTIONS = [
  '/',
  '/contact',
  '/services',
  '/blog',
  '/updates',
  '/careers',
  '/resources/downloads',
  '/book-appointment',
];

export default function AdminAnnouncementsPage() {
  const { announcements, announcementsLoaded, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useApp();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [posterName, setPosterName] = useState('');
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm());
    setPosterName('');
    setFeedback(null);
    setIsEditorOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEdit = (item: Announcement) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      message: item.message || '',
      link_url: item.link_url || null,
      poster_url: item.poster_url || null,
      is_active: item.is_active,
      display_location: item.display_location || 'all_pages',
      target_path: item.target_path || null,
      expires_at: item.expires_at || null,
    });
    setPosterName(item.poster_url?.split('/').pop() || '');
    setFeedback(null);
    setIsEditorOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeEditor = () => {
    if (saving) return;
    setIsEditorOpen(false);
    setEditingId(null);
    setForm(emptyForm());
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setFeedback({ kind: 'error', message: 'Please enter an announcement title.' });
      return;
    }
    if (form.display_location === 'specific_page' && !form.target_path?.trim()) {
      setFeedback({ kind: 'error', message: 'Please specify the target page (e.g. /contact or /services).' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    let cleanTargetPath: string | null = null;
    if (form.display_location === 'specific_page') {
      const raw = (form.target_path || '').trim();
      cleanTargetPath = raw.startsWith('/') ? raw : `/${raw}`;
    }

    const payload: FormState = {
      ...form,
      title: form.title.trim(),
      message: form.message.trim(),
      link_url: form.link_url?.trim() || null,
      poster_url: form.poster_url?.trim() || null,
      display_location: form.display_location,
      target_path: cleanTargetPath,
      expires_at: form.expires_at || null,
    };

    const ok = editingId
      ? await updateAnnouncement(editingId, payload)
      : await addAnnouncement(payload);
    setSaving(false);

    if (!ok) {
      setFeedback({ kind: 'error', message: 'The notice could not be saved. Check connection and try again.' });
      return;
    }

    setFeedback({ kind: 'success', message: editingId ? 'Notice updated successfully.' : 'New announcement published.' });
    setIsEditorOpen(false);
    setEditingId(null);
    setForm(emptyForm());
    setPosterName('');
  };

  const remove = async (item: Announcement) => {
    if (!window.confirm(`Delete announcement "${item.title}"?`)) return;
    const ok = await deleteAnnouncement(item.id);
    setFeedback(
      ok
        ? { kind: 'success', message: 'Announcement removed.' }
        : { kind: 'error', message: 'Could not delete announcement.' }
    );
    if (editingId === item.id) closeEditor();
  };

  const getLocationLabel = (item: Announcement) => {
    if (item.display_location === 'home_page') return 'Home page only';
    if (item.display_location === 'specific_page') return item.target_path || 'Specific page';
    return 'Entire website';
  };

  const inputClass =
    'mt-1 h-9 w-full rounded-xl border border-[#D6E3DD] bg-white px-3 text-xs text-[#143F40] outline-none transition focus:border-[#168A4A] focus:ring-2 focus:ring-[#168A4A]/10';
  const labelClass = 'block text-[11px] font-semibold text-[#365555]';

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-20">
      <MediaLibraryModal
        isOpen={libraryOpen}
        mode="featured"
        storageFolder="announcements"
        fileType="image"
        initialImageName={posterName}
        onClose={() => setLibraryOpen(false)}
        onSelect={(file) => {
          setField('poster_url', file.url);
          setPosterName(file.imageName || file.url.split('/').pop() || 'Selected image');
          setLibraryOpen(false);
        }}
      />

      {/* Header */}
      <header className="flex flex-col gap-4 rounded-2xl border border-[#E2ECE6] bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#14864B]">
            <Megaphone className="size-3.5" />
            <span>COMMUNICATIONS / NOTICES</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#023A51] mt-1">
            Site Announcements &amp; Posters
          </h1>
          <p className="text-xs text-[#59667D] mt-0.5">
            Display urgent notifications, statutory deadlines, or popups across specific pages or the whole website.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D8E4DE] px-3.5 py-2 text-xs font-semibold text-[#023A51] hover:bg-[#F5FAF7] transition-colors"
          >
            <Eye className="size-3.5 text-[#2CBC63]" />
            <span>View Site</span>
          </Link>

          {!isEditorOpen && (
            <button
              type="button"
              onClick={openNew}
              className="inline-flex items-center gap-2 rounded-xl bg-[#023A51] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#14864B] transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Create Announcement</span>
            </button>
          )}
        </div>
      </header>

      {/* Feedback Toast */}
      {feedback && (
        <div
          role="status"
          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-xs ${
            feedback.kind === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-800'
              : 'border-emerald-200 bg-emerald-50 text-emerald-900'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDITOR MODE: FORM ON LEFT + INSTANT LIVE PREVIEW ON RIGHT */}
      {/* ========================================================= */}
      {isEditorOpen ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Form (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <form onSubmit={save} className="rounded-2xl border border-[#E2ECE6] bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#EDF2EF] pb-3">
                <div>
                  <h2 className="text-sm font-bold text-[#023A51]">
                    {editingId ? 'Edit Announcement' : 'New Announcement'}
                  </h2>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Configure notice title, message, poster image, and display targeting.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeEditor}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 text-xs"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Title */}
              <div>
                <label className={labelClass}>
                  Announcement Title <span className="text-rose-600">*</span>
                </label>
                <input
                  required
                  maxLength={140}
                  value={form.title}
                  onChange={(e) => setField('title', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Income Tax Return Filing Deadline Extension for FY 2081/82"
                />
              </div>

              {/* Message */}
              <div>
                <label className={labelClass}>
                  Description / Message <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={600}
                  value={form.message}
                  onChange={(e) => setField('message', e.target.value)}
                  placeholder="Details regarding the notice, statutory circular number, or advisory instructions."
                  className="mt-1 w-full rounded-xl border border-[#D6E3DD] p-3 text-xs text-[#143F40] outline-none focus:border-[#168A4A] leading-relaxed"
                />
              </div>

              {/* Poster Image */}
              <div>
                <label className={labelClass}>Custom Poster Image</label>
                {form.poster_url ? (
                  <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-[#D6E3DD] bg-[#F8FAFC] p-3">
                    <div className="relative size-14 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-black/5">
                      <Image
                        src={form.poster_url}
                        alt="Poster preview"
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-[#143F40]">
                        {posterName || 'Poster attached'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setLibraryOpen(true)}
                          className="text-[11px] font-semibold text-[#168A4A] hover:underline cursor-pointer"
                        >
                          Change image
                        </button>
                        <span className="text-slate-300">•</span>
                        <button
                          type="button"
                          onClick={() => {
                            setField('poster_url', null);
                            setPosterName('');
                          }}
                          className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                        >
                          Remove image
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setLibraryOpen(true)}
                    className="mt-1.5 grid min-h-24 w-full place-items-center rounded-xl border-2 border-dashed border-[#C7DCD0] bg-[#F8FBF9] text-center transition hover:border-[#168A4A] hover:bg-[#F0FAF4] cursor-pointer"
                  >
                    <div className="py-2">
                      <FileImage className="mx-auto size-5 text-[#168A4A]" />
                      <span className="mt-1 block text-xs font-semibold text-[#365555]">
                        Upload or select poster banner image
                      </span>
                      <span className="mt-0.5 block text-[10px] text-[#82918D]">
                        Leave empty to use clean text-only official notice template
                      </span>
                    </div>
                  </button>
                )}
              </div>

              {/* WHERE TO DISPLAY (PAGE TARGETING) */}
              <fieldset className="rounded-xl border border-[#E3ECE7] bg-[#FAFCFB] p-4 space-y-3">
                <legend className="text-[11px] font-bold uppercase tracking-wider text-[#365555]">
                  Where to display announcement
                </legend>
                <div className="grid gap-2 sm:grid-cols-3">
                  {/* Option 1: Entire website */}
                  <label
                    className={`flex cursor-pointer items-start gap-2 rounded-lg border p-2.5 text-xs ${
                      form.display_location === 'all_pages'
                        ? 'border-[#2CBC63] bg-[#EAF7F0] text-[#14864B]'
                        : 'border-[#E3ECE7] bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="display-scope"
                      checked={form.display_location === 'all_pages'}
                      onChange={() => {
                        setField('display_location', 'all_pages');
                        setField('target_path', null);
                      }}
                      className="mt-0.5 accent-[#168A4A]"
                    />
                    <div>
                      <strong className="block text-[11px] font-bold">All Pages</strong>
                      <span className="text-[10px] text-slate-500">Every public page</span>
                    </div>
                  </label>

                  {/* Option 2: Home page only */}
                  <label
                    className={`flex cursor-pointer items-start gap-2 rounded-lg border p-2.5 text-xs ${
                      form.display_location === 'home_page'
                        ? 'border-[#2CBC63] bg-[#EAF7F0] text-[#14864B]'
                        : 'border-[#E3ECE7] bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="display-scope"
                      checked={form.display_location === 'home_page'}
                      onChange={() => {
                        setField('display_location', 'home_page');
                        setField('target_path', '/');
                      }}
                      className="mt-0.5 accent-[#168A4A]"
                    />
                    <div>
                      <strong className="block text-[11px] font-bold">Only Home Page</strong>
                      <span className="text-[10px] text-slate-500">Only on &quot;/&quot;</span>
                    </div>
                  </label>

                  {/* Option 3: Specific page */}
                  <label
                    className={`flex cursor-pointer items-start gap-2 rounded-lg border p-2.5 text-xs ${
                      form.display_location === 'specific_page'
                        ? 'border-[#2CBC63] bg-[#EAF7F0] text-[#14864B]'
                        : 'border-[#E3ECE7] bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="display-scope"
                      checked={form.display_location === 'specific_page'}
                      onChange={() => {
                        setField('display_location', 'specific_page');
                        if (!form.target_path) setField('target_path', '/contact');
                      }}
                      className="mt-0.5 accent-[#168A4A]"
                    />
                    <div>
                      <strong className="block text-[11px] font-bold">Specific Page</strong>
                      <span className="text-[10px] text-slate-500">Type /page_name</span>
                    </div>
                  </label>
                </div>

                {/* Specific page text input */}
                {form.display_location === 'specific_page' && (
                  <div className="pt-2 border-t border-slate-200/60 space-y-2">
                    <label className={labelClass}>
                      Enter target page path (e.g. <span className="font-mono text-emerald-700">/contact</span> or <span className="font-mono text-emerald-700">/services</span>):
                    </label>
                    <input
                      type="text"
                      required
                      value={form.target_path || ''}
                      onChange={(e) => setField('target_path', e.target.value)}
                      placeholder="/contact or /services/taxation"
                      className="h-9 w-full rounded-xl border border-[#D6E3DD] px-3 font-mono text-xs text-[#143F40] outline-none focus:border-[#168A4A]"
                    />
                    {/* Quick helper pills */}
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] text-slate-500">Quick suggestions:</span>
                      {QUICK_PAGE_SUGGESTIONS.map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => setField('target_path', sug)}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[10px] transition-colors cursor-pointer"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </fieldset>

              {/* Visibility and Expiry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Visibility Status</label>
                  <div className="mt-1.5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setField('is_active', true)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        form.is_active
                          ? 'border-[#2CBC63] bg-[#EAF7F0] text-[#14864B]'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      Visible on Site
                    </button>
                    <button
                      type="button"
                      onClick={() => setField('is_active', false)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        !form.is_active
                          ? 'border-slate-400 bg-slate-100 text-slate-800'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      Save as Draft
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Auto-Expire Date (optional)</label>
                  <input
                    type="date"
                    value={form.expires_at || ''}
                    onChange={(e) => setField('expires_at', e.target.value || null)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EDF2EF]">
                <button
                  type="button"
                  onClick={closeEditor}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#023A51] hover:bg-[#14864B] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {saving ? <LoaderCircle className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                  <span>{saving ? 'Saving...' : editingId ? 'Update Notice' : 'Publish Announcement'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: INSTANT LIVE PREVIEW (5 cols, sticky) */}
          <div className="lg:col-span-5 sticky top-20 space-y-3">
            <div className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#EDF2EF] pb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#023A51]">
                  <Eye className="size-3.5 text-[#2CBC63]" />
                  <span>INSTANT LIVE PREVIEW</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  form.is_active ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {form.is_active ? 'Active' : 'Draft'}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Real-time preview of the announcement popup dialog on public pages:
              </p>

              {/* Simulated Public Popup Modal */}
              <div className="rounded-2xl border border-[#DCE4EC] bg-white shadow-lg overflow-hidden">
                {/* Header Strip */}
                <div className="bg-[#023A51] px-4 py-2.5 flex items-center justify-between text-white">
                  <div className="flex items-center gap-1.5">
                    <Megaphone className="size-3 text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      Official Announcement
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-300">✕</span>
                </div>

                {/* Body: Poster vs Text */}
                {form.poster_url ? (
                  <div>
                    <div className="relative h-44 w-full bg-gradient-to-b from-[#0B2533] to-[#04141C] flex items-center justify-center p-2">
                      <Image
                        src={form.poster_url}
                        alt="Poster"
                        fill
                        unoptimized
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h3 className="text-sm font-bold text-[#023A51] leading-snug">
                        {form.title || 'Announcement Title'}
                      </h3>
                      {form.message && (
                        <p className="text-[11px] text-[#4A5259] leading-relaxed line-clamp-2">
                          {form.message}
                        </p>
                      )}
                      <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-2.5 text-emerald-600" />
                          {getLocationLabel(form as Announcement)}
                        </span>
                        <span>Official Advisory</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 space-y-2.5">
                    <h3 className="text-sm font-bold text-[#023A51] leading-snug">
                      {form.title || 'Official Notice Title'}
                    </h3>
                    <p className="text-xs text-[#4A5259] leading-relaxed">
                      {form.message || 'Announcement message and instructions will appear here.'}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-2.5 text-emerald-600" />
                        {getLocationLabel(form as Announcement)}
                      </span>
                      <span>Text Notice</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* LIST OF ANNOUNCEMENTS */
        /* ========================================================= */
        <div className="rounded-2xl border border-[#E2ECE6] bg-white shadow-xs overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#EDF2EF] p-5">
            <div>
              <h2 className="text-sm font-bold text-[#023A51]">Published &amp; Draft Announcements</h2>
              <p className="text-xs text-[#718181]">{announcements.length} notices total</p>
            </div>
            <button
              type="button"
              onClick={openNew}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#023A51] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#14864B] transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>New Notice</span>
            </button>
          </div>

          {!announcementsLoaded ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading announcements...</div>
          ) : announcements.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Megaphone className="mx-auto size-7 text-slate-300" />
              <h3 className="text-sm font-bold text-[#023A51]">No announcements yet</h3>
              <p className="text-xs text-[#64748B]">Click &quot;New Notice&quot; to publish your first announcement or poster.</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#EDF2EF]">
              {announcements.map((item) => (
                <li key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAFCFB] transition-colors">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="size-10 rounded-xl bg-[#EAF8F1] text-[#14864B] flex items-center justify-center shrink-0 mt-0.5">
                      <Megaphone className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#023A51] truncate">{item.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          item.is_active ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.is_active ? 'Visible' : 'Draft'}
                        </span>
                      </div>
                      {item.message && (
                        <p className="text-xs text-[#59667D] line-clamp-1 mt-0.5">{item.message}</p>
                      )}
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {getLocationLabel(item)}
                        </span>
                        {item.expires_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            Expires: {item.expires_at}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#023A51] hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <Pencil className="size-3 inline mr-1" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(item)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete notice"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
