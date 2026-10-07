'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error || 'Invalid credentials. Please verify your email and password.');
        return;
      }
      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Could not connect to the authentication server. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-10 lg:p-12 overflow-hidden bg-[#EDF4F0] selection:bg-[#2CBC63]/25 selection:text-[#0D3B3E]">
      {/* Background Graphic: Serene Misty Mountains */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/login-bg.png"
          alt="Consultation meeting background"
          fill
          priority
          className="object-cover object-center opacity-85"
        />
        {/* Soft morning mist gradient tint overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#EDF5F1]/80 via-[#F3F8F5]/50 to-[#EAF3EE]/80 backdrop-blur-[0.5px]" />
      </div>

      {/* Decorative elegant curved contour lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-100 200 C 400 100, 700 350, 1100 120 C 1250 30, 1400 60, 1550 40"
          stroke="#2CBC63"
          strokeWidth="1.2"
          strokeDasharray="4 2"
        />
        <path
          d="M 200 950 C 500 700, 900 820, 1500 600"
          stroke="#1A8F4B"
          strokeWidth="1"
          opacity="0.35"
        />
      </svg>

      {/* Main Container: Split 2-Column Presentation */}
      <div className="relative z-10 w-full max-w-[1240px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Left Side: Editorial Typography & Brand Narrative */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-8 lg:space-y-10 py-6">
          {/* Top Brand Logo */}
          <div className="space-y-6">
            <Link
              href="/"
              className="inline-block transition-transform hover:scale-[1.02] duration-200"
              title="Return to Narahari Adhikari Chartered Accountants"
            >
              <Image
                src="/Logo.png"
                alt="Narahari Adhikari Chartered Accountants"
                width={260}
                height={64}
                priority
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Core Welcome Copy */}
          <div className="space-y-5">
            <div className="inline-block">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.24em] text-[#1A8F4B] block">
                CMS PORTAL
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0D3B3E] tracking-tight leading-[1.12]">
              Wel<span className="text-[#1A8F4B]">co</span>me Back,
              <br />
              Admin
            </h1>

            <p className="text-sm sm:text-base text-[#4E6765] leading-relaxed max-w-lg font-normal">
              Log in to manage your website content, update information and keep your online presence fresh and up to date.
            </p>

            {/* Tagline Ribbon */}
            <div className="pt-2 flex items-center gap-3">
              <div className="w-[3px] h-5 bg-[#1A8F4B] rounded-full shrink-0" />
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#486B69]">
                YOUR WEBSITE <span className="text-[#1A8F4B] mx-1">&bull;</span> YOUR CONTENT <span className="text-[#1A8F4B] mx-1">&bull;</span> YOUR CONTROL
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Elevated Pristine White Auth Card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-[430px] bg-white rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(13,59,62,0.12)] border border-white/80 ring-1 ring-slate-900/5 relative">
            {/* Form Title & Subtitle (Clean and Aligned, No Boxed Logo) */}
            <div className="text-center mb-7">
              <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#0D3B3E] tracking-tight">
                Sign in to CMS
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7C80] mt-1.5 font-medium">
                Enter your credentials to continue
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800" role="alert">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                <span className="font-medium leading-relaxed">{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-semibold text-[#4A5D62]"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9EA1] pointer-events-none" />
                  <input
                    id="admin-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-[#D5E0DC] bg-[#FAFDFB] text-sm text-[#0D3B3E] placeholder:text-[#9AAEB0] focus:border-[#1A8F4B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A8F4B]/20 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold text-[#4A5D62]"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9EA1] pointer-events-none" />
                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-[#D5E0DC] bg-[#FAFDFB] text-sm text-[#0D3B3E] placeholder:text-[#9AAEB0] focus:border-[#1A8F4B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A8F4B]/20 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C9EA1] hover:text-[#0D3B3E] p-1 rounded-md transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password row */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#4E6266] font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1A8F4B] focus:ring-[#1A8F4B] border-slate-300 accent-[#1A8F4B]"
                  />
                  <span>Remember me</span>
                </label>

                <span className="text-xs font-semibold text-[#1A8F4B] hover:text-[#127038] hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-[#0C4A4E] hover:bg-[#083639] active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(12,74,78,0.25)] hover:shadow-[0_6px_20px_rgba(12,74,78,0.35)] transition-all cursor-pointer disabled:opacity-70 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Or Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E3ECE8]" />
              </div>
              <div className="relative flex justify-center text-[11px]">
                <span className="bg-white px-3 text-[#8C9EA1] font-medium">or</span>
              </div>
            </div>

            {/* Back to Website Link */}
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0C4A4E] hover:text-[#1A8F4B] transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Back to Website</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
