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
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Eye,
  AlertCircle,
  LoaderCircle,
  Pencil,
  Sparkles,
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import MediaLibraryModal from '@/components/admin/MediaLibraryModal';
import type { Vacancy } from '@/types';

export default function AdminCareersPage() {
  const {
    settings,
    settingsLoaded,
    toggleCareers,
    vacancies,
    vacanciesLoaded,
    addVacancy,
    updateVacancy,
    deleteVacancy,
    applications,
  } = useApp();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
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
    setIsEditorOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeVacancyForm = () => {
    if (isSavingVacancy) return;
    setIsEditorOpen(false);
    setEditingVacancy(null);
  };

  const handleSaveVacancy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingVacancy(true);
    setFeedback(null);

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
    } catch {
      saved = false;
    }

    setIsSavingVacancy(false);
    if (!saved) {
      setFeedback({
        kind: 'error',
        message: 'The vacancy could not be saved to the database. Check your connection and try again.',
      });
      return;
    }

    setIsEditorOpen(false);
    setFeedback({
      kind: 'success',
      message: editingVacancy ? 'Vacancy details updated successfully.' : 'New position published to the careers page.',
    });
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
    try {
      deleted = await deleteVacancy(vacancyToDelete.id);
    } catch {
      deleted = false;
    }
    if (!deleted) {
      setFeedback({
        kind: 'error',
        message: 'The vacancy could not be removed. Check your CMS session and try again.',
      });
      return;
    }
    setFeedback({ kind: 'success', message: 'Vacancy removed. Submitted candidate applications remain preserved.' });
    setVacancyToDelete(null);
  };

  const toggleVacancyActive = async (vacancy: Vacancy) => {
    let saved = false;
    try {
      saved = await updateVacancy(vacancy.id, { is_active: !vacancy.is_active });
    } catch {
      saved = false;
    }
    setFeedback(
      saved
        ? {
            kind: 'success',
            message: vacancy.is_active
              ? `Position "${vacancy.title}" archived.`
              : `Position "${vacancy.title}" is now open and accepting applications.`,
          }
        : { kind: 'error', message: 'Vacancy status could not be updated. Try again.' }
    );
  };

  const toggleHiringPortal = async () => {
    setPortalBusy(true);
    setFeedback(null);
    let saved = false;
    try {
      saved = await toggleCareers();
    } catch {
      saved = false;
    }
    setPortalBusy(false);
    setFeedback(
      saved
        ? {
            kind: 'success',
            message: settings.careers_enabled
              ? 'Careers section is now paused on the website.'
              : 'Careers portal is now active and accessible to candidates.',
          }
        : { kind: 'error', message: 'Careers visibility could not be updated. Try again.' }
    );
  };

  const visibleVacancies = vacancies.filter(
    (vacancy) =>
      vacancyFilter === 'all' || (vacancyFilter === 'active' ? vacancy.is_active : !vacancy.is_active)
  );

  // ==========================================
  // DEDICATED FULL-PAGE EDITOR WORKSPACE
  // ==========================================
  if (isEditorOpen) {
    return (
      <div className="mx-auto max-w-[1400px] space-y-6 pb-20">
        <MediaLibraryModal
          isOpen={mediaLibraryOpen}
          mode="featured"
          storageFolder="careers"
          fileType="document"
          initialImageName={newAttachmentUrl.split('/').pop() || ''}
          onClose={() => setMediaLibraryOpen(false)}
          onSelect={(file) => {
            setNewAttachmentUrl(file.url);
            setMediaLibraryOpen(false);
          }}
        />

        {/* Top Control Bar */}
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E2ECE6] bg-white/95 px-6 py-4 backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={closeVacancyForm}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D8E4DE] px-3.5 py-2 text-xs font-bold text-[#143F40] hover:bg-[#F5FAF7] cursor-pointer"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Positions</span>
            </button>
            <div className="hidden sm:block h-5 w-px bg-slate-200" />
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#023A51]">
              <Briefcase className="size-4 text-[#2CBC63]" />
              {editingVacancy ? `Editing: ${editingVacancy.title}` : 'Create New Career Opening'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/careers"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-[#D8E4DE] px-3.5 py-2 text-xs font-bold text-[#023A51] hover:bg-[#F5FAF7]"
            >
              <Eye className="size-3.5 text-[#2CBC63]" />
              <span>Public Careers</span>
            </Link>

            <button
              type="button"
              onClick={closeVacancyForm}
              disabled={isSavingVacancy}
              className="rounded-xl border border-[#D8E4DE] px-4 py-2 text-xs font-bold text-[#64748B] hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="vacancy-editor-form"
              disabled={isSavingVacancy}
              className="inline-flex items-center gap-2 rounded-xl bg-[#023A51] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#14864B] transition-all disabled:opacity-60 cursor-pointer"
            >
              {isSavingVacancy ? <LoaderCircle className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
              <span>{isSavingVacancy ? 'Saving…' : editingVacancy ? 'Save Changes' : 'Publish Opening'}</span>
            </button>
          </div>
        </header>

        {feedback && (
          <div
            role={feedback.kind === 'error' ? 'alert' : 'status'}
            className={`rounded-2xl border p-4 text-sm font-medium flex items-center gap-2 ${
              feedback.kind === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-900'
            }`}
          >
            {feedback.kind === 'error' ? <AlertCircle className="size-5 shrink-0" /> : <CheckCircle2 className="size-5 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}

        <form id="vacancy-editor-form" onSubmit={handleSaveVacancy}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Canvas (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Job Title & Classification */}
              <div className="rounded-3xl border border-[#E2ECE6] bg-white p-6 sm:p-8 space-y-5 shadow-xs">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#023A51] mb-2">
                    Position Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Tax Consultant / Audit Senior"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-[#D6E3DD] px-4 text-base sm:text-lg font-bold text-[#023A51] placeholder:font-normal placeholder:text-slate-300 outline-none focus:border-[#2CBC63] focus:ring-2 focus:ring-[#2CBC63]/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#64748B] mb-1.5">Department</label>
                    <input
                      type="text"
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      placeholder="e.g. Assurance & Audit"
                      className="h-10 w-full rounded-xl border border-[#D6E3DD] bg-[#FAFCFB] px-3 text-xs text-[#023A51] outline-none focus:border-[#2CBC63]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#64748B] mb-1.5">Employment Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as typeof newType)}
                      className="h-10 w-full rounded-xl border border-[#D6E3DD] bg-white px-3 text-xs font-bold text-[#023A51] outline-none cursor-pointer"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Article Trainee">Article Trainee (ICAN)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#64748B] mb-1.5">Office Location</label>
                    <input
                      type="text"
                      required
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="Kathmandu Office (On-site)"
                      className="h-10 w-full rounded-xl border border-[#D6E3DD] bg-[#FAFCFB] px-3 text-xs text-[#023A51] outline-none focus:border-[#2CBC63]"
                    />
                  </div>
                </div>
              </div>

              {/* Scope & Description */}
              <div className="rounded-3xl border border-[#E2ECE6] bg-white p-6 sm:p-8 space-y-4 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-[#023A51]">Role Overview &amp; Primary Responsibilities</h3>
                  <p className="text-xs text-[#64748B]">
                    Detail what the candidate will be doing day-to-day, client engagements, and team coordination.
                  </p>
                </div>
                <textarea
                  rows={6}
                  required
                  placeholder="Outline responsibilities, audit engagements, reporting duties, and statutory compliance expectations…"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-2xl border border-[#D6E3DD] p-4 text-xs sm:text-sm leading-relaxed text-[#023A51] outline-none focus:border-[#2CBC63] focus:ring-2 focus:ring-[#2CBC63]/20"
                />
              </div>

              {/* Requirements & Qualifications */}
              <div className="rounded-3xl border border-[#E2ECE6] bg-white p-6 sm:p-8 space-y-4 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-[#023A51]">Candidate Qualifications (1 per line)</h3>
                  <p className="text-xs text-[#64748B]">
                    Each line becomes a verified bullet point on the public careers listing.
                  </p>
                </div>
                <textarea
                  rows={6}
                  placeholder="Semi-qualified CA / ACCA or Bachelor in Business Studies&#10;2+ years demonstrable experience in statutory audits&#10;Proficiency in Nepal Tax Laws and Tally/Busy&#10;Strong interpersonal and business communication skills"
                  value={newReqs}
                  onChange={(e) => setNewReqs(e.target.value)}
                  className="w-full rounded-2xl border border-[#D6E3DD] p-4 text-xs sm:text-sm leading-relaxed text-[#023A51] outline-none focus:border-[#2CBC63] focus:ring-2 focus:ring-[#2CBC63]/20"
                />
              </div>

              {/* JD Document / Attachment Upload */}
              <div className="rounded-3xl border border-[#E2ECE6] bg-white p-6 sm:p-8 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#023A51]">Official JD Document / Terms Circular</h3>
                  {newAttachmentUrl && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" />
                      <span>Document Attached</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#64748B]">
                  Optional PDF or DOC terms file for candidates to download.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isSavingVacancy}
                    onClick={() => setMediaLibraryOpen(true)}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#B8D5C4] bg-[#F7FBF8] px-4 text-xs sm:text-sm font-bold text-[#168A4A] transition hover:border-[#168A4A] hover:bg-[#EEF8F1] cursor-pointer"
                  >
                    <Upload className="size-4" />
                    <span>{newAttachmentUrl ? 'Replace Document via Media Library' : 'Choose Document from Media Library'}</span>
                  </button>
                  {newAttachmentUrl && (
                    <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-[#023A51]">
                      <FileText className="size-4 shrink-0 text-[#168A4A]" />
                      <span className="min-w-0 flex-1 truncate font-medium">{newAttachmentUrl}</span>
                      <button
                        type="button"
                        onClick={() => setNewAttachmentUrl('')}
                        className="font-bold text-rose-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Settings Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Live Preview Card */}
              <div className="rounded-3xl border border-[#E2ECE6] bg-white p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#023A51]">
                  <Eye className="size-4 text-[#2CBC63]" />
                  <span>Public Card Preview</span>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F7ED] text-[#14864B]">
                      {newDepartment || 'Assurance'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{newType}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#023A51] leading-snug">
                    {newTitle || 'Untitled Position'}
                  </h4>
                  <div className="space-y-1 text-xs text-[#64748B]">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3 text-[#2CBC63]" />
                      <span>{newLocation || 'Kathmandu Office'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3 text-[#2CBC63]" />
                      <span>Deadline: {newDeadline || 'Open'}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#F1F5F9]">
                    <span className="inline-block text-xs font-bold text-[#023A51] hover:underline">
                      Apply for position &rarr;
                    </span>
                  </div>
                </div>
              </div>

              {/* Deadline & Status Settings */}
              <div className="rounded-3xl border border-[#E2ECE6] bg-white p-6 shadow-xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#023A51]">
                  Application Window
                </h4>

                <div>
                  <label className="block text-xs font-bold text-[#64748B] mb-1.5">
                    Application Deadline <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="h-10 w-full rounded-xl border border-[#D6E3DD] bg-white px-3 text-xs text-[#023A51] outline-none"
                  />
                  <p className="mt-1 text-[11px] text-[#94A3B8]">
                    After this date, the position is automatically tagged as closed on public listings.
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F1F5F9]">
                  <label className="flex items-center gap-2.5 text-xs font-bold text-[#023A51] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingVacancy?.is_active ?? true}
                      onChange={(e) => {
                        if (editingVacancy) {
                          setEditingVacancy({ ...editingVacancy, is_active: e.target.checked });
                        }
                      }}
                      className="size-4 accent-[#14864B] rounded cursor-pointer"
                    />
                    <span>Active and accepting applications</span>
                  </label>
                </div>
              </div>


            </div>
          </div>
        </form>
      </div>
    );
  }

  // ==========================================
  // CAREERS DASHBOARD & POSITIONS LIST
  // ==========================================
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <ConfirmModal
        isOpen={!!vacancyToDelete}
        title="Delete position"
        message={`Are you sure you want to delete "${vacancyToDelete?.title}"? Existing applications will remain safe in the CV Vault.`}
        confirmText="Delete position"
        cancelText="Keep position"
        isDanger
        onConfirm={() => {
          void confirmDelete();
        }}
        onCancel={() => setVacancyToDelete(null)}
      />

      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-[#E2ECE6] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#14864B] uppercase tracking-wider mb-2">
            <Users className="w-4 h-4" />
            <span>Practice Talent &amp; Recruitment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#023A51] tracking-tight">
            Careers &amp; Vacancies Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#59667D] mt-1 max-w-2xl leading-relaxed">
            Manage open associate positions, article trainee intakes, and candidate submissions.
          </p>
        </div>

        {/* Global Master Switch */}
        <div className="flex items-center gap-4 bg-[#F8FAFB] border border-[#E8EBEF] px-5 py-3.5 rounded-2xl shrink-0">
          <div>
            <div className="text-xs font-bold text-[#023A51]">Public Careers Page</div>
            <div className="text-[11px] text-[#59667D]">
              {settings.careers_enabled ? 'Active on website' : 'Closed to public'}
            </div>
          </div>

          <button
            type="button"
            disabled={portalBusy || !settingsLoaded}
            onClick={() => {
              void toggleHiringPortal();
            }}
            className="text-2xl transition hover:opacity-80 disabled:opacity-50 cursor-pointer"
            aria-label="Toggle Public Careers Page"
          >
            {settings.careers_enabled ? (
              <ToggleRight className="w-9 h-9 text-[#14864B]" />
            ) : (
              <ToggleLeft className="w-9 h-9 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {feedback && (
        <div
          role={feedback.kind === 'error' ? 'alert' : 'status'}
          className={`rounded-2xl border p-4 text-sm font-medium flex items-center gap-2 ${
            feedback.kind === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-800'
              : 'border-emerald-200 bg-emerald-50 text-emerald-900'
          }`}
        >
          {feedback.kind === 'error' ? <AlertCircle className="size-5 shrink-0" /> : <CheckCircle2 className="size-5 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-[#E8EBEF] p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#59667D]">Active Vacancies</div>
          <div className="text-3xl font-extrabold text-[#023A51] mt-2">
            {vacanciesLoaded ? vacancies.filter((v) => v.is_active).length : '—'}
          </div>
          <div className="text-[11px] text-[#59667D] mt-1">Accepting applications</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EBEF] p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#59667D]">Archived Roles</div>
          <div className="text-3xl font-extrabold text-[#59667D] mt-2">
            {vacanciesLoaded ? vacancies.filter((v) => !v.is_active).length : '—'}
          </div>
          <div className="text-[11px] text-[#59667D] mt-1">Closed or past deadline</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EBEF] p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#59667D]">CV Submissions</div>
            <div className="text-3xl font-extrabold text-[#14864B] mt-2">{applications.length}</div>
            <div className="text-[11px] text-[#59667D] mt-1">In candidate vault</div>
          </div>
          <Link
            href="/admin/applications"
            className="px-3.5 py-2 rounded-xl bg-[#023A51] text-white text-xs font-bold hover:bg-[#14864B] transition-colors"
          >
            Open Vault
          </Link>
        </div>
      </div>

      {/* Vacancies Workspace */}
      <div className="bg-white rounded-3xl border border-[#E2ECE6] overflow-hidden shadow-xs">
        <div className="p-6 border-b border-[#EDF2EF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#023A51]">Open Positions Workspace</h2>
            <p className="text-xs text-[#59667D] mt-0.5">Edit, archive, or launch new career openings.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs font-bold">
              {(['all', 'active', 'archived'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setVacancyFilter(tab)}
                  className={`px-3 py-1 rounded-lg capitalize transition cursor-pointer ${
                    vacancyFilter === tab ? 'bg-white text-[#023A51] shadow-xs' : 'text-[#64748B] hover:text-[#023A51]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => openVacancyForm()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#023A51] hover:bg-[#14864B] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Role</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-[#EDF2EF]">
          {!vacanciesLoaded ? (
            <div className="p-12 text-center text-sm text-[#59667D] flex items-center justify-center gap-2">
              <LoaderCircle className="size-4 animate-spin text-[#14864B]" />
              Loading vacancies from database…
            </div>
          ) : visibleVacancies.length === 0 ? (
            <div className="p-16 text-center">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-[#023A51]">No vacancies found</h3>
              <p className="text-xs text-[#59667D] mt-1">
                Click &ldquo;Post New Role&rdquo; to launch the full opening editor.
              </p>
            </div>
          ) : (
            visibleVacancies.map((vacancy) => (
              <div
                key={vacancy.id}
                className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#FAFDFB] transition-colors"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F7ED] text-[#14864B]">
                      {vacancy.department}
                    </span>
                    <span className="text-xs font-semibold text-[#59667D]">{vacancy.employment_type}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        vacancy.is_active ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {vacancy.is_active ? 'Active' : 'Archived'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#023A51]">{vacancy.title}</h3>

                  <div className="flex items-center gap-4 text-xs text-[#59667D]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#2CBC63]" /> {vacancy.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#2CBC63]" /> Deadline: {vacancy.deadline || 'Open'}
                    </span>
                    {vacancy.attachment_url && (
                      <span className="flex items-center gap-1 font-semibold text-[#14864B]">
                        <FileText className="w-3.5 h-3.5" /> JD Attached
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openVacancyForm(vacancy)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#023A51]/5 border border-[#D8E4DE] text-xs font-bold text-[#023A51] hover:bg-[#023A51] hover:text-white transition-all cursor-pointer"
                  >
                    <Pencil className="size-3.5" />
                    <span>Open in Editor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      void toggleVacancyActive(vacancy);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-[#D8E4DE] text-xs font-semibold text-[#365555] hover:bg-[#F5FAF7] cursor-pointer"
                  >
                    {vacancy.is_active ? 'Archive' : 'Activate'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setVacancyToDelete({ id: vacancy.id, title: vacancy.title })}
                    className="p-2 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                    aria-label={`Delete ${vacancy.title}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
