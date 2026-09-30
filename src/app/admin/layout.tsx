'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  const [isCheckingAuth, setIsCheckingAuth] = useState(!isLoginPage);
  const [isAuthenticated, setIsAuthenticated] = useState(isLoginPage);

  useEffect(() => {
    if (isLoginPage) return;

    let cancelled = false;
    void fetch('/api/admin/session').then(async (response) => {
      const data = (await response.json()) as { authenticated?: boolean };
      if (cancelled) return;
      if (!response.ok || !data.authenticated) {
        router.replace('/admin/login');
        return;
      }
      setIsAuthenticated(true);
      setIsCheckingAuth(false);
    });

    return () => {
      cancelled = true;
    };
  }, [isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;
  if (isCheckingAuth || !isAuthenticated) {
    return <div className="flex min-h-screen items-center justify-center bg-[#F8FBFA] text-sm text-[#59667D]">Checking staff access...</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-900">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
