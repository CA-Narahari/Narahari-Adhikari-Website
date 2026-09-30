'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Check, LoaderCircle, LockKeyhole, RefreshCw, ShieldCheck, UserPlus, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type PracticeRole = 'admin' | 'staff';

type PracticeUser = {
  id: string;
  displayName: string;
  email: string;
  role: PracticeRole;
  createdAt: string;
  emailConfirmed: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<PracticeUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<PracticeRole>('staff');

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      setUsers(await fetchPracticeUsers());
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'We could not load practice accounts.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchPracticeUsers()
      .then((practiceUsers) => {
        if (active) setUsers(practiceUsers);
      })
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof Error ? error.message : 'We could not load practice accounts.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, password, role }),
      });
      const result = (await response.json()) as { user?: PracticeUser; error?: string };
      if (!response.ok || !result.user) {
        setFormError(result.error || 'We could not create this practice account.');
        return;
      }

      setDisplayName('');
      setEmail('');
      setPassword('');
      setRole('staff');
      setSuccess(`${result.user.displayName} can now sign in as ${result.user.role === 'admin' ? 'an administrator' : 'staff'}.`);
      await loadUsers();
    } catch {
      setFormError('The account service could not be reached. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#258E50]">Configuration</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#023A51]">Staff access</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64727D]">Add practice accounts and choose whether each person can manage the site or has staff access.</p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-lg border border-[#DCE7E3] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#59667D] shadow-sm sm:self-auto">
          <UsersRound className="h-4 w-4 text-[#258E50]" aria-hidden="true" />
          {users.length} {users.length === 1 ? 'account' : 'accounts'}
        </div>
      </header>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="overflow-hidden rounded-xl border border-[#E2E9E7] bg-white shadow-sm" aria-labelledby="practice-accounts-heading">
          <div className="flex items-center justify-between gap-4 border-b border-[#E8EEEB] px-5 py-4 sm:px-6">
            <div>
              <h2 id="practice-accounts-heading" className="text-sm font-bold text-[#023A51]">Practice accounts</h2>
              <p className="mt-1 text-xs text-[#74838A]">Only accounts with an admin or staff role are listed.</p>
            </div>
            <Button type="button" variant="outline" onClick={() => void loadUsers()} disabled={isLoading} className="h-9 gap-2 rounded-lg border-[#D8E1DF] px-3 text-xs text-[#33475B]">
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
              Refresh
            </Button>
          </div>

          {loadError ? (
            <div className="m-5 flex items-start gap-3 rounded-lg border border-[#F0C7C2] bg-[#FFF7F6] p-4 text-sm text-[#8A3429]" role="alert">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <div><p className="font-semibold">Could not load accounts</p><p className="mt-1 text-xs leading-5">{loadError}</p></div>
            </div>
          ) : isLoading ? (
            <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-[#74838A]" role="status">
              <LoaderCircle className="h-4 w-4 animate-spin text-[#258E50]" aria-hidden="true" />
              Loading practice accounts…
            </div>
          ) : users.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF6EE] text-[#258E50]"><UsersRound className="h-5 w-5" aria-hidden="true" /></div>
              <h3 className="mt-4 text-sm font-bold text-[#023A51]">No practice accounts yet</h3>
              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#74838A]">Add an administrator or staff account to grant someone access to the CMS.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[570px] text-left text-sm">
                <thead className="bg-[#F8FAF9] text-[10px] font-bold uppercase tracking-[0.1em] text-[#74838A]">
                  <tr>
                    <th scope="col" className="px-5 py-3 sm:px-6">Account</th>
                    <th scope="col" className="px-4 py-3">Access</th>
                    <th scope="col" className="px-4 py-3">Email status</th>
                    <th scope="col" className="px-4 py-3">Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF1F0]">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#FBFCFC]">
                      <td className="px-5 py-4 sm:px-6">
                        <p className="font-semibold text-[#33475B]">{user.displayName}</p>
                        <p className="mt-1 text-xs text-[#74838A]">{user.email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${user.role === 'admin' ? 'bg-[#EAF1F8] text-[#245978]' : 'bg-[#EAF6EE] text-[#237445]'}`}>
                          {user.role === 'admin' && <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />}
                          {user.role === 'admin' ? 'Administrator' : 'Staff'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-[#59667D]">{user.emailConfirmed ? 'Confirmed' : 'Pending'}</td>
                      <td className="px-4 py-4 text-xs text-[#74838A]">{formatDate(user.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-[#E2E9E7] bg-white p-5 shadow-sm sm:p-6" aria-labelledby="add-account-heading">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF6EE] text-[#258E50]"><UserPlus className="h-5 w-5" aria-hidden="true" /></div>
            <div>
              <h2 id="add-account-heading" className="text-sm font-bold text-[#023A51]">Add an account</h2>
              <p className="mt-1 text-xs leading-5 text-[#74838A]">New accounts can sign in as soon as they are created.</p>
            </div>
          </div>

          {success && (
            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-[#BFE5CB] bg-[#F1FAF4] px-3.5 py-3 text-xs leading-5 text-[#236B3F]" role="status">
              <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{success}</span>
            </div>
          )}
          {formError && (
            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-[#F0C7C2] bg-[#FFF7F6] px-3.5 py-3 text-xs leading-5 text-[#8A3429]" role="alert">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="staff-name" className="mb-1.5 block text-xs font-semibold text-[#33475B]">Full name</label>
              <Input id="staff-name" name="name" autoComplete="name" required minLength={2} maxLength={100} value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="h-10 rounded-lg border-[#D8E1DF] text-sm focus-visible:border-[#2CBC63] focus-visible:ring-[#2CBC63]/30" />
            </div>
            <div>
              <label htmlFor="staff-email" className="mb-1.5 block text-xs font-semibold text-[#33475B]">Work email</label>
              <Input id="staff-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@yourfirm.com" className="h-10 rounded-lg border-[#D8E1DF] text-sm focus-visible:border-[#2CBC63] focus-visible:ring-[#2CBC63]/30" />
            </div>
            <div>
              <label htmlFor="staff-password" className="mb-1.5 block text-xs font-semibold text-[#33475B]">Temporary password</label>
              <Input id="staff-password" name="password" type="password" autoComplete="new-password" required minLength={10} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} className="h-10 rounded-lg border-[#D8E1DF] text-sm focus-visible:border-[#2CBC63] focus-visible:ring-[#2CBC63]/30" />
              <p className="mt-1.5 flex items-center gap-1.5 text-[11px] leading-4 text-[#74838A]"><LockKeyhole className="h-3 w-3 shrink-0" aria-hidden="true" />Use a unique password and share it directly with the account holder.</p>
            </div>
            <div>
              <label htmlFor="staff-role" className="mb-1.5 block text-xs font-semibold text-[#33475B]">Access level</label>
              <select id="staff-role" name="role" value={role} onChange={(event) => setRole(event.target.value as PracticeRole)} className="h-10 w-full rounded-lg border border-[#D8E1DF] bg-white px-3 text-sm text-[#33475B] outline-none focus:border-[#2CBC63] focus:ring-2 focus:ring-[#2CBC63]/20">
                <option value="staff">Staff — manage practice content</option>
                <option value="admin">Administrator — manage content and accounts</option>
              </select>
            </div>
            <Button type="submit" disabled={isSubmitting} className="h-10 w-full rounded-lg bg-[#2CBC63] text-sm font-bold text-white hover:bg-[#25A456] disabled:cursor-wait disabled:opacity-70">
              {isSubmitting ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />Creating account…</> : <><UserPlus className="mr-2 h-4 w-4" aria-hidden="true" />Add practice account</>}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

async function fetchPracticeUsers() {
  const response = await fetch('/api/admin/users', { cache: 'no-store' });
  const result = (await response.json()) as { users?: PracticeUser[]; error?: string };
  if (!response.ok) throw new Error(result.error || 'We could not load practice accounts.');
  return result.users ?? [];
}
