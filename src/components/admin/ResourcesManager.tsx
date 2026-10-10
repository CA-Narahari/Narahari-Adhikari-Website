'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Landmark,
  Download,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  X,
  FileText,
  Upload,
  AlertCircle,
  Search,
} from 'lucide-react';
import { GovernmentLink, DownloadResource } from '@/types';
import ConfirmModal from '@/components/ui/ConfirmModal';
import MediaLibraryModal from '@/components/admin/MediaLibraryModal';

type ResourceSection = 'all' | 'links' | 'downloads';

export default function ResourcesManager({ section = 'all' }: { section?: ResourceSection }) {
  const {
    governmentLinks,
    addGovernmentLink,
    updateGovernmentLink,
    deleteGovernmentLink,
    downloads,
    addDownload,
    updateDownload,
    deleteDownload,
  } = useApp();

  // Government Link Modal state
  const [isGovModalOpen, setIsGovModalOpen] = useState(false);
  const [editingGovLink, setEditingGovLink] = useState<GovernmentLink | null>(null);
  const [govForm, setGovForm] = useState({
    name: '',
    short_name: '',
    description: '',
    url: '',
    category: '',
    logo_url: '',
    logo_alt: '',
  });

  // Download Resource Modal state
  const [isDlModalOpen, setIsDlModalOpen] = useState(false);
  const [editingDl, setEditingDl] = useState<DownloadResource | null>(null);
  const [dlForm, setDlForm] = useState({
    title: '',
    category: 'Tax Form' as DownloadResource['category'],
    file_format: 'PDF',
    file_size: '1.2 MB',
    download_url: '',
  });

  // File upload state for downloadable resources
  const [documentLibraryOpen, setDocumentLibraryOpen] = useState(false);
  const [logoLibraryOpen, setLogoLibraryOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);

  // Deletion confirm modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'gov' | 'dl';
    id: string;
    title: string;
  } | null>(null);

  // Open Gov Link Modal for Add or Edit
  const openGovModal = (link?: GovernmentLink) => {
    setIsDlModalOpen(false);
    if (link) {
      setEditingGovLink(link);
      setGovForm({
        name: link.name,
        short_name: link.short_name,
        description: link.description,
        url: link.url,
        category: link.category,
        logo_url: link.logo_url || '',
        logo_alt: link.logo_alt || '',
      });
    } else {
      setEditingGovLink(null);
      setGovForm({
        name: '',
        short_name: '',
        description: '',
        url: '',
        category: 'Regulatory Authority',
        logo_url: '',
        logo_alt: '',
      });
    }
    setIsGovModalOpen(true);
  };

  const handleGovSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!govForm.name.trim() || !govForm.url.trim()) return;

    setIsSaving(true);
    let saved = false;
    try {
      if (editingGovLink) saved = await updateGovernmentLink(editingGovLink.id, govForm);
      else saved = await addGovernmentLink(govForm);
    } catch { saved = false; }
    setIsSaving(false);
    if (!saved) { setFeedback({ kind: 'error', message: 'The portal link could not be saved. Check your CMS access and try again.' }); return; }
    setIsGovModalOpen(false);
    setFeedback({ kind: 'success', message: editingGovLink ? 'Portal link updated.' : 'Portal link added.' });
  };

  // Open Download Modal for Add or Edit
  const openDlModal = (res?: DownloadResource) => {
    setIsGovModalOpen(false);
    if (res) {
      setEditingDl(res);
      setDlForm({
        title: res.title,
        category: res.category,
        file_format: res.file_format,
        file_size: res.file_size,
        download_url: res.download_url,
      });
    } else {
      setEditingDl(null);
      setDlForm({
        title: '',
        category: 'Tax Form',
        file_format: 'PDF',
        file_size: '1.5 MB',
        download_url: '',
      });
    }
    setIsDlModalOpen(true);
  };

  const handleSelectDocument = (file: { url: string; imageName?: string; fileSize?: number }) => {
    const size = file.fileSize ? file.fileSize / (1024 * 1024) : 0;
    const sizeLabel = size >= 1 ? `${size.toFixed(1)} MB` : file.fileSize ? `${Math.max(1, Math.round(file.fileSize / 1024))} KB` : dlForm.file_size;
    const extension = file.imageName?.split('.').pop()?.toUpperCase() || dlForm.file_format;
    setDlForm((current) => ({ ...current, title: current.title || file.imageName?.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ') || '', download_url: file.url, file_format: extension, file_size: sizeLabel }));
    setDocumentLibraryOpen(false);
  };

  const handleDlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dlForm.title.trim() || !dlForm.download_url.trim()) {
      setFeedback({ kind: 'error', message: 'Add a title and file URL before saving the resource.' });
      return;
    }

    setIsSaving(true);
    let saved = false;
    try {
      if (editingDl) saved = await updateDownload(editingDl.id, dlForm);
      else saved = await addDownload(dlForm);
    } catch { saved = false; }
    setIsSaving(false);
    if (!saved) { setFeedback({ kind: 'error', message: 'The download could not be saved. Check your CMS access and try again.' }); return; }
    setIsDlModalOpen(false);
    setFeedback({ kind: 'success', message: editingDl ? 'Download details updated.' : 'Download added to the public resources page.' });
  };

  const confirmDeleteTarget = async () => {
    if (!deleteTarget) return;
    setIsSaving(true);
    let deleted = false;
    try {
      if (deleteTarget.type === 'gov') deleted = await deleteGovernmentLink(deleteTarget.id);
      else deleted = await deleteDownload(deleteTarget.id);
    } catch { deleted = false; }
    setIsSaving(false);
    if (!deleted) { setFeedback({ kind: 'error', message: 'This item could not be removed. Check your CMS access and try again.' }); return; }
    setFeedback({ kind: 'success', message: 'Item removed from the public resources page.' });
    setDeleteTarget(null);
  };

  const normalizedSearch = search.trim().toLowerCase();
  const visibleGovernmentLinks = governmentLinks.filter((item) => [item.name, item.short_name, item.category, item.description].some((value) => value?.toLowerCase().includes(normalizedSearch)));
  const visibleDownloads = downloads.filter((item) => [item.title, item.category, item.file_format].some((value) => value?.toLowerCase().includes(normalizedSearch)));

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-12">
      {/* Reusable Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.type === 'gov' ? 'Delete Regulatory Authority' : 'Delete Resource'}
        message={`Are you sure you want to remove "${deleteTarget?.title}"? This item will no longer appear in the public portal.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={() => { void confirmDeleteTarget(); }}
        onCancel={() => setDeleteTarget(null)}
      />

      <header className="flex flex-col gap-5 rounded-3xl border border-[#E2ECE6] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#168A4A]">Public website content</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#073E43] sm:text-3xl">
            {section === 'links' ? 'Reference Links' : section === 'downloads' ? 'Download Resources' : 'Resources Portal'}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66797A]">
            {section === 'links'
              ? 'Maintain the trusted government and regulatory portals linked from the public Resources page.'
              : section === 'downloads'
              ? 'Upload and manage statutory forms, checklists, and guides available for visitors to download.'
              : 'Manage trusted regulatory references and downloadable statutory files shown on the public website.'}
          </p>
        </div>
        <a
          href={section === 'downloads' ? '/resources/downloads' : '/resources'}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl border border-[#D8E4DE] px-4 text-sm font-semibold text-[#143F40] transition hover:bg-[#F5FAF7]"
        >
          Preview public page <ExternalLink className="size-4 text-[#168A4A]" />
        </a>
      </header>

      {/* Workspace Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E2ECE6] pb-1">
        <a
          href="/admin/resources/links"
          className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
            section === 'links' || section === 'all'
              ? 'bg-[#023A51] text-white shadow-xs'
              : 'text-[#56686A] hover:text-[#023A51] hover:bg-slate-100'
          }`}
        >
          Reference Links ({governmentLinks.length})
        </a>
        <a
          href="/admin/resources/downloads"
          className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
            section === 'downloads'
              ? 'bg-[#023A51] text-white shadow-xs'
              : 'text-[#56686A] hover:text-[#023A51] hover:bg-slate-100'
          }`}
        >
          Downloads ({downloads.length})
        </a>
      </div>

      <section aria-label="Resource totals" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {section !== 'downloads' && (
          <div className="rounded-2xl border border-[#E2ECE6] bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#718181]">Authority Links</p>
            <p className="mt-1 text-2xl font-bold text-[#073E43]">{governmentLinks.length}</p>
          </div>
        )}
        {section !== 'links' && (
          <div className="rounded-2xl border border-[#E2ECE6] bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#718181]">Download Files</p>
            <p className="mt-1 text-2xl font-bold text-[#073E43]">{downloads.length}</p>
          </div>
        )}
        <label className="col-span-2 flex min-h-16 items-center gap-2 rounded-2xl border border-[#E2ECE6] bg-white px-4 sm:col-span-1">
          <Search className="size-4 shrink-0 text-[#82918D]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label={`Search ${section === 'links' ? 'reference links' : section === 'downloads' ? 'downloads' : 'resources and links'}`}
            placeholder={`Search ${section === 'links' ? 'reference links' : section === 'downloads' ? 'download files' : 'resources and links'}`}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#91A19C]"
          />
        </label>
      </section>
      {feedback && <p role={feedback.kind === 'error' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm ${feedback.kind === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>{feedback.message}</p>}

      {/* 1. Official Government Authority Links */}
      {section !== 'downloads' && <div className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-xs sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div>
            <h2 className="text-base font-bold text-[#103F40] flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#168A4A]" />
              <span>Official Government Regulatory Portals ({governmentLinks.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Visitors open these official sites in a new browser tab.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openGovModal()}
            className="px-4 py-2 bg-[#0B4B4C] hover:bg-[#083D3F] text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Regulatory Portal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleGovernmentLinks.length === 0 ? (
            <p className="col-span-full rounded-2xl border border-dashed border-[#D9E5DF] p-8 text-center text-[13px] text-[#718181]">
              {governmentLinks.length ? 'No authority links match this search.' : 'No authority links have been added yet.'}
            </p>
          ) : (
            visibleGovernmentLinks.map((g) => {
              const cleanUrl = g.url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
              const words = g.description?.split(/\s+/) || [];
              const shortDesc = words.slice(0, 8).join(' ') + (words.length > 8 ? '...' : '');

              return (
                <div
                  key={g.id}
                  className="bg-white rounded-2xl border border-[#E2ECE6] p-5 flex flex-col justify-between hover:border-[#B9D8C7] hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Left: Details */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <span className="text-[9px] font-bold text-[#14864B] uppercase tracking-wider block truncate">
                        {g.category || 'Regulatory Authority'}
                      </span>
                      <h3 className="text-[13px] font-bold text-[#023A51] leading-snug">
                        {g.name}
                      </h3>
                      {g.short_name && (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-[9px] font-mono font-medium text-slate-600">
                          {g.short_name}
                        </span>
                      )}
                      <p className="text-[11px] font-mono text-[#59667D] truncate">
                        {cleanUrl}
                      </p>
                      {g.description && (
                        <p className="text-[11px] text-[#4A5259] leading-relaxed">
                          {shortDesc}
                        </p>
                      )}
                    </div>

                    {/* Right: Logo */}
                    {g.logo_url ? (
                      <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E8EBEF] p-1.5 flex items-center justify-center shrink-0">
                        <img src={g.logo_url} alt={g.name} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#EAF7F0] text-[#147448] border border-[#D5EFE1] flex items-center justify-center shrink-0">
                        <Landmark className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Bottom actions */}
                  <div className="pt-3 mt-3 border-t border-[#EEF2EF] flex items-center justify-between gap-2">
                    <a
                      href={g.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#023A51] hover:text-[#168A4A] transition-colors"
                    >
                      <span>Visit Portal</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label={`Edit ${g.name}`}
                        onClick={() => openGovModal(g)}
                        title="Edit Portal"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${g.name}`}
                        onClick={() =>
                          setDeleteTarget({
                            type: 'gov',
                            id: g.id,
                            title: g.name,
                          })
                        }
                        title="Delete Portal"
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>}

      {/* 2. Downloadable Statutory Resources & Files */}
      {section !== 'links' && <div className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-xs sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECF1EE] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#103F40] flex items-center gap-2">
              <Download className="w-4 h-4 text-[#168A4A]" />
              <span>Downloadable Forms, Checklists &amp; Guides ({downloads.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload a file to Supabase Storage or link a direct file URL for website visitors.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openDlModal()}
            className="px-4 py-2 bg-[#0B4B4C] hover:bg-[#083D3F] text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Download File</span>
          </button>
        </div>

        <div className="divide-y divide-[#EDF2EF]">
          {visibleDownloads.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[#D9E5DF] p-8 text-center text-sm text-[#718181]">
              {downloads.length ? 'No download files match this search.' : 'No download files have been added yet.'}
            </p>
          ) : (
            visibleDownloads.map((d) => {
              const formatUpper = (d.file_format || 'PDF').toUpperCase();
              const badgeStyle =
                formatUpper === 'PDF'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : formatUpper.includes('XLS')
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : formatUpper.includes('DOC')
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200';

              return (
                <div
                  key={d.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-[#FAFCFB] -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#F0F5F2] text-[#147448] flex items-center justify-center shrink-0 mt-0.5 border border-[#D5EFE1]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-[#143F40] text-sm leading-snug truncate">
                        {d.title}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-slate-500 mt-1">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10.5px] font-semibold text-slate-700">
                          {d.category}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded border text-[10px] font-mono font-bold ${badgeStyle}`}>
                          {formatUpper}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">{d.file_size}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {d.downloads_count || 0} downloads
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {d.download_url && (
                      <a
                        href={d.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg border border-[#D8E4DE] hover:bg-[#F5FAF7] text-[#143F40] font-semibold text-xs flex items-center gap-1 transition-colors"
                        title="Test download link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </a>
                    )}
                    <button
                      onClick={() => openDlModal(d)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() =>
                        setDeleteTarget({
                          type: 'dl',
                          id: d.id,
                          title: d.title,
                        })
                      }
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>}

      {/* Modal Dialog: Regulatory Portal */}
      {isGovModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#E2ECE6] bg-white p-6 shadow-2xl sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECF1EE] pb-3">
              <h3 className="font-bold text-[#143F40] text-base">
                {editingGovLink ? 'Edit Regulatory Portal Link' : 'Add Official Regulatory Portal'}
              </h3>
              <button
                type="button"
                onClick={() => setIsGovModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {feedback?.kind === 'error' && (
              <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                {feedback.message}
              </p>
            )}

            <form onSubmit={handleGovSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Authority Name *</label>
                <input
                  type="text"
                  required
                  disabled={isSaving}
                  value={govForm.name}
                  onChange={(e) => setGovForm({ ...govForm, name: e.target.value })}
                  placeholder="e.g. Inland Revenue Department (IRD)"
                  className="w-full h-10 px-3 border border-[#CCD7DC] rounded-xl focus:outline-none focus:border-[#168A4A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Short Code / Acronym</label>
                  <input
                    type="text"
                    disabled={isSaving}
                    value={govForm.short_name}
                    onChange={(e) => setGovForm({ ...govForm, short_name: e.target.value })}
                    placeholder="e.g. IRD Nepal"
                    className="w-full h-10 px-3 border border-[#CCD7DC] rounded-xl focus:outline-none focus:border-[#168A4A]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <input
                    type="text"
                    disabled={isSaving}
                    value={govForm.category}
                    onChange={(e) => setGovForm({ ...govForm, category: e.target.value })}
                    placeholder="e.g. Tax & Revenue Authority"
                    className="w-full h-10 px-3 border border-[#CCD7DC] rounded-xl focus:outline-none focus:border-[#168A4A]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Portal URL *</label>
                <input
                  type="url"
                  required
                  disabled={isSaving}
                  value={govForm.url}
                  onChange={(e) => setGovForm({ ...govForm, url: e.target.value })}
                  placeholder="https://ird.gov.np"
                  className="w-full h-10 px-3 border border-[#CCD7DC] rounded-xl font-mono focus:outline-none focus:border-[#168A4A]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  disabled={isSaving}
                  value={govForm.description}
                  onChange={(e) => setGovForm({ ...govForm, description: e.target.value })}
                  placeholder="Official services provided by this authority..."
                  className="w-full p-3 border border-[#CCD7DC] rounded-xl focus:outline-none focus:border-[#168A4A]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Organization Logo (Optional)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="url"
                    disabled={isSaving}
                    value={govForm.logo_url}
                    onChange={(e) => setGovForm({ ...govForm, logo_url: e.target.value })}
                    placeholder="https://... or select from media library"
                    className="flex-1 h-10 px-3 border border-[#CCD7DC] rounded-xl font-mono focus:outline-none focus:border-[#168A4A]"
                  />
                  <button
                    type="button"
                    onClick={() => setLogoLibraryOpen(true)}
                    disabled={isSaving}
                    className="h-10 px-3 bg-[#F4F6F8] border border-[#E2ECE6] rounded-xl text-xs font-semibold text-[#143F40] hover:bg-[#E8EBEF] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Browse</span>
                  </button>
                </div>
                {govForm.logo_url && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 border border-[#E8EBEF] p-1 flex items-center justify-center">
                      <img src={govForm.logo_url} alt="Logo preview" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[11px] text-slate-500 truncate max-w-xs">{govForm.logo_url}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#ECF1EE] flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsGovModalOpen(false)}
                  className="px-4 py-2 border border-[#DCE7E1] rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#0B4B4C] hover:bg-[#083D3F] text-white rounded-xl font-bold transition-colors cursor-pointer"
                >
                  {isSaving ? 'Saving…' : editingGovLink ? 'Save Changes' : 'Add Authority'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dialog: Downloadable Resource */}
      {isDlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#E2ECE6] bg-white p-6 shadow-2xl sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECF1EE] pb-3">
              <h3 className="font-bold text-[#143F40] text-base">
                {editingDl ? 'Edit Downloadable Resource' : 'Add Downloadable Resource'}
              </h3>
              <button
                type="button"
                onClick={() => setIsDlModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {feedback?.kind === 'error' && (
              <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                {feedback.message}
              </p>
            )}

            <div className="rounded-2xl border border-[#E2ECE6] bg-[#F7FAF8] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#123F40]">Resource file</p>
                  <p className="mt-1 text-xs text-[#718181]">
                    Select an existing document from storage or upload a new one.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDocumentLibraryOpen(true)}
                  disabled={isSaving}
                  className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0B4B4C] px-4 text-xs font-semibold text-white hover:bg-[#083D3F] disabled:opacity-60 cursor-pointer"
                >
                  <FileText className="size-4" />
                  {dlForm.download_url ? 'Change file' : 'Open file library'}
                </button>
              </div>
              {dlForm.download_url && (
                <p className="mt-3 break-all rounded-xl bg-white border border-[#E2ECE6] p-2.5 text-xs font-mono text-[#52706C]">
                  {dlForm.download_url}
                </p>
              )}
            </div>

            <form onSubmit={handleDlSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  disabled={isSaving}
                  value={dlForm.title}
                  onChange={(e) => setDlForm({ ...dlForm, title: e.target.value })}
                  placeholder="e.g. Income Tax Return Schedule 1 to 5 Forms"
                  className="w-full h-10 px-3 border border-[#CCD7DC] rounded-xl focus:outline-none focus:border-[#168A4A]"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={dlForm.category}
                    disabled={isSaving}
                    onChange={(e) =>
                      setDlForm({
                        ...dlForm,
                        category: e.target.value as DownloadResource['category'],
                      })
                    }
                    className="w-full h-10 px-3 border border-[#CCD7DC] rounded-xl focus:outline-none focus:border-[#168A4A] cursor-pointer"
                  >
                    <option value="Tax Form">Tax Form</option>
                    <option value="Checklist">Checklist</option>
                    <option value="Template">Template</option>
                    <option value="Guide">Guide</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">File Format</label>
                  <input
                    type="text"
                    disabled={isSaving}
                    value={dlForm.file_format}
                    onChange={(e) => setDlForm({ ...dlForm, file_format: e.target.value })}
                    placeholder="PDF, DOCX, XLSX"
                    className="w-full h-10 px-3 border border-[#CCD7DC] rounded-xl font-mono focus:outline-none focus:border-[#168A4A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">File Size</label>
                  <input
                    type="text"
                    disabled={isSaving}
                    value={dlForm.file_size}
                    onChange={(e) => setDlForm({ ...dlForm, file_size: e.target.value })}
                    placeholder="e.g. 1.8 MB"
                    className="w-full h-10 px-3 border border-[#CCD7DC] rounded-xl focus:outline-none focus:border-[#168A4A]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">File URL / Download Link *</label>
                  <input
                    type="url"
                    required
                    disabled={isSaving}
                    value={dlForm.download_url}
                    onChange={(e) => setDlForm({ ...dlForm, download_url: e.target.value })}
                    placeholder="https://... or choose from library above"
                    className="w-full h-10 px-3 border border-[#CCD7DC] rounded-xl font-mono focus:outline-none focus:border-[#168A4A]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#ECF1EE] flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsDlModalOpen(false)}
                  className="px-4 py-2 border border-[#DCE7E1] rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#0B4B4C] hover:bg-[#083D3F] text-white rounded-xl font-bold transition-colors cursor-pointer"
                >
                  {isSaving ? 'Saving…' : editingDl ? 'Save Changes' : 'Add File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <MediaLibraryModal isOpen={documentLibraryOpen} mode="featured" storageBucket="download-resources" storageFolder="documents" initialImageName={dlForm.title} onClose={() => setDocumentLibraryOpen(false)} onSelect={handleSelectDocument} />
      <MediaLibraryModal isOpen={logoLibraryOpen} mode="featured" storageBucket="website-media" storageFolder="general" initialImageName={govForm.name} onClose={() => setLogoLibraryOpen(false)} onSelect={(file) => { setGovForm((current) => ({ ...current, logo_url: file.url, logo_alt: file.altText || current.logo_alt || `${current.name} logo` })); setLogoLibraryOpen(false); }} />
    </div>
  );
}
