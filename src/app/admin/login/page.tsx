'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        setError(result.error || 'We could not sign you in. Check your details and try again.');
        return;
      }
      router.replace('/admin');
      router.refresh();
    } catch {
      setError('The sign-in service could not be reached. Please try again shortly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#F5F8F7] px-4 py-12 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#023A51] via-[#2CBC63] to-[#A7DCC1]" />
      <div className="pointer-events-none absolute -right-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#2CBC63]/[0.07] blur-3xl" />

      <section className="relative w-full max-w-[480px]">
        <div className="mb-5 flex justify-center">
          <Link href="/" aria-label="Return to Narahari Adhikari Chartered Accountants website" className="inline-flex rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2CBC63]">
            <Image src="/Logo.png" alt="Narahari Adhikari Chartered Accountants" width={240} height={65} priority className="h-12 w-auto object-contain" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E2E9E7] bg-white shadow-[0_20px_60px_rgba(2,58,81,0.09)]">
          <div className="border-b border-[#E8EBEF] px-6 py-6 sm:px-9 sm:py-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#258E50]">Practice workspace</p>
            <h1 className="mt-2 text-[25px] font-bold leading-tight tracking-tight text-[#023A51] sm:text-[28px]">Sign in to continue</h1>
            <p className="mt-2 text-sm leading-6 text-[#59667D]">Manage website content and practice enquiries from one place.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6 sm:px-9 sm:py-8">
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-[13px] font-semibold text-[#33475B]">Email address</label>
              <Input
                id="admin-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@yourfirm.com"
                className="h-11 rounded-lg border-[#D8E1DF] bg-white text-sm text-[#023A51] placeholder:text-[#97A4A9] focus-visible:border-[#2CBC63] focus-visible:ring-[#2CBC63]/30"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-[13px] font-semibold text-[#33475B]">Password</label>
              <Input
                id="admin-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="h-11 rounded-lg border-[#D8E1DF] bg-white text-sm text-[#023A51] placeholder:text-[#97A4A9] focus-visible:border-[#2CBC63] focus-visible:ring-[#2CBC63]/30"
              />
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-[#F0C7C2] bg-[#FFF7F6] px-3.5 py-3 text-sm text-[#8A3429]">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-lg bg-[#2CBC63] text-sm font-bold text-white shadow-sm hover:bg-[#25A456] disabled:cursor-wait disabled:opacity-70"
            >
              <span>{isSubmitting ? 'Signing in…' : 'Sign in'}</span>
              {!isSubmitting && <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />}
            </Button>

            <p className="border-t border-[#EEF1F0] pt-4 text-center text-xs leading-5 text-[#74838A]">
              For authorised practice staff. Your access is checked against your firm account.
            </p>
          </form>
        </div>

        <div className="mt-5 text-center">
          <Link href="/" className="text-xs font-semibold text-[#59667D] underline decoration-[#C8D3D0] underline-offset-4 hover:text-[#023A51]">
            Return to the public website
          </Link>
        </div>
      </section>
    </main>
  );
}
