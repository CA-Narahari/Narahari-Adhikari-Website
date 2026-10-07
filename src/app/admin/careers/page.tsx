'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Briefcase,
  ToggleLeft,
  ToggleRight,
  Plus,
  Trash2,
  Users,
  Upload,
  FileText,
  ExternalLink,
  CheckCircle2,
  X,
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import MediaLibraryModal from '@/components/admin/MediaLibraryModal';
import type { Vacancy } from '@/types';

export default function AdminCareersPage() {
  const { settings, settingsLoaded, toggleCareers, vacancies, vacanciesLoaded, addVacancy, updateVacancy, deleteVacancy, applications } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDepartment, setNewDepartment] = useState('Assurance & Audit');
  const [newType, setNewType] = useState<'Full-time' | 'Part-time' | 'Contract' | 'Article Trainee'>('Full-time');
  const [newLocation, setNewLocation] = useState('Kathmandu Office (On-site)');
  const [newDesc, setNewDesc] = useState('');
  const [newReqs, setNewReqs] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
  const [vacancyFilter, setVacancyFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [isSavingVacancy, setIsSavingVacancy] = useState(false);
  const [portalBusy, setPortalBusy] = useState(false);
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);
  const editorRef = useRef<HTMLElement>(null);

  // Deletion confirm modal state
  const [vacancyToDelete, setVacancyToDelete] = useState<{ id: string; title: string } | null>(null);

  const openVacancyForm = (vacancy?: Vacancy) => {
    setFeedback(null);
    setEditingVacancy(vacancy || null);
    setNewTitle(vacancy?.title || '');
    setNewDepartment(vacancy?.department || 'Assurance & Audit');
    setNewType(vacancy?.employment_type || 'Full-time');
    setNewLocation(vacancy?.location || 'Kathmandu Office (On-site)');
    setNewDesc(vacancy?.description || '');
    setNewReqs((vacancy?.requirements || []).join('\n'));
    setNewDeadline(vacancy?.deadline || '');
    setNewAttachmentUrl(vacancy?.attachment_url || '');
    setShowAddModal(true);
    window.setTimeout(() => editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  const closeVacancyForm = () => {
    if (isSavingVacancy) return;
    setShowAddModal(false);
    setEditingVacancy(null);
  };

  const handleSaveVacancy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingVacancy(true);

    const payload = {
      title: newTitle.trim(),
      department: newDepartment.trim(),
      location: newLocation.trim(),
      employment_type: newType,
      description: newDesc.trim(),
      requirements: newReqs.split('\n').map((item) => item.trim()).filter(Boolean),
      deadline: newDeadline,
      is_active: editingVacancy?.is_active ?? true,
      attachment_url: newAttachmentUrl.trim() || null,
    };
    let saved = false;
    try {
      saved = editingVacancy
        ? await updateVacancy(editingVacancy.id, payload)
        : await addVacancy(payload);
    } catch { saved = false; }
    setIsSavingVacancy(false);
    if (!saved) {
      setFeedback({ kind: 'error', message: 'The vacancy could not be saved to the database. Check your CMS access and try again.' });
      return;
    }

    setShowAddModal(false);
    setFeedback({ kind: 'success', message: editingVacancy ? 'Vacancy details updated on the website.' : 'Vacancy published to the careers page.' });
    setEditingVacancy(null);
    setNewTitle('');
    setNewDesc('');
    setNewReqs('');
    setNewDeadline('');
    setNewAttachmentUrl('');
  };

  const confirmDelete = async () => {
    if (!vacancyToDelete) return;
    let deleted = false;
    try { deleted = await deleteVacancy(vacancyToDelete.id); } catch { deleted = false; }
    if (!deleted) {
      setFeedback({ kind: 'error', message: 'The vacancy could not be removed. Check your CMS access and try again.' });
      return;
    }
    setFeedback({ kind: 'success', message: 'Vacancy removed. Existing applications remain in the CV Vault.' });
    setVacancyToDelete(null);
  };

  const toggleVacancyActive = async (vacancy: Vacancy) => {
    let saved = false;
    try { saved = await updateVacancy(vacancy.id, { is_active: !vacancy.is_active }); } catch { saved = false; }
    setFeedback(saved
      ? { kind: 'success', message: vacancy.is_active ? 'Vacancy archived and hidden from the public careers page.' : 'Vacancy is live on the public careers page.' }
      : { kind: 'error', message: 'Vacancy status could not be updated. Try again.' });
  };

  const toggleHiringPortal = async () => {
    setPortalBusy(true);
    setFeedback(null);
    let saved = false;
    try { saved = await toggleCareers(); } catch { saved = false; }
    setPortalBusy(false);
    setFeedback(saved
      ? { kind: 'success', message: settings.careers_enabled ? 'Careers page is now closed to visitors.' : 'Careers page is now open to visitors.' }
      : { kind: 'error', message: 'Careers visibility could not be updated. Try again.' });
  };

  const visibleVacancies = vacancies.filter((vacancy) => vacancyFilter === 'all' || (vacancyFilter === 'active' ? vacancy.is_active : !vacancy.is_active));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Confirm Deletion Modal */}
      <ConfirmModal
        isOpen={!!vacancyToDelete}
        title="Delete Vacancy Listing"
        message={`Are you sure you want to delete "${vacancyToDelete?.title}"? Applications attached to this opening will remain saved in CV Vault.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={() => { void confirmDelete(); }}
        onCancel={() => setVacancyToDelete(null)}
      />

      {/* Header */}
      <header className="flex flex-col gap-5 rounded-3xl border border-[#E2ECE6] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#168A4A]">Recruitment workspace</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#073E43] sm:text-3xl">Careers &amp; vacancies</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66797A]">Create and update job postings stored in Supabase. Active vacancies appear on the public Careers page and accept applications there.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/applications"
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#D8E4DE] px-4 text-sm font-semibold text-[#143F40] transition hover:bg-[#F5FAF7]"
          >
            <Users className="w-4 h-4 text-slate-600" />
            <span>View CV Vault ({applications.length})</span>
          </Link>

          <button
            type="button"
            onClick={() => openVacancyForm()}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#0B4B4C] px-4 text-sm font-semibold text-white transition hover:bg-[#083D3F]"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Vacancy</span>
          </button>
        </div>
      </header>

      {feedback && <p role={feedback.kind === 'error' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm ${feedback.kind === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>{feedback.message}</p>}

      {/* MASTER HIRING SWITCH CARD */}
      <div className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-xs sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#123F40]">
                Public careers page
              </span>
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-extrabold uppercase ${
                  settings.careers_enabled
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-red-100 text-red-900 border border-red-300'
                }`}
              >
                {settings.careers_enabled ? 'Open' : 'Closed'}
              </span>
            </div>
            <p className="text-xs text-[#66797A] leading-relaxed max-w-2xl">
              {settings.careers_enabled
                ? 'Visitors can see active roles, upload their CV, and submit an application.'
                : 'The public navigation link is hidden and the careers page shows a closed notice.'}
            </p>
          </div>

          <button
            type="button"
            disabled={portalBusy || !settingsLoaded}
            onClick={() => { void toggleHiringPortal(); }}
            className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold shadow-sm transition disabled:cursor-wait disabled:opacity-60 ${
              settings.careers_enabled
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            {settings.careers_enabled ? (
              <>
                <ToggleRight className="w-5 h-5 text-emerald-200" />
                <span>{portalBusy ? 'Saving…' : 'Close careers page'}</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-5 h-5 text-slate-400" />
                <span>{portalBusy ? 'Saving…' : 'Open careers page'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Vacancy Listings Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E2ECE6] bg-white shadow-xs">
        <div className="flex flex-col gap-4 border-b border-[#EDF2EF] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div><h2 className="text-base font-bold text-[#123F40]">Vacancy listings <span className="text-[#168A4A]">{vacancies.length}</span></h2><p className="mt-1 text-xs text-[#718181]">Archived roles stay in the CMS and can be reopened at any time.</p></div>
          <div className="inline-flex w-fit items-center gap-1 rounded-xl bg-[#F3F7F4] p-1 text-xs">
            {(['all', 'active', 'archived'] as const).map((filter) => <button key={filter} type="button" onClick={() => setVacancyFilter(filter)} className={`rounded-lg px-3 py-2 font-semibold capitalize transition ${vacancyFilter === filter ? 'bg-white text-[#0B4B4C] shadow-xs' : 'text-[#718181] hover:text-[#143F40]'}`}>{filter}{filter === 'all' ? ` (${vacancies.length})` : filter === 'active' ? ` (${vacancies.filter((vacancy) => vacancy.is_active).length})` : ` (${vacancies.filter((vacancy) => !vacancy.is_active).length})`}</button>)}
          </div>
        </div>

        <div className="divide-y divide-[#EDF2EF]">
          {!vacanciesLoaded ? <div role="status" className="p-12 text-center text-sm text-[#718181]">Loading vacancies from the database…</div> : visibleVacancies.length === 0 ? <div className="p-12 text-center"><Briefcase className="mx-auto size-8 text-[#98B8A6]" /><h3 className="mt-3 font-semibold text-[#143F40]">{vacancies.length ? 'No vacancies in this view' : 'No vacancies added yet'}</h3><p className="mt-1 text-sm text-[#718181]">Add a role to publish it on the careers page.</p></div> : visibleVacancies.map((vac) => (
            <div key={vac.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between sm:p-6">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EFF6F1] text-[#315B45]">
                    {vac.department}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs font-mono text-slate-500">{vac.employment_type}</span>
                </div>
                <h3 className="text-base font-bold text-[#123F40]">{vac.title}</h3>
                <p className="text-xs leading-5 text-[#66797A] line-clamp-2">{vac.description}</p>
                <div className="text-[11px] text-[#82918D] pt-1 flex flex-wrap items-center gap-3">
                  <span>Location: {vac.location}</span>
                  <span>•</span>
                  <span>Deadline: {vac.deadline}</span>
                  {vac.attachment_url && (
                    <>
                      <span>•</span>
                      <a
                        href={vac.attachment_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#1A8F4B] hover:underline font-semibold inline-flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>JD Document (PDF)</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => { void toggleVacancyActive(vac); }}
                  className={`px-3 py-1.5 rounded text-xs font-semibold border cursor-pointer ${
                    vac.is_active
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {vac.is_active ? 'Active' : 'Archived'}
                </button>

                <button type="button" onClick={() => openVacancyForm(vac)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[#D8E4DE] px-3 text-xs font-semibold text-[#315253] hover:bg-[#F5FAF7]"><FileText className="size-3.5" />Edit</button>

                <button
                  type="button"
                  onClick={() => setVacancyToDelete({ id: vac.id, title: vac.title })}
                  className="p-2 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100 cursor-pointer transition-colors"
                  title="Delete Vacancy"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-page vacancy editor */}
      {showAddModal && (
        <section ref={editorRef} aria-labelledby="vacancy-dialog-title" className="scroll-mt-6 rounded-3xl border border-[#E2ECE6] bg-white p-5 shadow-xs sm:p-8 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-[#EDF2EF] pb-5"><div><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#168A4A]">Public careers page</p><h3 id="vacancy-dialog-title" className="mt-1 text-xl font-bold text-[#123F40]">{editingVacancy ? 'Edit vacancy' : 'Add a vacancy'}</h3><p className="mt-1 text-sm leading-6 text-[#718181]">Changes save to Supabase and appear publicly while the role is active.</p></div><button type="button" onClick={closeVacancyForm} aria-label="Close editor" className="grid size-9 shrink-0 place-items-center rounded-xl border border-[#D8E4DE] text-[#66797A] hover:bg-[#F5FAF7]"><X className="size-4" /></button></div>

            {feedback?.kind === 'error' && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">{feedback.message}</p>}

            <form onSubmit={(event) => { void handleSaveVacancy(event); }} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Tax Consultant"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#D6E3DD] px-3 py-2.5 text-sm text-[#143F40] outline-none focus:border-[#168A4A] focus:ring-4 focus:ring-[#168A4A]/10"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full rounded-xl border border-[#D6E3DD] px-3 py-2.5 text-sm text-[#143F40] outline-none focus:border-[#168A4A] focus:ring-4 focus:ring-[#168A4A]/10"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Employment Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as typeof newType)}
                    className="w-full rounded-xl border border-[#D6E3DD] px-3 py-2.5 text-sm text-[#143F40] outline-none focus:border-[#168A4A] focus:ring-4 focus:ring-[#168A4A]/10"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Article Trainee">Article Trainee</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full rounded-xl border border-[#D6E3DD] px-3 py-2.5 text-sm text-[#143F40] outline-none focus:border-[#168A4A] focus:ring-4 focus:ring-[#168A4A]/10"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Application deadline</label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full rounded-xl border border-[#D6E3DD] px-3 py-2.5 text-sm text-[#143F40] outline-none focus:border-[#168A4A] focus:ring-4 focus:ring-[#168A4A]/10"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Job Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summary of responsibilities and scope..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-xl border border-[#D6E3DD] px-3 py-2.5 text-sm text-[#143F40] outline-none focus:border-[#168A4A] focus:ring-4 focus:ring-[#168A4A]/10"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Candidate Requirements (1 per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Semi-qualified CA / ACCA&#10;2+ years experience in audit..."
                  value={newReqs}
                  onChange={(e) => setNewReqs(e.target.value)}
                  className="w-full rounded-xl border border-[#D6E3DD] px-3 py-2.5 text-sm text-[#143F40] outline-none focus:border-[#168A4A] focus:ring-4 focus:ring-[#168A4A]/10"
                />
              </div>

              {/* Vacancy JD Attachment Upload */}
              <div className="bg-[#F7FAF8] border border-[#E1EBE5] rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-slate-800">
                    JD Document / Attachment (PDF, DOC, or DOCX)
                  </label>
                  {newAttachmentUrl && (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Attached</span>
                    </span>
                  )}
                </div>

                <button type="button" disabled={isSavingVacancy} onClick={() => setMediaLibraryOpen(true)} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#B8D5C4] bg-white px-3 text-sm font-semibold text-[#168A4A] transition hover:border-[#168A4A] hover:bg-[#F7FBF8] disabled:opacity-60"><Upload className="size-4" />{newAttachmentUrl ? 'Replace document from Media Library' : 'Choose document from Media Library'}</button>
                {newAttachmentUrl && <div className="mt-3 flex items-center gap-3 rounded-lg bg-white p-3 text-xs text-[#365555]"><FileText className="size-4 shrink-0 text-[#168A4A]" /><span className="min-w-0 flex-1 truncate">{newAttachmentUrl}</span><button type="button" disabled={isSavingVacancy} onClick={() => setNewAttachmentUrl('')} className="font-semibold text-rose-700 hover:underline">Remove</button></div>}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={closeVacancyForm}
                  disabled={isSavingVacancy}
                  className="min-h-10 rounded-xl border border-[#D8E4DE] px-4 text-sm font-semibold text-[#365555] hover:bg-[#F5FAF7] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingVacancy}
                  className="min-h-10 rounded-xl bg-[#0B4B4C] px-5 text-sm font-semibold text-white transition hover:bg-[#083D3F] disabled:cursor-wait disabled:opacity-60"
                >
                  {isSavingVacancy ? 'Saving…' : editingVacancy ? 'Save vacancy' : 'Publish vacancy'}
                </button>
              </div>
            </form>
        </section>
      )}
      <MediaLibraryModal isOpen={mediaLibraryOpen} mode="featured" storageFolder="careers" fileType="document" initialImageName={newAttachmentUrl.split('/').pop() || ''} onClose={() => setMediaLibraryOpen(false)} onSelect={(file) => { setNewAttachmentUrl(file.url); setMediaLibraryOpen(false); }} />
    </div>
  );
}
