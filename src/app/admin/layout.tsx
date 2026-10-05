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
  const [role, setRole] = useState<'admin' | 'staff' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoginPage) return;

    let cancelled = false;
    void fetch('/api/admin/session').then(async (response) => {
      const data = (await response.json()) as { authenticated?: boolean; role?: 'admin' | 'staff' };
      if (cancelled) return;
      if (!response.ok || !data.authenticated) {
        router.replace('/admin/login');
        return;
      }
      setRole(data.role === 'admin' || data.role === 'staff' ? data.role : null);
      setIsAuthenticated(true);
      setIsCheckingAuth(false);
    });

    return () => {
      cancelled = true;
    };
  }, [isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;
  if (isCheckingAuth || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F8F7] px-4 text-sm font-medium text-[#59667D]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#2CBC63] animate-pulse" />
          <span>Authenticating admin session…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F5F8F7] font-sans text-[#33475B] selection:bg-[#2CBC63]/20 selection:text-[#023A51]">
      <AdminSidebar mobileOpen={mobileMenuOpen} onNavigate={() => setMobileMenuOpen(false)} role={role} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
