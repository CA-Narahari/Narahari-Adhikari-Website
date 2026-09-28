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
        <h1 className="text-3xl font-bold text-[#023A51] tracking-tight mb-3">
          Recruitment Window Currently Closed
        </h1>
        <p className="text-sm text-[#4A5259] max-w-md mx-auto leading-relaxed mb-8">
          {settings.company_name} is not accepting new employment or article trainee applications at this time. Our recruitment cycles open periodically based on engagement demands.
        </p>
        <div className="inline-flex gap-4">
          <Link
            href="/"
            className="px-5 py-2.5 bg-[#023A51] text-white rounded-lg text-xs font-semibold hover:bg-[#034e6d] transition-colors"
          >
            Return to Homepage
          </Link>
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-slate-100 text-[#023A51] border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors"
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
    <div className="space-y-16 pb-20 overflow-x-hidden">
      {/* 1. Hero Header */}
      <section className="relative bg-hero-gradient pt-10 pb-16 lg:pt-14 lg:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2CBC63]">
              Careers & Traineeships
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#023A51] leading-[1.12] tracking-tight">
              Build your accounting career with us<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#33475B] font-normal leading-relaxed max-w-2xl">
              Join a culture of professional skepticism, rigorous audit practice, and rapid skill progression. We provide direct mentorship and hands-on exposure to major corporate clients.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main Vacancies & Application Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Open Positions List */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-xl font-bold text-[#023A51] border-l-4 border-[#2CBC63] pl-3">
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
                    className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#2CBC63] bg-white shadow-md ring-2 ring-[#2CBC63]/30'
                        : 'border-[#E8EBEF] bg-white hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[11px] font-semibold text-[#2CBC63] bg-[#2CBC63]/10 px-2.5 py-0.5 rounded-full">
                          {vac.department}
                        </span>
                        <h3 className="text-lg font-bold text-[#023A51] mt-2">
                          {vac.title}
                        </h3>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full text-[#33475B]">
                        {vac.employment_type}
                      </span>
                    </div>

                    <p className="text-xs text-[#4A5259] leading-relaxed mb-4">
                      {vac.description}
                    </p>

                    <div className="space-y-1.5 pt-3 border-t border-[#E8EBEF] text-xs text-[#33475B]">
                      <span className="font-bold text-[11px] text-[#023A51] block mb-1">
                        Candidate Requirements:
                      </span>
                      {vac.requirements.map((req, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2CBC63] shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#59667D] pt-4 mt-4 border-t border-[#E8EBEF] font-mono">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#2CBC63]" />
                        {vac.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#59667D]" />
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
            <div className="bg-white border border-[#E8EBEF] rounded-2xl p-6 sm:p-8 shadow-xs sticky top-28">
              <div className="border-b border-[#E8EBEF] pb-4 mb-6">
                <span className="text-xs font-bold text-[#2CBC63] uppercase tracking-wide">
                  Application Portal
                </span>
                <h3 className="text-2xl font-bold text-[#023A51] mt-1">
                  Apply for Position
                </h3>
                {selectedVacancy && (
                  <p className="text-xs text-[#59667D] mt-1">
                    Selected role: <strong className="text-[#023A51]">{selectedVacancy.title}</strong>
                  </p>
                )}
              </div>

              {submitted ? (
                <div className="p-8 text-center bg-[#2CBC63]/10 border border-[#2CBC63]/30 rounded-xl space-y-4">
                  <FileCheck className="w-12 h-12 text-[#2CBC63] mx-auto" />
                  <h4 className="text-lg font-bold text-[#023A51]">
                    Application Successfully Submitted!
                  </h4>
                  <p className="text-xs text-[#33475B] leading-relaxed max-w-sm mx-auto">
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
                    className="mt-4 px-5 py-2 bg-[#023A51] text-white rounded-lg text-xs font-semibold hover:bg-[#034e6d] cursor-pointer"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#023A51] mb-1">
                      Applying Position *
                    </label>
                    <select
                      value={selectedVacancyId}
                      onChange={(e) => setSelectedVacancyId(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-[#023A51] focus:ring-1 focus:ring-[#2CBC63] focus:outline-none"
                    >
                      {activeVacancies.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.title} ({v.department})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#023A51] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Adhikari"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-[#023A51] focus:ring-1 focus:ring-[#2CBC63] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#023A51] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="yourname@domain.com"
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-[#023A51] focus:ring-1 focus:ring-[#2CBC63] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#023A51] mb-1">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+977 98XXXXXXXX"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-[#023A51] focus:ring-1 focus:ring-[#2CBC63] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* CV File Upload Field */}
                  <div>
                    <label className="block font-semibold text-[#023A51] mb-1">
                      Attach CV / Resume (PDF / DOCX) *
                    </label>
                    <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-[#2CBC63] bg-slate-50/50 transition-colors">
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
                          <span className="text-[#2CBC63] font-bold font-mono">
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
                    <label className="block font-semibold text-[#023A51] mb-1">
                      Brief Statement / Qualifications Note
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Outline your examination status (ICAN/ACCA), relevant audit engagements, and earliest availability date..."
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-[#023A51] focus:ring-1 focus:ring-[#2CBC63] focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4 ml-1" />
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
