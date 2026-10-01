'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
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
        setError(result.error || 'Invalid email address or password. Please verify your firm credentials.');
        return;
      }
      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Could not connect to the authentication server. Please check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center px-4 py-12 sm:px-6 relative">
      <div className="w-full max-w-[440px] space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link
            href="/"
            aria-label="Return to Narahari Adhikari Chartered Accountants website"
            className="inline-block transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2CBC63] rounded-lg"
          >
            <Image
              src="/Logo.png"
              alt="Narahari Adhikari Chartered Accountants"
              width={260}
              height={65}
              priority
              className="h-12 sm:h-14 w-auto object-contain mx-auto"
            />
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F4F8] border border-[#CCD7DC] text-[11px] font-bold text-[#023A51] tracking-wide uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2CBC63]" />
            <span>Firm Administration Portal</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_10px_35px_-8px_rgba(2,58,81,0.07)] p-6 sm:p-8 space-y-6">
          <div className="space-y-1.5 text-left">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#023A51] tracking-tight">
              Sign In to Continue
            </h1>
            <p className="text-xs sm:text-[13px] text-[#59667D] leading-relaxed">
              Authorized access for partners, managers, and practice staff to manage client operations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="block text-xs font-bold text-[#023A51]">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A889B] pointer-events-none" />
                <Input
                  id="admin-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@narahariadhikari.com"
                  className="h-11 pl-10 rounded-xl border-slate-200 bg-white text-sm text-[#023A51] placeholder:text-[#94A3B8] focus-visible:border-[#2CBC63] focus-visible:ring-2 focus-visible:ring-[#2CBC63]/25 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="admin-password" className="block text-xs font-bold text-[#023A51]">
                  Password
                </label>
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
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••••••"
                  className="h-11 pl-10 pr-10 rounded-xl border-slate-200 bg-white text-sm text-[#023A51] placeholder:text-[#94A3B8] focus-visible:border-[#2CBC63] focus-visible:ring-2 focus-visible:ring-[#2CBC63]/25 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A889B] hover:text-[#023A51] transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#2CBC63] focus:ring-[#2CBC63]/30"
                />
                <span className="text-xs text-[#59667D] font-medium">Keep this device signed in</span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/90 p-3 text-xs text-red-800 animate-fadeIn">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                <span className="font-medium leading-relaxed">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <span>Sign In to Admin Portal</span>
              )}
            </Button>
          </form>

          {/* Secure footnote */}
          <div className="border-t border-slate-100 pt-4 text-center">
            <p className="text-[11px] text-[#7A889B] leading-relaxed">
              ICAN Member Firm Portal • Access is monitored and restricted strictly to authorized staff.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#59667D] hover:text-[#023A51] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
