'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Users,
  Download,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  FileText,
} from 'lucide-react';

export default function AdminApplicationsPage() {
  const { applications, updateApplicationStatus } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = applications.filter((app) => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Candidate Applications & CV Vault
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review uploaded CVs, filter applicants, and update hiring workflow states.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 text-xs">
          {['all', 'new', 'review', 'shortlisted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded capitalize font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">No applications matching filter</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filtered.map((app) => (
              <div key={app.id} className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-bold text-slate-900">
                        {app.applicant_name}
                      </h2>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          app.status === 'new'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : app.status === 'shortlisted'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : app.status === 'review'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Applied for: <strong className="text-slate-900">{app.vacancy_title}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={`/api/admin/applications/${encodeURIComponent(app.id)}/cv`}
                      target="_blank"
                      rel="noreferrer"
                      aria-disabled={!app.cv_file_url}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold ${app.cv_file_url ? 'bg-slate-900 text-white hover:bg-slate-800' : 'pointer-events-none bg-slate-200 text-slate-500'}`}
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>{app.cv_file_url ? `Download CV (${app.cv_filename})` : 'CV not available'}</span>
                    </a>
                  </div>
                </div>

                {/* Candidate Details & Note */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                  <div className="flex flex-wrap items-center gap-6 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`mailto:${app.applicant_email}`} className="text-slate-800 hover:underline">
                        {app.applicant_email}
                      </a>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`tel:${app.applicant_phone}`} className="text-slate-800 hover:underline">
                        {app.applicant_phone}
                      </a>
                    </span>
                    <span className="text-slate-400 font-mono">
                      Received: {app.submitted_at}
                    </span>
                  </div>

                  {app.cover_note && (
                    <div className="pt-2 text-slate-700 leading-relaxed border-t border-slate-200">
                      <strong>Applicant Note:</strong> {app.cover_note}
                    </div>
                  )}
                </div>

                {/* Status Updater Buttons */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-500 font-medium">Update Status:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateApplicationStatus(app.id, 'review')}
                      className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-semibold"
                    >
                      Mark In Review
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(app.id, 'shortlisted')}
                      className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-semibold"
                    >
                      Shortlist Candidate
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(app.id, 'rejected')}
                      className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
