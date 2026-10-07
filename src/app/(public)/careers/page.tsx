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
} from 'lucide-react';
import { Vacancy } from '@/types';

export default function CareersPage() {
  const { settings, vacancies, vacanciesLoaded } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Form Fields
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [qualification, setQualification] = useState('ICAN CAP-II Qualified');
  const [coverNote, setCoverNote] = useState('');
  const [cvFileName, setCvFileName] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          We are not actively accepting new article trainee or permanent employment applications at this moment. You may reach out directly for future openings.
        </p>
        <Link
          href="/"
          className="px-7 py-3 bg-[#023A51] text-white rounded-full text-xs font-bold hover:bg-[#2CBC63] transition-colors"
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
    setSubmitted(false);
    setIsApplyModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type) || file.size === 0 || file.size > 10 * 1024 * 1024) {
        setCvFile(null);
        setCvFileName('');
        setSubmissionError('Choose a non-empty PDF or Word CV under 10 MB.');
        e.target.value = '';
        return;
      }
      setSubmissionError('');
      setCvFile(file);
      setCvFileName(file.name);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionError('');
    if (!applicantName || !applicantEmail || !applicantPhone || !selectedVacancy || !cvFile) {
      setSubmissionError('Complete the required fields and attach your CV.');
      return;
    }

    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.set('name', applicantName);
      form.set('email', applicantEmail);
      form.set('phone', applicantPhone);
      form.set('qualification', qualification);
      form.set('note', coverNote);
      form.set('vacancyId', selectedVacancy.id);
      form.set('vacancyTitle', selectedVacancy.title);
      form.set('cv', cvFile);
      form.set('privacy_consent', 'on');
      const response = await fetch('/api/applications', { method: 'POST', body: form });
      const result = await response.json() as { error?: string };
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

  return (
    <div className="pb-28 overflow-x-hidden bg-[#FAFCFD]">
      {/* 1. Direct Vacancies Header */}
      <section
        id="hero-section"
        className="relative bg-hero-gradient pt-8 pb-14 sm:pt-12 sm:pb-16 overflow-hidden"
      >
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              Open Vacancies<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-[17px] text-[#4A5259] leading-relaxed">
              Active professional positions and ICAN articleship opportunities available at our Kathmandu practice. Submit your CV directly for consideration.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Vacancies List */}
      <div className="max-w-[1240px] mx-auto px-6 pt-10 sm:pt-14 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8EBEF] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#023A51]">
              Available Positions ({activeVacancies.length})
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['All', 'Articleship', 'Audit', 'Tax'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === cat
                    ? 'bg-[#023A51] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#023A51]'
                }`}
              >
                {cat === 'All' ? 'All Openings' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Vacancy Cards Grid */}
        {!vacanciesLoaded ? (
          <div role="status" className="border-y border-[#E8EBEF] bg-white px-6 py-12 text-center text-sm text-[#59667D]">Loading current vacancies…</div>
        ) : filteredVacancies.length === 0 ? (
          <div className="border-y border-[#E8EBEF] bg-white px-6 py-12 text-center">
            <h3 className="text-lg font-bold text-[#023A51]">
              {activeVacancies.length === 0 ? 'There are no open positions right now.' : 'No openings match this filter.'}
            </h3>
            <p className="mt-2 text-sm text-[#59667D]">
              Please check back later for new vacancies.
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredVacancies.map((vac) => (
            <div
              key={vac.id}
              className="bg-white rounded-3xl border border-[#E8EBEF] p-7 sm:p-8 shadow-xs hover:shadow-xl hover:border-[#CCD7DC] transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2CBC63] bg-[#E8F4F8] px-3 py-1 rounded-full">
                    {vac.department}
                  </span>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                    {vac.employment_type}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#023A51] leading-snug">
                  {vac.title}
                </h3>

                <p className="text-xs sm:text-[13.5px] text-[#4A5259] leading-relaxed">
                  {vac.description}
                </p>

                {/* Requirements list */}
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
              </div>

              {/* Card Footer: Metadata & Apply Button */}
              <div className="pt-5 border-t border-[#E8EBEF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#59667D]">
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
                      className="inline-flex items-center gap-1 text-[#2CBC63] hover:underline font-bold"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>JD Document (PDF)</span>
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenApply(vac)}
                  className="px-6 py-2.5 rounded-full bg-[#023A51] hover:bg-[#2CBC63] text-white font-bold text-xs transition-colors inline-flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
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

      {/* 3. DIRECT APPLICATION MODAL */}
      {isApplyModalOpen && selectedVacancy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl border border-[#CCD7DC] shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-[#E8EBEF] flex items-start justify-between gap-4 sticky top-0 bg-white z-10">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#2CBC63] uppercase tracking-wider">
                  Direct Application
                </span>
                <h3 className="text-2xl font-extrabold text-[#023A51]">
                  {selectedVacancy.title}
                </h3>
                <p className="text-xs text-[#59667D]">
                  {selectedVacancy.department} • {selectedVacancy.location}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#023A51] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-[#2CBC63]/15 rounded-full flex items-center justify-center mx-auto text-[#2CBC63]">
                    <Check className="w-9 h-9" />
                  </div>
                  <h4 className="text-2xl font-extrabold text-[#023A51]">
                    Application Submitted
                  </h4>
                  <p className="text-xs sm:text-sm text-[#4A5259] leading-relaxed max-w-md mx-auto">
                    Thank you, <strong>{applicantName}</strong>. Your application for <strong>{selectedVacancy.title}</strong> and CV have been received.
                  </p>
                  <p className="text-xs text-[#59667D]">
                    We will review your credentials and contact you at <strong>{applicantEmail}</strong> or <strong>{applicantPhone}</strong> if shortlisted for an interview.
                  </p>
                  <div className="pt-4">
                    <Button
                      onClick={() => setIsApplyModalOpen(false)}
                      className="rounded-full px-7"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <Input
                          type="text"
                          required
                          value={applicantName}
                          onChange={(e) => setApplicantName(e.target.value)}
                          placeholder="Your full name"
                          className="pl-10 h-11 text-xs sm:text-sm rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <Input
                          type="tel"
                          required
                          value={applicantPhone}
                          onChange={(e) => setApplicantPhone(e.target.value)}
                          placeholder="+977 98XXXXXXXX"
                          className="pl-10 h-11 text-xs sm:text-sm rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <Input
                          type="email"
                          required
                          value={applicantEmail}
                          onChange={(e) => setApplicantEmail(e.target.value)}
                          placeholder="name@domain.com"
                          className="pl-10 h-11 text-xs sm:text-sm rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                        Academic / Professional Level
                      </label>
                      <select
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        className="w-full h-11 px-3 text-xs sm:text-sm rounded-xl border border-[#CCD7DC] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2CBC63] cursor-pointer"
                      >
                        <option value="ICAN CAP-II Qualified">ICAN CAP-II Qualified</option>
                        <option value="CA Semi-Qualified">CA Semi-Qualified</option>
                        <option value="ACCA Affiliate / Member">ACCA Affiliate / Member</option>
                        <option value="Masters / MBS / MBA in Finance">Masters in Accounting / MBA</option>
                        <option value="Bachelors (BBA / BBS)">Bachelors (BBA / BBS)</option>
                      </select>
                    </div>
                  </div>

                  {/* CV Upload */}
                  <div>
                    <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                      Upload Curriculum Vitae (PDF / Word)
                    </label>
                    <div className="border-2 border-dashed border-[#CCD7DC] hover:border-[#2CBC63] rounded-2xl p-4 text-center cursor-pointer transition-colors relative bg-[#F8FAFC]">
                      <input
                        id="application-cv"
                        type="file"
                        required
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Upload className="w-5 h-5 mx-auto text-[#2CBC63] mb-1" />
                      <label htmlFor="application-cv" className="text-xs font-bold text-[#023A51] block">
                        {cvFileName ? cvFileName : 'Choose file or drag & drop'}
                      </label>
                      <span className="text-[11px] text-[#59667D]">
                        PDF or DOCX up to 10MB
                      </span>
                    </div>
                  </div>

                  {/* Cover Note */}
                  <div>
                    <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                      Brief Statement or Past Experience (Optional)
                    </label>
                    <Textarea
                      rows={3}
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      placeholder="Briefly state your accounting background, audit engagements, or ICAN exam session..."
                      className="min-h-20 text-xs sm:text-sm rounded-xl"
                    />
                  </div>

                  {submissionError && <p role="alert" className="text-sm font-medium text-red-700">{submissionError}</p>}
                  <label className="flex items-start gap-2 text-xs leading-5 text-[#59667D]">
                    <input type="checkbox" name="privacy_consent" required className="mt-0.5 size-4 accent-[#023A51]" />
                    <span>I have read the <Link href="/privacy" className="font-semibold text-[#023A51] underline underline-offset-2">Privacy Policy</Link> and consent to the use of my application details and CV to assess this application.</span>
                  </label>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-11 w-full rounded-full bg-[#023A51] hover:bg-[#2CBC63] text-white font-bold text-xs sm:text-sm"
                    >
                      {isSubmitting ? 'Sending application...' : 'Submit Application'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
