'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import {
  Landmark,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Eye,
  CheckCircle2,
  LoaderCircle,
  Search,
  Upload,
  X,
  FileImage,
  Globe,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import MediaLibraryModal from '@/components/admin/MediaLibraryModal';
import { getPortalLogo } from '@/lib/portal-logo';
import type { GovernmentLink } from '@/types';

const COMMON_CATEGORIES = [
  'Regulatory Authority',
  'Tax Administration',
  'Central Bank',
  'Company Registry',
  'Social Security',
  'Professional Body',
  'Government Ministry',
  'Financial Markets',
];

export default function AdminReferenceLinksPage() {
  const {
    governmentLinks,
    addGovernmentLink,
    updateGovernmentLink,
    deleteGovernmentLink,
  } = useApp();

  // Mode: list view vs editor view
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<GovernmentLink | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [category, setCategory] = useState('Regulatory Authority');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoAlt, setLogoAlt] = useState('');

  // UI state
  const [search, setSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [isSaving, setIsSaving] = useState(false);
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GovernmentLink | null>(null);

  // Open editor for new or existing link
  const openEditor = (link?: GovernmentLink) => {
    setFeedback(null);
    if (link) {
      setEditingLink(link);
      setName(link.name || '');
      setShortName(link.short_name || '');
      setCategory(link.category || 'Regulatory Authority');
      setUrl(link.url || '');
      setDescription(link.description || '');
      setLogoUrl(link.logo_url || '');
      setLogoAlt(link.logo_alt || `${link.name} Logo`);
    } else {
      setEditingLink(null);
      setName('');
      setShortName('');
      setCategory('Regulatory Authority');
      setUrl('https://');
      setDescription('');
      setLogoUrl('');
      setLogoAlt('');
    }
    setIsEditorOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeEditor = () => {
    if (isSaving) return;
    setIsEditorOpen(false);
    setEditingLink(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFeedback({ kind: 'error', message: 'Authority/Organization name is required.' });
      return;
    }
    if (!url.trim()) {
      setFeedback({ kind: 'error', message: 'Official website URL is required.' });
      return;
    }

    setIsSaving(true);
    setFeedback(null);
    let saveError = '';

    const payload = {
      name: name.trim(),
      short_name: shortName.trim(),
      category: category.trim() || 'Regulatory Authority',
      url: url.trim(),
      description: description.trim(),
      logo_url: logoUrl.trim() || undefined,
      logo_alt: logoAlt.trim() || `${name.trim()} Logo`,
    };

    let saved = false;
    try {
      if (editingLink) {
        saved = await updateGovernmentLink(editingLink.id, payload);
      } else {
        saved = await addGovernmentLink(payload);
      }
    } catch (error) {
      saved = false;
      saveError = error instanceof Error ? error.message : '';
    }

    setIsSaving(false);

    if (!saved) {
      setFeedback({
        kind: 'error',
        message: saveError || 'Could not save the regulatory portal. Please check your connection and try again.',
      });
      return;
    }

    setFeedback({
      kind: 'success',
      message: editingLink
        ? `Portal "${payload.name}" updated successfully.`
        : `New regulatory portal "${payload.name}" published.`,
    });
    setIsEditorOpen(false);
    setEditingLink(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    let ok = false;
    try {
      ok = await deleteGovernmentLink(deleteTarget.id);
    } catch {
      ok = false;
    }
    if (!ok) {
      setFeedback({ kind: 'error', message: 'Could not delete the portal link.' });
    } else {
      setFeedback({ kind: 'success', message: `Portal "${deleteTarget.name}" removed.` });
    }
    setDeleteTarget(null);
  };

  // Filtered links
  const categoriesList = [
    'All',
    ...Array.from(new Set(governmentLinks.map((g) => g.category || 'Regulatory Authority'))),
  ];

  const visibleLinks = governmentLinks.filter((item) => {
    const matchesCategory =
      selectedCategoryFilter === 'All' || item.category === selectedCategoryFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      (item.short_name && item.short_name.toLowerCase().includes(q)) ||
      item.url.toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  // Current preview state object for live preview
  const previewPortal = {
    name: name.trim() || 'Authority / Organization Name',
    short_name: shortName.trim() || 'ACRONYM',
    category: category.trim() || 'Regulatory Authority',
    url: url.trim() || 'https://official-portal.gov.np',
    description: description.trim() || 'Short official overview and description of this regulatory authority for public visitors.',
    logo_url: logoUrl.trim() || undefined,
    logo_alt: logoAlt.trim() || 'Official Logo',
  };
  const previewLogo = getPortalLogo(previewPortal);
  const previewCleanUrl = previewPortal.url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
  const previewDisplayName =
    previewPortal.short_name &&
    !previewPortal.name.toLowerCase().includes(`(${previewPortal.short_name.toLowerCase()})`)
      ? `${previewPortal.name} (${previewPortal.short_name})`
      : previewPortal.name;
  const previewWords = previewPortal.description.split(/\s+/);
  const previewShortExplanation =
    previewWords.slice(0, 7).join(' ') + (previewWords.length > 7 ? '…' : '');

  // =========================================================================
  // VIEW 1: FULL-PAGE CONTENT EDITOR (Like /admin/careers)
  // =========================================================================
  if (isEditorOpen) {
    return (
      <div className="mx-auto max-w-[1400px] space-y-6 pb-20">
        <MediaLibraryModal
          isOpen={mediaLibraryOpen}
          mode="featured"
          storageFolder="general"
          fileType="image"
          initialImageName={logoUrl.split('/').pop() || ''}
          onClose={() => setMediaLibraryOpen(false)}
          onSelect={(file) => {
            setLogoUrl(file.url);
            if (!logoAlt && file.altText) setLogoAlt(file.altText);
            setMediaLibraryOpen(false);
          }}
        />

        {/* Top Control Bar */}
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E2ECE6] bg-white/95 px-5 py-3.5 backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={closeEditor}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D8E4DE] px-3 py-1.5 text-xs font-semibold text-[#143F40] hover:bg-[#F5FAF7] cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Reference Links</span>
            </button>
            <div className="hidden sm:block h-4 w-px bg-slate-200" />
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#023A51]">
              <Landmark className="size-3.5 text-[#2CBC63]" />
              {editingLink ? `Editing: ${editingLink.name}` : 'Create Regulatory Portal'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/resources/downloads"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-[#D8E4DE] px-3 py-1.5 text-xs font-semibold text-[#023A51] hover:bg-[#F5FAF7]"
            >
              <Eye className="size-3 text-[#2CBC63]" />
              <span>View Public Directory</span>
            </Link>

            <button
              type="button"
              onClick={closeEditor}
              disabled={isSaving}
              className="rounded-xl border border-[#D8E4DE] px-3.5 py-1.5 text-xs font-medium text-[#64748B] hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="reference-link-editor-form"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#023A51] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#14864B] transition-all disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? <LoaderCircle className="size-3 animate-spin" /> : <CheckCircle2 className="size-3" />}
              <span>{isSaving ? 'Saving...' : editingLink ? 'Update Portal' : 'Publish Portal'}</span>
            </button>
          </div>
        </header>

        {feedback && (
          <div
            role="alert"
            className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs ${
              feedback.kind === 'error'
                ? 'border-rose-200 bg-rose-50 text-rose-800'
                : 'border-emerald-200 bg-emerald-50 text-emerald-900'
            }`}
          >
            {feedback.kind === 'error' ? <AlertCircle className="size-4 shrink-0" /> : <CheckCircle2 className="size-4 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <form
              id="reference-link-editor-form"
              onSubmit={handleSave}
              className="rounded-2xl border border-[#E2ECE6] bg-white p-6 shadow-xs space-y-4"
            >
              <div className="border-b border-[#EDF2EF] pb-3">
                <h2 className="text-sm font-bold text-[#023A51]">
                  Portal Details &amp; Metadata
                </h2>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  Configure authority name, official category, redirect link, and summary.
                </p>
              </div>

              {/* Authority Name */}
              <div>
                <label className="block text-[11px] font-bold text-[#365555] uppercase tracking-wider mb-1">
                  Organization / Authority Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Inland Revenue Department (IRD)"
                  className="w-full h-10 rounded-xl border border-[#D6E3DD] px-3.5 text-xs text-[#143F40] outline-none focus:border-[#168A4A]"
                />
              </div>

              {/* Short Acronym & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#365555] uppercase tracking-wider mb-1">
                    Short Acronym / Code
                  </label>
                  <input
                    type="text"
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    placeholder="e.g. IRD, NRB, OCR, ICAN"
                    className="w-full h-10 rounded-xl border border-[#D6E3DD] px-3.5 text-xs font-mono text-[#143F40] outline-none focus:border-[#168A4A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#365555] uppercase tracking-wider mb-1">
                    Category / Sector
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Regulatory Authority"
                    className="w-full h-10 rounded-xl border border-[#D6E3DD] px-3.5 text-xs text-[#143F40] outline-none focus:border-[#168A4A]"
                  />
                </div>
              </div>

              {/* Category Quick Chips */}
              <div>
                <span className="block text-[10px] text-[#82918D] mb-1.5">Quick categories:</span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-medium transition-colors cursor-pointer border ${
                        category === cat
                          ? 'border-[#2CBC63] bg-[#EAF7F0] text-[#14864B]'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Official URL */}
              <div>
                <label className="block text-[11px] font-bold text-[#365555] uppercase tracking-wider mb-1">
                  Official Website URL <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://ird.gov.np"
                    className="w-full h-10 rounded-xl border border-[#D6E3DD] pl-9 pr-3 text-xs font-mono text-[#143F40] outline-none focus:border-[#168A4A]"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-[11px] font-bold text-[#365555] uppercase tracking-wider mb-1">
                  Short Description (6–10 words recommended)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Direct tax filing, VAT returns, PAN registration, and tax clearings."
                  className="w-full rounded-xl border border-[#D6E3DD] px-3.5 py-2.5 text-xs text-[#143F40] outline-none focus:border-[#168A4A] leading-relaxed"
                />
              </div>

              {/* Logo Selection & Alt Text */}
              <div className="pt-2 border-t border-[#EDF2EF] space-y-3">
                <label className="block text-[11px] font-bold text-[#365555] uppercase tracking-wider">
                  Authority Official Logo (Square Shape)
                </label>

                {logoUrl ? (
                  <div className="flex items-center gap-3 rounded-xl border border-[#D6E3DD] bg-[#F8FAFC] p-3">
                    <div className="relative size-16 shrink-0 rounded-xl border border-[#E2E8F0] bg-white p-1 flex items-center justify-center">
                      <Image
                        src={logoUrl}
                        alt={logoAlt || 'Logo'}
                        width={60}
                        height={60}
                        unoptimized
                        className="object-contain max-h-full max-w-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate text-xs font-semibold text-[#143F40] font-mono">
                        {logoUrl.split('/').pop()}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setMediaLibraryOpen(true)}
                          className="text-[11px] font-semibold text-[#168A4A] hover:underline cursor-pointer"
                        >
                          Change logo
                        </button>
                        <span className="text-slate-300">•</span>
                        <button
                          type="button"
                          onClick={() => {
                            setLogoUrl('');
                            setLogoAlt('');
                          }}
                          className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                        >
                          Clear logo
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMediaLibraryOpen(true)}
                    className="grid min-h-24 w-full place-items-center rounded-xl border-2 border-dashed border-[#C7DCD0] bg-[#F8FBF9] text-center transition hover:border-[#168A4A] hover:bg-[#F0FAF4] cursor-pointer"
                  >
                    <div className="py-2">
                      <FileImage className="mx-auto size-5 text-[#168A4A]" />
                      <span className="mt-1 block text-xs font-semibold text-[#365555]">
                        Upload or select official square logo
                      </span>
                      <span className="mt-0.5 block text-[10px] text-[#82918D]">
                        PNG, SVG, or WEBP supported. Left blank if uploading later.
                      </span>
                    </div>
                  </button>
                )}

                {/* Alt text field */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#365555] mb-1">
                    Logo Alt Text
                  </label>
                  <input
                    type="text"
                    value={logoAlt}
                    onChange={(e) => setLogoAlt(e.target.value)}
                    placeholder="e.g. Inland Revenue Department Official Emblem"
                    className="w-full h-9 rounded-xl border border-[#D6E3DD] px-3 text-xs text-[#143F40] outline-none focus:border-[#168A4A]"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Right Live Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sticky top-20">
            <div className="rounded-2xl border border-[#E2ECE6] bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#EDF2EF] pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#023A51]">
                  <Eye className="size-3.5 text-[#2CBC63]" />
                  <span>PUBLIC CARD PREVIEW</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#14864B] bg-[#EAF7F0] px-2 py-0.5 rounded-full">
                  Live Preview
                </span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                This is how the authority card appears on the public directory:
              </p>

              {/* Exact Public Card Representation */}
              <div className="pt-2">
                <div className="relative bg-white rounded-3xl border border-[#E8EBEF] p-5 sm:p-6 shadow-sm flex items-start gap-4 sm:gap-5">
                  {/* LEFT: Square Logo */}
                  <div className="w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] aspect-square rounded-2xl bg-[#F8FAFC] border border-[#E8EBEF] p-2 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                    {previewLogo ? (
                      <Image
                        src={previewLogo}
                        alt={previewPortal.logo_alt}
                        width={80}
                        height={80}
                        unoptimized
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full rounded-xl border border-dashed border-[#D2DCE2] bg-white flex items-center justify-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        LOGO
                      </div>
                    )}
                  </div>

                  {/* RIGHT: Details Column (Category, Name (Short Form), URL, Description) */}
                  <div className="flex-1 min-w-0 space-y-1.5 pr-6">
                    <span className="text-[10px] font-bold text-[#2CBC63] uppercase tracking-wider block truncate">
                      {previewPortal.category}
                    </span>
                    <h3 className="text-[15px] sm:text-[16px] font-bold text-[#023A51] leading-snug">
                      {previewDisplayName}
                    </h3>
                    <p className="text-[11.5px] font-mono text-[#59667D] truncate">
                      {previewCleanUrl}
                    </p>
                    <p className="text-xs text-[#4A5259] leading-relaxed line-clamp-2">
                      {previewPortal.description}
                    </p>
                  </div>

                  {/* BOTTOM RIGHT: External Link Icon (matching sketch) */}
                  <div className="absolute right-4 bottom-4 p-1 rounded-lg text-slate-400">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: DIRECTORY LIST VIEW (CMS CARDS - NO VISIT BUTTON AS REQUESTED)
  // =========================================================================
  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-16">
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Remove Regulatory Portal?"
        message={`Are you sure you want to remove "${deleteTarget?.name}"? It will no longer be visible on the public regulatory directory.`}
        confirmText="Remove Portal"
        isDestructive
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <header className="flex flex-col gap-4 rounded-2xl border border-[#E2ECE6] bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#14864B]">
            <Landmark className="size-3.5" />
            <span>RESOURCES / DIRECTORY</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#023A51] mt-1">
            Official Regulatory Portals ({governmentLinks.length})
          </h1>
          <p className="text-xs text-[#59667D] mt-0.5">
            Manage government authorities, statutory bodies, and official portal links for public visitors.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/resources/downloads"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D8E4DE] px-3.5 py-2 text-xs font-semibold text-[#023A51] hover:bg-[#F5FAF7] transition-colors"
          >
            <Eye className="size-3.5 text-[#2CBC63]" />
            <span>View Public Page</span>
          </Link>

          <button
            type="button"
            onClick={() => openEditor()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#023A51] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#14864B] transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add Regulatory Portal</span>
          </button>
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

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-[#E2ECE6] bg-white p-3.5 shadow-xs">
        <div className="relative flex-1">
          <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search authority name, acronym, URL, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 rounded-xl border border-[#D6E3DD] pl-9 pr-3 text-xs text-[#143F40] outline-none focus:border-[#168A4A]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categoriesList.slice(0, 5).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                selectedCategoryFilter === cat
                  ? 'bg-[#023A51] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cards (CMS structure with ~20-25% square logo, NO visit button in CMS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleLinks.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-[#D9E5DF] bg-white p-12 text-center">
            <Landmark className="mx-auto size-8 text-slate-300 mb-2" />
            <h3 className="text-sm font-bold text-[#023A51]">No regulatory portals found</h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
              {search || selectedCategoryFilter !== 'All'
                ? 'Try clearing the search or category filter.'
                : 'Click "Add Regulatory Portal" to add an authority.'}
            </p>
          </div>
        ) : (
          visibleLinks.map((portal) => {
            const logo = getPortalLogo(portal);
            const cleanUrl = portal.url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
            const displayName =
              portal.short_name &&
              !portal.name.toLowerCase().includes(`(${portal.short_name.toLowerCase()})`)
                ? `${portal.name} (${portal.short_name})`
                : portal.name;

            return (
              <div
                key={portal.id}
                className="relative bg-white rounded-3xl border border-[#E8EBEF] p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-[#CCD7DC] transition-all duration-300 flex items-start gap-4 sm:gap-5 group"
              >
                {/* LEFT: Square Logo */}
                <div className="w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] aspect-square rounded-2xl bg-[#F8FAFC] border border-[#E8EBEF] p-2 flex items-center justify-center shrink-0 shadow-xs overflow-hidden group-hover:border-[#2CBC63]/40 transition-colors">
                  {logo ? (
                    <Image
                      src={logo}
                      alt={portal.logo_alt || `${portal.name} Logo`}
                      width={80}
                      height={80}
                      unoptimized
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl border border-dashed border-[#D2DCE2] bg-white flex items-center justify-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      LOGO
                    </div>
                  )}
                </div>

                {/* RIGHT: Details Column (Category, Name (Short Form), URL, Description) */}
                <div className="flex-1 min-w-0 space-y-1.5 pb-8 sm:pb-6">
                  <span className="text-[10px] font-bold text-[#2CBC63] uppercase tracking-wider block truncate">
                    {portal.category || 'Regulatory Authority'}
                  </span>
                  <h3 className="text-[15px] sm:text-[16px] font-bold text-[#023A51] leading-snug">
                    {displayName}
                  </h3>
                  <p className="text-[11.5px] font-mono text-[#59667D] truncate">
                    {cleanUrl}
                  </p>
                  <p className="text-xs text-[#4A5259] leading-relaxed line-clamp-2">
                    {portal.description || 'Official statutory portal.'}
                  </p>
                </div>

                {/* BOTTOM RIGHT: Management Buttons (Edit & Remove) */}
                <div className="absolute right-4 bottom-4 flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => openEditor(portal)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-[#023A51] hover:bg-[#F0FAF4] hover:text-[#168A4A] transition-colors cursor-pointer"
                    title="Edit Portal"
                  >
                    <Pencil className="size-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(portal)}
                    className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove Portal"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
