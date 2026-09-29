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
  FileCheck,
  Building,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Send,
  X,
  ShieldCheck,
  FileText,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import { Vacancy } from '@/types';

export default function CareersPage() {
  const { settings, vacancies, addApplication } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Form Fields
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [academicLevel, setAcademicLevel] = useState('ICAN CAP-II Passed');
  const [coverNote, setCoverNote] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If recruitment is disabled globally in admin
  if (!settings.careers_enabled) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center mx-auto mb-6 text-slate-500">
          <Briefcase className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-[#023A51] tracking-tight mb-3">
          Recruitment Window Currently Closed
        </h1>
        <p className="text-sm text-[#4A5259] max-w-md mx-auto leading-relaxed mb-8">
          We are not actively accepting new article trainee or permanent employment applications at this moment. You may reach out directly for future openings.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 bg-[#023A51] text-white rounded-full text-xs font-semibold hover:bg-[#2CBC63] transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  const activeVacancies = vacancies.filter((v) => v.is_active);

  const filteredVacancies = activeVacancies.filter((v) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Article Trainee') return v.employment_type === 'Article Trainee';
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
      setCvFile(file);
      setCvFileName(file.name);
    }
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail || !applicantPhone || !selectedVacancy) {
      alert('Please fill out all required contact fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addApplication({
        vacancy_id: selectedVacancy.id,
        vacancy_title: selectedVacancy.title,
        applicant_name: applicantName,
        applicant_email: applicantEmail,
        applicant_phone: applicantPhone,
        cover_note: `Qualification: ${academicLevel}\n\n${coverNote}`,
        cv_filename: cvFileName || 'Resume_Applicant.pdf',
        status: 'new',
      });
      setIsSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  const resetForm = () => {
    setApplicantName('');
    setApplicantEmail('');
    setApplicantPhone('');
    setCoverNote('');
    setCvFile(null);
    setCvFileName('');
    setSubmitted(false);
    setIsApplyModalOpen(false);
  };

  const culturePillars = [
    {
      title: 'Direct FCA Mentorship',
      desc: 'Work directly alongside Fellow Chartered Accountants on real client files, statutory audits, and IRD representations.',
      icon: GraduationCap,
    },
    {
      title: 'Diverse Sector Exposure',
      desc: 'Gain deep practical experience across manufacturing, commercial banking, hydropower, foreign investments, and trading corporations.',
      icon: Building,
    },
    {
      title: 'ICAN Curriculum & Study Leave',
      desc: 'Committed exam leave policies, practical training logbook guidance, and internal technical workshop sessions for CAP-III / Final candidates.',
      icon: Briefcase,
    },
    {
      title: 'Modern ERP & Digital Tools',
      desc: 'Hands-on proficiency in computerized auditing, cloud accounting systems, CBMS integration, and advanced financial modeling.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="pb-24 overflow-x-hidden">
      {/* 1. Hero Header */}
      <section
        id="hero-section"
        className="relative bg-hero-gradient pt-8 pb-14 sm:pt-12 sm:pb-16 overflow-hidden"
      >
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#CCD7DC] text-xs font-semibold text-[#023A51]">
              <span className="w-2 h-2 rounded-full bg-[#2CBC63] animate-pulse" />
              <span>Articleship & Career Opportunities</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              Build Your Career With Us<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-[17px] text-[#33475B] font-normal leading-relaxed">
              We welcome ICAN Article Trainees, semi-qualified accountants, and experienced tax professionals seeking rigorous practical training, professional skepticism, and rapid career progression.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-6 pt-12 space-y-16 sm:space-y-20">
        {/* ======================================================== */}
        {/* 2. WHY TRAIN & WORK WITH US */}
        {/* ======================================================== */}
        <section className="space-y-6">
          <div className="border-b border-[#E8EBEF] pb-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023A51] tracking-tight">
              Why Start Your Professional Journey Here<span className="text-[#2CBC63]">.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#59667D] mt-1">
              A disciplined, supportive training ground designed for future leaders of the Chartered Accountancy profession in Nepal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {culturePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E8EBEF] p-6 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md hover:border-[#2CBC63]/60 transition-all"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F4F8] text-[#023A51] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#2CBC63]" />
                    </div>
                    <h3 className="text-base font-bold text-[#023A51] leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#59667D] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. OPEN POSITIONS & APPLICATION CARDS */}
        {/* ======================================================== */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8EBEF] pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023A51] tracking-tight">
                Open Positions ({activeVacancies.length})<span className="text-[#2CBC63]">.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#59667D] mt-1">
                Explore available roles and apply directly with your curriculum vitae.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Article Trainee', 'Audit', 'Tax'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeFilter === cat
                      ? 'bg-[#023A51] text-white shadow-xs'
                      : 'bg-[#F4F6F8] text-[#59667D] hover:bg-slate-200'
                  }`}
                >
                  {cat === 'All' ? 'All Roles' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVacancies.map((vac) => (
              <div
                key={vac.id}
                className="bg-white rounded-3xl border border-[#E8EBEF] p-6 shadow-xs hover:shadow-xl hover:border-[#2CBC63]/60 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#2CBC63] bg-[#E8F4F8] px-2.5 py-0.5 rounded-full">
                      {vac.department}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {vac.employment_type}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#023A51] group-hover:text-[#2CBC63] transition-colors leading-snug">
                    {vac.title}
                  </h3>

                  <p className="text-xs text-[#59667D] leading-relaxed line-clamp-3">
                    {vac.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Key Eligibility:
                    </span>
                    {vac.requirements.slice(0, 3).map((req, rIdx) => (
                      <div key={rIdx} className="flex items-start gap-2 text-xs text-[#33475B]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2CBC63] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8EBEF] space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[#59667D] font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#2CBC63]" />
                      <span>{vac.location}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Due: {vac.deadline}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenApply(vac)}
                    type="button"
                    className="w-full py-2.5 rounded-xl bg-[#023A51] hover:bg-[#2CBC63] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Apply for this Position</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. GENERAL TRAINEE / SPECULATIVE INQUIRY STRIP */}
        {/* ======================================================== */}
        <section className="p-8 rounded-3xl bg-[#E8F4F8] border border-[#CCD7DC]/70 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base sm:text-lg font-bold text-[#023A51]">
              Don&apos;t see an exact vacancy matching your timing?
            </h3>
            <p className="text-xs text-[#59667D] leading-relaxed max-w-xl">
              We frequently accept applications from newly qualified CAP-II candidates anticipating ICAN batch registration. Send your resume directly for upcoming articleship intake.
            </p>
          </div>

          <a
            href={`mailto:${settings.email}?subject=Articleship%20/%20Career%20Application%20Inquiry`}
            className="px-6 py-3 rounded-full bg-[#023A51] hover:bg-[#2CBC63] text-white text-xs font-bold transition-colors whitespace-nowrap shadow-xs cursor-pointer"
          >
            Email General CV &rarr;
          </a>
        </section>
      </div>

      {/* ======================================================== */}
      {/* 5. INTERACTIVE EASY APPLICATION MODAL */}
      {/* ======================================================== */}
      {isApplyModalOpen && selectedVacancy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5 border border-[#E8EBEF] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-[11px] font-bold text-[#2CBC63] uppercase tracking-wider">
                  Direct Application
                </span>
                <h3 className="text-xl font-bold text-[#023A51] mt-0.5">
                  {selectedVacancy.title}
                </h3>
                <span className="text-xs text-[#59667D] font-mono">
                  {selectedVacancy.department} &bull; {selectedVacancy.employment_type}
                </span>
              </div>
              <button
                onClick={resetForm}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#2CBC63]/15 text-[#2CBC63] flex items-center justify-center mx-auto">
                  <FileCheck className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-[#023A51]">
                  Application Received!
                </h4>
                <p className="text-xs text-[#59667D] leading-relaxed max-w-sm mx-auto">
                  Thank you, <strong>{applicantName}</strong>. Your application for <strong>{selectedVacancy.title}</strong> has been recorded in our hiring database. Our practice coordinator will contact you via email or phone.
                </p>
                <div className="pt-2">
                  <button
                    onClick={resetForm}
                    className="px-6 py-2.5 rounded-full bg-[#023A51] text-white text-xs font-bold hover:bg-[#2CBC63] transition-colors cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
                {/* Full Name */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Binod Sharma"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border rounded-xl focus:outline-none focus:border-[#2CBC63] text-[#023A51]"
                    />
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border rounded-xl focus:outline-none focus:border-[#2CBC63] text-[#023A51]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="+977 98..."
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border rounded-xl focus:outline-none focus:border-[#2CBC63] text-[#023A51]"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic / ICAN Qualification */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Highest Educational / ICAN Qualification
                  </label>
                  <select
                    value={academicLevel}
                    onChange={(e) => setAcademicLevel(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#2CBC63] text-[#023A51]"
                  >
                    <option value="ICAN CAP-II Passed">ICAN CAP-II Passed (Eligible for Articleship)</option>
                    <option value="ICAN CAP-III / Final Candidate">ICAN CAP-III / Final Candidate</option>
                    <option value="ACCA Affiliate / Member">ACCA Affiliate / Member</option>
                    <option value="Chartered Accountant (Qualified)">Chartered Accountant (Qualified)</option>
                    <option value="BBA / BBS Graduate">BBA / BBS Graduate</option>
                    <option value="MBS / MBA Graduate">MBS / MBA Graduate</option>
                  </select>
                </div>

                {/* CV File Upload Box with visual indicator */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Attach Curriculum Vitae (PDF / Word) *
                  </label>
                  <label className="border-2 border-dashed border-[#CCD7DC] hover:border-[#2CBC63] rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#FBFDFE]">
                    <Upload className="w-6 h-6 text-[#2CBC63] mb-1.5" />
                    <span className="text-xs font-bold text-[#023A51]">
                      {cvFileName ? cvFileName : 'Click to select or drop your CV'}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      {cvFileName ? 'File attached successfully' : 'Supports PDF, DOCX up to 10MB'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Cover Note */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Brief Statement of Interest (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Highlight your exam attempt history, software skills (Tally/Excel), or relevant experience."
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-[#2CBC63] text-[#023A51]"
                  />
                </div>

                {/* Actions */}
                <div className="pt-2 border-t flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-[#023A51] hover:bg-[#2CBC63] text-white rounded-full font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
