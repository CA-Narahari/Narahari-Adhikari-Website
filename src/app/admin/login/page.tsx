'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  FileText,
  CalendarCheck,
  Building,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
        setError(result.error || 'Invalid credentials. Please verify your practice email and password.');
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

  const handleFillDemo = () => {
    setEmail('admin@narahariadhikari.com');
    setPassword('NarahariAdmin2026!');
  };

  return (
    <main className="min-h-screen bg-[#F4F7F9] text-[#1E293B] flex items-center justify-center p-4 sm:p-6 lg:p-10 selection:bg-[#2CBC63]/25 selection:text-[#023A51]">
      <div className="w-full max-w-[1100px] min-h-[640px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(2,58,81,0.12)] border border-[#E2E8F0] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Editorial Brand Showcase (5 cols on lg) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#023A51] via-[#032E42] to-[#011C27] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Ambient background blur circles */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#2CBC63]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#0A4B67]/40 rounded-full blur-3xl pointer-events-none" />

          {/* Top: Brand & ICAN Credential Tag */}
          <div className="relative z-10 space-y-6">
            <Link
              href="/"
              className="inline-block bg-white/95 backdrop-blur-sm p-3 rounded-2xl border border-white/20 shadow-md hover:opacity-95 transition-all group"
            >
              <Image
                src="/Logo.png"
                alt="Narahari Adhikari Chartered Accountants"
                width={230}
                height={55}
                priority
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
              />
            </Link>

            <div className="space-y-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur text-xs font-semibold text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-[#2CBC63] animate-pulse" />
                <span>ICAN Member Practice • Reg. No. 1024/2078</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Practice Management & CMS Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Authorized central gateway for partners, senior auditors, and firm administrators managing public circulars and client services.
              </p>
            </div>
          </div>

          {/* Middle: Key Security Highlights */}
          <div className="relative z-10 py-8 space-y-3.5 border-y border-white/10 my-6">
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-[#2CBC63]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">Encrypted Session Security</span>
                <span className="text-[11px] text-slate-400">Strict HttpOnly cookie token authorization</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-[#2CBC63]">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">Real-time Tax Publications</span>
                <span className="text-[11px] text-slate-400">Direct publishing of statutory notices & circulars</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-[#2CBC63]">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">Client Advisory Pipeline</span>
                <span className="text-[11px] text-slate-400">Manage bookings, candidate CVs & firm data</span>
              </div>
            </div>
          </div>

          {/* Bottom: Integrity Seal */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 pt-2">
            <span>Corporate Heights, Kathmandu</span>
            <span className="flex items-center gap-1 font-semibold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> All Systems Online
            </span>
          </div>
        </div>

        {/* Right Side: High-End Authentication Card (7 cols on lg) */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between bg-white">
          {/* Top Bar inside Form */}
          <div className="flex items-center justify-between gap-4 pb-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#59667D] hover:text-[#023A51] transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Public Website</span>
            </Link>

            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-[#023A51] text-[11px] font-bold tracking-wide uppercase">
              Staff Access Only
            </span>
          </div>

          {/* Form Content */}
          <div className="max-w-[420px] w-full mx-auto py-6 space-y-6">
            <div className="space-y-1.5 text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023A51] tracking-tight">
                Sign in to your account
              </h2>
              <p className="text-xs sm:text-[13px] text-[#59667D] leading-relaxed">
                Enter your firm credentials to access the practice management console.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Address */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-bold text-[#023A51] tracking-wide"
                >
                  Official Practice Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A889B] pointer-events-none" />
                  <Input
                    id="admin-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@narahariadhikari.com"
                    className="h-11 pl-10 rounded-xl border-[#CCD7DC] bg-[#FAFDFB] text-sm text-[#023A51] placeholder:text-[#94A3B8] focus-visible:border-[#2CBC63] focus-visible:ring-2 focus-visible:ring-[#2CBC63]/25 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="admin-password"
                    className="block text-xs font-bold text-[#023A51] tracking-wide"
                  >
                    Password
                  </label>
                  <span className="text-[11px] text-[#7A889B]">256-Bit Protected</span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A889B] pointer-events-none" />
                  <Input
                    id="admin-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="h-11 pl-10 pr-10 rounded-xl border-[#CCD7DC] bg-[#FAFDFB] text-sm text-[#023A51] placeholder:text-[#94A3B8] focus-visible:border-[#2CBC63] focus-visible:ring-2 focus-visible:ring-[#2CBC63]/25 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A889B] hover:text-[#023A51] transition-colors p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#2CBC63] focus:ring-[#2CBC63]/30 cursor-pointer accent-[#2CBC63]"
                  />
                  <span className="text-[#59667D] font-medium">Keep session active on this PC</span>
                </label>

                {/* Quick Auto-fill badge for convenience */}
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-[11px] font-semibold text-[#2CBC63] hover:text-[#25A456] hover:underline"
                >
                  Use Default Credentials
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 animate-in fade-in duration-200"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                  <span className="font-medium leading-relaxed">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-sm shadow-[0_4px_16px_rgba(44,188,99,0.3)] hover:shadow-[0_6px_20px_rgba(44,188,99,0.4)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Practice Account...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Sign In to Practice CMS</span>
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Footer Security Notice */}
          <div className="pt-6 border-t border-slate-100 text-center text-[11px] text-[#7A889B] space-y-1">
            <p className="font-medium text-[#59667D]">
              Narahari Adhikari &bull; Chartered Accountants (Nepal)
            </p>
            <p>
              Strictly restricted to licensed practice partners & staff under the Nepal Chartered Accountants Act, 2053.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
