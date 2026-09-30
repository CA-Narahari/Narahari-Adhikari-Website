'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error || 'Unable to sign in.');
        return;
      }
      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Unable to reach the sign-in service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FBFA] px-6 py-16">
      <section className="w-full max-w-md rounded-2xl border border-[#E8EBEF] bg-white p-8 shadow-sm sm:p-10">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F4F8] text-[#023A51]"><LockKeyhole className="h-5 w-5" /></div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.12em] text-[#2CBC63]">Staff access</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#023A51]">Admin sign in</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#59667D]">Sign in to manage published content, enquiries, appointments, and vacancies.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="admin-username" className="mb-1.5 block text-xs font-bold text-[#023A51]">Admin ID</label>
            <Input id="admin-username" required autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Narahari_Adhikari_Admin" />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-xs font-bold text-[#023A51]">Password</label>
            <Input id="admin-password" required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" />
          </div>
          {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-xl">{isSubmitting ? 'Signing in...' : 'Sign in'}<ArrowRight className="h-4 w-4" /></Button>
        </form>
      </section>
    </main>
  );
}
