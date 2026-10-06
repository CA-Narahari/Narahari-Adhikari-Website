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
  CheckCircle,
  Users,
  MapPin,
  Clock,
  AlertTriangle,
  Upload,
  FileText,
  Loader2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function AdminCareersPage() {
  const { settings, toggleCareers, vacancies, addVacancy, updateVacancy, deleteVacancy, applications } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDepartment, setNewDepartment] = useState('Assurance & Audit');
  const [newType, setNewType] = useState<'Full-time' | 'Part-time' | 'Contract' | 'Article Trainee'>('Full-time');
  const [newLocation, setNewLocation] = useState('Kathmandu Office (On-site)');
  const [newDesc, setNewDesc] = useState('');
  const [newReqs, setNewReqs] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');

  // Attachment upload state
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Deletion confirm modal state
  const [vacancyToDelete, setVacancyToDelete] = useState<{ id: string; title: string } | null>(null);

  const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAttachment(true);
    setAttachmentError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'website-media');
      formData.append('folder', 'careers');

      const res = await fetch('/api/admin/storage/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload document');
      }

      setNewAttachmentUrl(data.publicUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setAttachmentError(msg);
    } finally {
      setIsUploadingAttachment(false);
    }
  };

  const handleCreateVacancy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) {
      alert('Please fill out position title and description.');
      return;
    }

    addVacancy({
      title: newTitle,
      department: newDepartment,
      location: newLocation,
      employment_type: newType,
      description: newDesc,
      requirements: newReqs.split('\n').filter((r) => r.trim().length > 0),
      deadline: newDeadline,
      is_active: true,
      attachment_url: newAttachmentUrl || undefined,
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewReqs('');
    setNewDeadline('');
    setNewAttachmentUrl('');
  };

  const confirmDelete = () => {
    if (!vacancyToDelete) return;
    deleteVacancy(vacancyToDelete.id);
    setVacancyToDelete(null);
  };

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
        onConfirm={confirmDelete}
        onCancel={() => setVacancyToDelete(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Careers &amp; Recruitment Control
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Toggle the public hiring page on or off and manage open firm vacancies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold border border-slate-300 transition-colors"
          >
            <Users className="w-4 h-4 text-slate-600" />
            <span>View CV Vault ({applications.length})</span>
          </Link>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0C4A4E] hover:bg-[#083639] text-white font-bold rounded text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Vacancy</span>
          </button>
        </div>
      </div>

      {/* MASTER HIRING SWITCH CARD */}
      <div className="bg-white border-2 border-slate-300 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                Master Public Hiring Toggle:
              </span>
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-extrabold uppercase ${
                  settings.careers_enabled
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-red-100 text-red-900 border border-red-300'
                }`}
              >
                {settings.careers_enabled ? 'Active (ON)' : 'Disabled (OFF)'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              {settings.careers_enabled
                ? 'The "Careers" link is currently VISIBLE in the public navigation bar. Visitors can browse openings and upload their CVs.'
                : 'The "Careers" link is completely HIDDEN from the public navigation bar. Visiting /careers shows an on-brand recruitment closed notice.'}
            </p>
          </div>

          <button
            onClick={() => toggleCareers()}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg font-bold text-xs shadow transition-all cursor-pointer ${
              settings.careers_enabled
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            {settings.careers_enabled ? (
              <>
                <ToggleRight className="w-5 h-5 text-emerald-200" />
                <span>Switch Hiring OFF</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-5 h-5 text-slate-400" />
                <span>Switch Hiring ON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Vacancy Listings Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Registered Job Postings ({vacancies.length})
          </h2>
        </div>

        <div className="divide-y divide-slate-200">
          {vacancies.map((vac) => (
            <div key={vac.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {vac.department}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs font-mono text-slate-500">{vac.employment_type}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{vac.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{vac.description}</p>
                <div className="text-[11px] text-slate-400 font-mono pt-1 flex flex-wrap items-center gap-3">
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

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <button
                  onClick={() => updateVacancy(vac.id, { is_active: !vac.is_active })}
                  className={`px-3 py-1.5 rounded text-xs font-semibold border cursor-pointer ${
                    vac.is_active
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  {vac.is_active ? 'Active' : 'Archived'}
                </button>

                <button
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

      {/* New Vacancy Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-3">
              Post a New Vacancy
            </h3>

            <form onSubmit={handleCreateVacancy} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Tax Consultant"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1A8F4B]"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1A8F4B]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Employment Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as typeof newType)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1A8F4B]"
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
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1A8F4B]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Application deadline</label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1A8F4B]"
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
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1A8F4B]"
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
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1A8F4B]"
                />
              </div>

              {/* Vacancy JD Attachment Upload */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-slate-800">
                    JD Document / Attachment (Optional PDF)
                  </label>
                  {newAttachmentUrl && (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Attached</span>
                    </span>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleAttachmentUpload}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-slate-300 hover:border-[#1A8F4B] bg-white rounded-lg p-2.5 text-center cursor-pointer transition-colors"
                >
                  {isUploadingAttachment ? (
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold py-1">
                      <Loader2 className="w-4 h-4 animate-spin text-[#1A8F4B]" />
                      <span>Uploading to Supabase storage...</span>
                    </div>
                  ) : newAttachmentUrl ? (
                    <div className="text-[11px] text-[#1A8F4B] font-semibold flex items-center justify-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span className="truncate max-w-xs">{newAttachmentUrl}</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500">
                      <span className="font-bold text-[#1A8F4B]">Click to browse PDF</span> or drag file here
                    </div>
                  )}
                </div>

                {attachmentError && (
                  <p className="text-[11px] text-rose-600">{attachmentError}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0C4A4E] hover:bg-[#083639] text-white font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Publish Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
