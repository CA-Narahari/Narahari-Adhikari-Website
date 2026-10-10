'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  MapPin,
  Upload,
  ArrowRight,
  Check,
  X,
  User,
  Mail,
  Phone,
  FileText,
  Building,
  GraduationCap,
  AlertCircle,
  FileCheck,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { Vacancy } from '@/types';

export default function CareersPage() {
  const { settings, vacancies, vacanciesLoaded } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Modal Step State: 1 = Personal Details, 2 = Resume & Experience
  const [modalStep, setModalStep] = useState<1 | 2>(1);

  // Form Fields
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [qualification, setQualification] = useState('ICAN CAP-II Qualified');
  const [coverNote, setCoverNote] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(true);

  // Submission States
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepError, setStepError] = useState('');
  const [submissionError, setSubmissionError] = useState('');

  // If recruitment is disabled globally in admin
  if (!settings.careers_enabled) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-28 text-center bg-[#FAFCFD]">
        <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center mx-auto mb-6 text-slate-500">
          <Briefcase className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#023A51] tracking-tight mb-3">
          Recruitment Window Currently Closed
        </h1>
        <p className="text-sm text-[#4A5259] max-w-md mx-auto leading-relaxed mb-8">
          We are not actively accepting new trainee or permanent employment applications at this moment. You may reach out directly for future openings.
        </p>
        <Link
          href="/"
          className="px-7 py-3 bg-[#023A51] text-white rounded-full text-xs font-bold hover:bg-[#034B68] transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  const activeVacancies = vacancies.filter((v) => v.is_active);

  const filteredVacancies = activeVacancies.filter((v) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Articleship') return v.employment_type.toLowerCase().includes('article');
    if (activeFilter === 'Audit') return v.department.toLowerCase().includes('audit');
    if (activeFilter === 'Tax') return v.department.toLowerCase().includes('tax');
    return true;
  });

  const handleOpenApply = (vacancy: Vacancy) => {
    setSelectedVacancy(vacancy);
    setModalStep(1);
    setStepError('');
    setSubmissionError('');
    setSubmitted(false);
    setIsApplyModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsApplyModalOpen(false);
    setModalStep(1);
    setStepError('');
    setSubmissionError('');
    setSubmitted(false);
  };

  const validateFile = (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      setStepError('Please upload a PDF or Microsoft Word document (.pdf, .doc, .docx).');
      return false;
    }
    if (file.size === 0 || file.size > 10 * 1024 * 1024) {
      setStepError('File size must be under 10 MB.');
      return false;
    }
    setStepError('');
    return true;
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateFile(file)) {
        setCvFile(file);
      } else {
        e.target.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (validateFile(file)) {
        setCvFile(file);
      }
    }
  };

  const handleProceedToStep2 = () => {
    setStepError('');
    if (!applicantName.trim()) {
      setStepError('Please enter your full name.');
      return;
    }
    if (!applicantEmail.trim() || !applicantEmail.includes('@')) {
      setStepError('Please enter a valid email address.');
      return;
    }
    if (!applicantPhone.trim() || applicantPhone.length < 7) {
      setStepError('Please enter a valid phone number.');
      return;
    }
    setModalStep(2);
  };

  const handleSubmitApplication = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionError('');

    if (!cvFile) {
      setSubmissionError('Please attach your CV before submitting.');
      return;
    }
    if (!privacyConsent) {
      setSubmissionError('Please consent to the privacy policy to submit your application.');
      return;
    }
    if (!selectedVacancy) return;

    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.set('name', applicantName.trim());
      form.set('email', applicantEmail.trim());
      form.set('phone', applicantPhone.trim());
      form.set('qualification', qualification);
      form.set('note', coverNote.trim());
      form.set('vacancyId', selectedVacancy.id);
      form.set('vacancyTitle', selectedVacancy.title);
      form.set('cv', cvFile);
      form.set('privacy_consent', 'on');

      const response = await fetch('/api/applications', { method: 'POST', body: form });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setSubmissionError(result.error || 'We could not save your application. Please try again.');
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmissionError('We could not send your application. Check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="pb-28 overflow-x-hidden bg-[#FAFCFD]">
      {/* 1. Header Banner */}
      <section
        id="hero-section"
        className="relative bg-hero-gradient pt-8 pb-14 sm:pt-12 sm:pb-16 overflow-hidden border-b border-[#E2E8F0]"
      >
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              Careers & Opportunities<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-[17px] text-[#4A5259] leading-relaxed">
              Explore professional positions and ICAN articleship opportunities with Narahari Adhikari. We mentor talent with rigorous practical exposure in statutory audit, taxation, and advisory.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Vacancies List */}
      <div className="max-w-[1240px] mx-auto px-6 pt-10 sm:pt-14 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8EBEF] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#023A51]">
              Available Positions ({activeVacancies.length})
            </h2>
            <p className="text-xs text-[#59667D] mt-0.5">
              Review current vacancies and submit your application online.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['All', 'Articleship', 'Audit', 'Tax'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === cat
                    ? 'bg-[#023A51] text-white shadow-xs'
                    : 'bg-white border border-[#DCE4EC] text-[#59667D] hover:text-[#023A51]'
                }`}
              >
                {cat === 'All' ? 'All Openings' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Vacancy Cards Grid */}
        {!vacanciesLoaded ? (
          <div role="status" className="border border-[#E8EBEF] rounded-2xl bg-white px-6 py-16 text-center text-sm text-[#59667D]">
            Loading current vacancies from practice registry…
          </div>
        ) : filteredVacancies.length === 0 ? (
          <div className="border border-[#E8EBEF] rounded-2xl bg-white px-6 py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#023A51]">
              {activeVacancies.length === 0 ? 'No open vacancies at the moment' : 'No openings match this category'}
            </h3>
            <p className="text-sm text-[#59667D] max-w-md mx-auto">
              Please check back periodically or send your credentials directly through our contact portal for upcoming recruitment sessions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredVacancies.map((vac) => (
              <div
                key={vac.id}
                className="bg-white rounded-3xl border border-[#DCE4EC] p-7 sm:p-8 shadow-[0_4px_25px_rgba(2,58,81,0.04)] hover:shadow-xl hover:border-[#023A51]/30 transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#023A51] bg-[#E8F4F8] px-3.5 py-1 rounded-full border border-[#DCE4EC]">
                      {vac.department}
                    </span>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      {vac.employment_type}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#023A51] leading-snug">
                    {vac.title}
                  </h3>

                  <p className="text-xs sm:text-[14px] text-[#4A5259] leading-relaxed">
                    {vac.description}
                  </p>

                  {/* Requirements list */}
                  {vac.requirements && vac.requirements.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Candidate Requirements:
                      </span>
                      {vac.requirements.map((req, rIdx) => (
                        <div key={rIdx} className="flex items-start gap-2.5 text-xs text-[#023A51]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2CBC63] shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-5 border-t border-[#E8EBEF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#59667D]">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#2CBC63]" />
                      {vac.location}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Due: {vac.deadline}
                    </span>
                    {vac.attachment_url && (
                      <a
                        href={vac.attachment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#023A51] hover:underline font-bold"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#2CBC63]" />
                        <span>JD Document (PDF)</span>
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenApply(vac)}
                    className="px-6 py-2.5 rounded-full bg-[#023A51] hover:bg-[#034B68] text-white font-bold text-xs transition-all inline-flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>Apply for this Role</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. REBUILT DIRECT APPLICATION MODAL WITH STEP UX & DRAG-AND-DROP */}
      {isApplyModalOpen && selectedVacancy && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#023A51]/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-[28px] border border-[#DCE4EC] shadow-[0_25px_60px_rgba(2,58,81,0.25)] max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-7 border-b border-[#E8EBEF] flex items-start justify-between gap-4 bg-white shrink-0">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#023A51] bg-[#E8F4F8] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Direct Application
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#023A51]">
                  {selectedVacancy.title}
                </h3>
                <p className="text-xs text-[#59667D]">
                  {selectedVacancy.department} • {selectedVacancy.location}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#023A51] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Wizard Bar (Hidden after submission) */}
            {!submitted && (
              <div className="bg-[#F8FAFC] border-b border-[#E8EBEF] px-6 sm:px-7 py-3 flex items-center justify-between text-xs shrink-0">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      modalStep === 1 ? 'bg-[#023A51] text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {modalStep === 2 ? <Check className="w-3.5 h-3.5" /> : '1'}
                  </div>
                  <span className={`font-semibold ${modalStep === 1 ? 'text-[#023A51]' : 'text-slate-500'}`}>
                    Candidate Profile
                  </span>
                </div>

                <div className="w-8 h-[1px] bg-slate-300" />

                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      modalStep === 2 ? 'bg-[#023A51] text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    2
                  </div>
                  <span className={`font-semibold ${modalStep === 2 ? 'text-[#023A51]' : 'text-slate-500'}`}>
                    CV & Statement
                  </span>
                </div>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 sm:p-7 overflow-y-auto flex-1">
              {submitted ? (
                /* Success Screen */
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-extrabold text-[#023A51]">
                    Application Submitted Successfully
                  </h4>
                  <p className="text-xs sm:text-sm text-[#4A5259] leading-relaxed max-w-md mx-auto">
                    Thank you, <strong>{applicantName}</strong>. Your application for <strong>{selectedVacancy.title}</strong> has been transmitted to our recruitment desk.
                  </p>
                  <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#DCE4EC] max-w-md mx-auto text-left text-xs space-y-1 text-[#4A5259]">
                    <div><strong>Applicant:</strong> {applicantName}</div>
                    <div><strong>Email:</strong> {applicantEmail}</div>
                    <div><strong>Phone:</strong> {applicantPhone}</div>
                    <div><strong>Attached CV:</strong> {cvFile?.name}</div>
                  </div>
                  <div className="pt-4">
                    <Button
                      onClick={handleCloseModal}
                      className="rounded-full px-8 bg-[#023A51] hover:bg-[#034B68] text-white"
                    >
                      Close Window
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {stepError && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{stepError}</span>
                    </div>
                  )}

                  {/* STEP 1: Candidate Profile */}
                  {modalStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <Input
                            type="text"
                            required
                            value={applicantName}
                            onChange={(e) => setApplicantName(e.target.value)}
                            placeholder="e.g. Samyog Adhikari"
                            className="pl-10 h-11 text-sm rounded-xl border-[#DCE4EC] focus-visible:ring-[#023A51]/20"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                            Email Address <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                            <Input
                              type="email"
                              required
                              value={applicantEmail}
                              onChange={(e) => setApplicantEmail(e.target.value)}
                              placeholder="name@domain.com"
                              className="pl-10 h-11 text-sm rounded-xl border-[#DCE4EC] focus-visible:ring-[#023A51]/20"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                            Phone Number <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                            <Input
                              type="tel"
                              required
                              value={applicantPhone}
                              onChange={(e) => setApplicantPhone(e.target.value)}
                              placeholder="(+977) 98XXXXXXXX"
                              className="pl-10 h-11 text-sm rounded-xl border-[#DCE4EC] focus-visible:ring-[#023A51]/20"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                          Academic / Professional Level <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <select
                            value={qualification}
                            onChange={(e) => setQualification(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-[#DCE4EC] bg-white text-[#023A51] focus:outline-none focus:ring-2 focus:ring-[#023A51]/20 cursor-pointer"
                          >
                            <option value="ICAN CAP-II Qualified">ICAN CAP-II Qualified</option>
                            <option value="ICAN CAP-III / Articleship Completed">ICAN CAP-III / Articleship Completed</option>
                            <option value="Semi-Qualified Accounting Professional">Semi-Qualified Accounting Professional</option>
                            <option value="ACCA Affiliate / Member">ACCA Affiliate / Member</option>
                            <option value="Masters / MBS / MBA in Finance">Masters in Accounting / MBA</option>
                            <option value="Bachelors (BBA / BBS)">Bachelors (BBA / BBS)</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button
                          type="button"
                          onClick={handleProceedToStep2}
                          className="h-11 w-full rounded-full bg-[#023A51] hover:bg-[#034B68] text-white font-bold text-sm inline-flex items-center justify-center gap-2"
                        >
                          <span>Next: Upload CV & Experience</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: CV Upload & Experience Statement */}
                  {modalStep === 2 && (
                    <form onSubmit={handleSubmitApplication} className="space-y-4">
                      {/* Drag and Drop CV Upload Container */}
                      <div>
                        <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                          Curriculum Vitae (PDF or DOCX) <span className="text-rose-500">*</span>
                        </label>

                        {!cvFile ? (
                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer relative ${
                              isDragging
                                ? 'border-[#023A51] bg-[#E8F4F8]'
                                : 'border-[#CCD7DC] bg-[#F8FAFC] hover:border-[#023A51]'
                            }`}
                          >
                            <input
                              id="cv-upload-input"
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileInputChange}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#DCE4EC] flex items-center justify-center mx-auto mb-2 text-[#023A51]">
                              <Upload className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-[#023A51] block mb-0.5">
                              Click to choose file or drag & drop here
                            </span>
                            <span className="text-[11px] text-[#59667D]">
                              PDF, DOC, DOCX up to 10MB
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/60">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                                <FileCheck className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#023A51] truncate">
                                  {cvFile.name}
                                </p>
                                <p className="text-[11px] text-[#59667D]">
                                  {formatFileSize(cvFile.size)} • Ready to upload
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setCvFile(null)}
                              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors"
                              title="Remove file"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Brief Statement / Cover Note */}
                      <div>
                        <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                          Brief Statement or Relevant Experience (Optional)
                        </label>
                        <Textarea
                          rows={3}
                          value={coverNote}
                          onChange={(e) => setCoverNote(e.target.value)}
                          placeholder="Briefly state your accounting background, audit engagements, or ICAN exam session..."
                          className="min-h-20 text-xs sm:text-sm rounded-xl border-[#DCE4EC] focus-visible:ring-[#023A51]/20"
                        />
                      </div>

                      {/* Privacy Consent Checkbox */}
                      <label className="flex items-start gap-2.5 text-xs text-[#59667D] cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={privacyConsent}
                          onChange={(e) => setPrivacyConsent(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded text-[#023A51] accent-[#023A51] cursor-pointer"
                        />
                        <span>
                          I confirm my application details and CV are accurate and agree to allow the practice to review my profile for employment.
                        </span>
                      </label>

                      {submissionError && (
                        <p role="alert" className="text-xs font-bold text-rose-600">
                          {submissionError}
                        </p>
                      )}

                      <div className="pt-2 flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setModalStep(1)}
                          className="h-11 rounded-full px-5 border-[#DCE4EC] text-[#023A51]"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="h-11 flex-1 rounded-full bg-[#023A51] hover:bg-[#034B68] text-white font-bold text-xs sm:text-sm shadow-md"
                        >
                          {isSubmitting ? 'Transmitting application...' : 'Submit Application'}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
