'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

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
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewReqs('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Careers & Recruitment Control
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded text-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Vacancy</span>
          </button>
        </div>
      </div>

      {/* MASTER HIRING SWITCH CARD */}
      <div className="bg-white border-2 border-slate-300 rounded-xl p-6 shadow-sm">
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
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg font-bold text-xs shadow transition-all ${
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
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
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
                <div className="text-[11px] text-slate-400 font-mono pt-1">
                  Location: {vac.location} | Deadline: {vac.deadline}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <button
                  onClick={() => updateVacancy(vac.id, { is_active: !vac.is_active })}
                  className={`px-3 py-1.5 rounded text-xs font-semibold border ${
                    vac.is_active
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  {vac.is_active ? 'Active' : 'Archived'}
                </button>

                <button
                  onClick={() => {
                    if (confirm('Delete this vacancy listing?')) {
                      deleteVacancy(vac.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100"
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
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-3">
              Post a New Vacancy
            </h3>

            <form onSubmit={handleCreateVacancy} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tax Consultant"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Employment Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as typeof newType)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Article Trainee">Article Trainee</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Application deadline</label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Job Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summary of responsibilities..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Candidate Requirements (1 per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Semi-qualified CA&#10;2+ years experience in audit..."
                  value={newReqs}
                  onChange={(e) => setNewReqs(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded"
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
