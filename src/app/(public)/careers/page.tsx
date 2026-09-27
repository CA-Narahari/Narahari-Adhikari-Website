'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  MapPin,
  Upload,
  AlertCircle,
  FileCheck,
  Send,
  Building,
} from 'lucide-react';

export default function CareersPage() {
  const { settings, vacancies, addApplication } = useApp();

  const [selectedVacancyId, setSelectedVacancyId] = useState<string>(
    vacancies[0]?.id || ''
  );
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [cvFileName, setCvFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // If Careers is switched OFF in the Admin Panel
  if (!settings.careers_enabled) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center mx-auto mb-6 text-slate-500">
          <Briefcase className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
          Recruitment Window Currently Closed
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-8">
          {settings.company_name} is not accepting new employment or article trainee applications at this time. Our recruitment cycles open periodically based on engagement demands.
        </p>
        <div className="inline-flex gap-4">
          <Link
            href="/"
            className="px-5 py-2.5 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Return to Homepage
          </Link>
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-semibold hover:bg-slate-200 transition-colors"
          >
            General Inquiries
          </Link>
        </div>
      </div>
    );
  }

  const activeVacancies = vacancies.filter((v) => v.is_active);
  const selectedVacancy = vacancies.find((v) => v.id === selectedVacancyId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail || !applicantPhone || !selectedVacancy) {
      alert('Please fill out all required fields.');
      return;
    }

    addApplication({
      vacancy_id: selectedVacancy.id,
      vacancy_title: selectedVacancy.title,
      applicant_name: applicantName,
      applicant_email: applicantEmail,
      applicant_phone: applicantPhone,
      cover_note: coverNote,
      cv_filename: cvFileName || 'Resume_Applicant.pdf',
      status: 'new',
    });

    setSubmitted(true);
  };

  return (
    <div className="space-y-16 py-12">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span>Recruitment Active • Application Window Open</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Build Your Accounting Career With Us
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Join a culture of professional skepticism, rigorous audit practice, and rapid skill progression. Submit your credentials directly below.
          </p>
        </div>
      </section>

      {/* Main Vacancies & Application Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Open Positions List */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-amber-600 pl-3">
              Open Positions ({activeVacancies.length})
            </h2>

            <div className="space-y-4">
              {activeVacancies.map((vac) => {
                const isSelected = selectedVacancyId === vac.id;
                return (
                  <div
                    key={vac.id}
                    onClick={() => {
                      setSelectedVacancyId(vac.id);
                      setSubmitted(false);
                    }}
                    className={`p-6 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-white shadow-md ring-1 ring-slate-900'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                          {vac.department}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-2">
                          {vac.title}
                        </h3>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded text-slate-700">
                        {vac.employment_type}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {vac.description}
                    </p>

                    <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-700">
                      <span className="font-bold text-[11px] text-slate-900 block mb-1">
                        Candidate Requirements:
                      </span>
                      {vac.requirements.map((req, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-4 mt-4 border-t border-slate-100 font-mono">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {vac.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        Deadline: {vac.deadline}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Direct Application Form + CV Upload */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm sticky top-28">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                  Application Submission Portal
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  Apply for Position
                </h3>
                {selectedVacancy && (
                  <p className="text-xs text-slate-500 mt-1">
                    Applying for: <strong className="text-slate-800">{selectedVacancy.title}</strong>
                  </p>
                )}
              </div>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-lg space-y-4">
                  <FileCheck className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-emerald-900">
                    Application Successfully Submitted!
                  </h4>
                  <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
                    Your CV and application credentials have been logged into our hiring database. Our recruitment partners will review your profile shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setApplicantName('');
                      setApplicantEmail('');
                      setApplicantPhone('');
                      setCoverNote('');
                      setCvFileName('');
                    }}
                    className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded text-xs font-semibold hover:bg-emerald-800"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Applying Position *
                    </label>
                    <select
                      value={selectedVacancyId}
                      onChange={(e) => setSelectedVacancyId(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    >
                      {activeVacancies.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.title} ({v.department})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Adhikari"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="yourname@domain.com"
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+977 98XXXXXXXX"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* CV File Upload Field */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Attach CV / Resume (PDF / DOCX) *
                    </label>
                    <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-slate-400 bg-slate-50/50 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setCvFileName(file.name);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                      <div className="text-slate-600 font-medium text-xs">
                        {cvFileName ? (
                          <span className="text-emerald-700 font-bold font-mono">
                            {cvFileName}
                          </span>
                        ) : (
                          <span>Click to browse or drop your CV file here</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Accepted formats: PDF, DOCX (Max 10 MB)
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Brief Statement / Qualifications Note
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Outline your examination status (ICAN/ACCA), relevant audit engagements, and earliest availability date..."
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-md text-xs shadow transition-colors"
                    >
                      <Send className="w-4 h-4 text-amber-400" />
                      <span>Submit Application & CV</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
