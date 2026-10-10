'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  KeyRound,
  LoaderCircle,
  Lock,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  UserPlus,
  UsersRound,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

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

  // Add Account form state (signup-01 pattern)
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<PracticeRole>('staff');

  // Password Changing modal / section state
  const [changingPasswordUser, setChangingPasswordUser] = useState<PracticeUser | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [isUpdatingPw, setIsUpdatingPw] = useState(false);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      setUsers(await fetchPracticeUsers());
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'We could not load staff accounts.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadUsers(), 0);
    return () => window.clearTimeout(timer);
  }, [loadUsers]);

  const handleCreateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please verify both password fields.');
      return;
    }

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, password, role }),
      });
      const result = (await response.json()) as { user?: PracticeUser; error?: string };
      if (!response.ok || !result.user) {
        setFormError(result.error || 'We could not create this staff account.');
        return;
      }

      setDisplayName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('staff');
      setSuccess(`${result.user.displayName} can now sign in as ${result.user.role === 'admin' ? 'an administrator' : 'staff'}.`);
      await loadUsers();
    } catch {
      setFormError('The account service could not be reached. Please check connectivity and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (!changingPasswordUser) return;

    if (newPassword !== confirmNewPassword) {
      setPwError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setPwError('Password must be at least 8 characters long.');
      return;
    }

    setIsUpdatingPw(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: changingPasswordUser.id, currentPassword, password: newPassword }),
      });
      const result = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        setPwError(result.error || 'Failed to update password.');
        return;
      }

      setPwSuccess(`Password for ${changingPasswordUser.displayName} was updated successfully!`);
      setNewPassword('');
      setConfirmNewPassword('');
      setCurrentPassword('');
      setTimeout(() => {
        setChangingPasswordUser(null);
        setPwSuccess('');
      }, 2500);
    } catch {
      setPwError('Failed to communicate with authentication server.');
    } finally {
      setIsUpdatingPw(false);
    }
  };

  const changeRole = async (user: PracticeUser, nextRole: PracticeRole) => {
    if (user.role === nextRole) return;
    if (!window.confirm(`Change ${user.displayName}'s access to ${nextRole === 'admin' ? 'Administrator' : 'Staff'}?`)) return;
    setFormError(''); setSuccess('');
    try {
      const response = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, role: nextRole }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'The access role could not be changed.');
      setUsers((current) => current.map((item) => item.id === user.id ? { ...item, role: nextRole } : item));
      setSuccess(`${user.displayName}'s access is now ${nextRole === 'admin' ? 'Administrator' : 'Staff'}.`);
    } catch (error) { setFormError(error instanceof Error ? error.message : 'The access role could not be changed.'); }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[#E8EBEF] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E7F6EC] text-[#16723B] text-[11px] font-bold uppercase tracking-wider mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Staff Management & Security</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#023A51]">
            Staff access
          </h1>
          <p className="mt-1 text-sm text-[#59667D] max-w-2xl">
            Add administrator or staff accounts and reset account passwords when needed.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-xl border border-[#DCE7E3] bg-white px-3.5 py-2 text-xs font-semibold text-[#59667D] shadow-xs">
            <UsersRound className="h-4 w-4 text-[#2CBC63]" aria-hidden="true" />
            <span>{users.length} {users.length === 1 ? 'account' : 'accounts'}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void loadUsers()}
            disabled={isLoading}
            className="h-9 gap-1.5 rounded-xl border-slate-200 text-xs text-[#023A51]"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>Refresh</span>
          </Button>
        </div>
      </header>

      {/* Main Grid: Accounts List + Create Form (signup-01) */}
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Left Column: Staff Accounts Table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs" aria-labelledby="staff-accounts-heading">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 id="staff-accounts-heading" className="text-base font-bold text-[#023A51]">
                CMS accounts
              </h2>
              <p className="text-xs text-[#74838A]">
                Team members who can sign in to the CMS.
              </p>
            </div>
          </div>

          {loadError ? (
            <div className="m-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800" role="alert">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
              <div>
                <p className="font-semibold">Could not load accounts</p>
                <p className="mt-1 leading-5">{loadError}</p>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex min-h-56 items-center justify-center gap-2 text-sm text-[#74838A]" role="status">
              <LoaderCircle className="h-5 w-5 animate-spin text-[#2CBC63]" aria-hidden="true" />
              <span>Loading staff accounts…</span>
            </div>
          ) : users.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF6EE] text-[#2CBC63]">
                <UsersRound className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-[#023A51]">No staff accounts yet</h3>
              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#74838A]">
                Use the form on the right to add an administrator or staff member.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] text-left text-sm">
                <thead className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-[#59667D] border-b border-slate-100">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 sm:px-6">Team Member</th>
                    <th scope="col" className="px-4 py-3.5">Role</th>
                    <th scope="col" className="px-4 py-3.5">Status</th>
                    <th scope="col" className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4 sm:px-6">
                        <div className="font-bold text-[#023A51]">{user.displayName}</div>
                        <div className="text-xs text-[#74838A]">{user.email}</div>
                      </td>
                      <td className="px-4 py-4">
                        <label className="sr-only" htmlFor={`role-${user.id}`}>Access role for {user.displayName}</label>
                        <select id={`role-${user.id}`} value={user.role} onChange={(event) => { void changeRole(user, event.target.value as PracticeRole); }} className={`h-9 rounded-lg border px-2.5 text-xs font-semibold outline-none focus:border-[#168A4A] ${user.role === 'admin' ? 'border-[#CCD7DC] bg-[#E8F4F8] text-[#023A51]' : 'border-[#BFE5CB] bg-[#E7F6EC] text-[#16723B]'}`}>
                          <option value="staff">Staff</option><option value="admin">Administrator</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 text-xs text-[#59667D]">
                        <span className="inline-flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${user.emailConfirmed ? 'bg-[#2CBC63]' : 'bg-amber-400'}`} />
                          {user.emailConfirmed ? 'Active' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setChangingPasswordUser(user);
                            setPwError('');
                            setPwSuccess('');
                            setNewPassword('');
                            setConfirmNewPassword('');
                            setCurrentPassword('');
                          }}
                          className="h-8 gap-1.5 text-xs text-[#023A51] hover:text-[#2CBC63] hover:bg-[#E8F4F8] rounded-lg"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                          <span>Change Password</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Right Column: Add Staff Account Card based on signup-01 */}
        <div className="space-y-6">
          <Card className="rounded-2xl border border-slate-200/90 bg-white shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2.5 mb-1 text-[#2CBC63]">
                <UserPlus className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#023A51]">Access setup</span>
              </div>
              <CardTitle className="text-xl font-extrabold text-[#023A51]">
                Add Staff Account
              </CardTitle>
              <CardDescription className="text-xs text-[#59667D]">
                Choose the account role and set the password the account will use to sign in.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {success && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-[#BFE5CB] bg-[#F1FAF4] p-3 text-xs text-[#236B3F]" role="status">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2CBC63]" aria-hidden="true" />
                  <span className="font-medium">{success}</span>
                </div>
              )}
              {formError && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800" role="alert">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                  <span className="font-medium">{formError}</span>
                </div>
              )}

              <form onSubmit={handleCreateAccount}>
                <FieldGroup className="space-y-3.5">
                  <Field>
                    <FieldLabel htmlFor="staff-name" className="text-xs font-bold text-[#023A51]">
                      Full Name
                    </FieldLabel>
                    <Input
                      id="staff-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      minLength={2}
                      maxLength={100}
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                      placeholder="e.g. Ramesh Shrestha"
                      className="h-10 rounded-xl border-slate-200 text-sm focus-visible:border-[#2CBC63] focus-visible:ring-[#2CBC63]/25"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="staff-email" className="text-xs font-bold text-[#023A51]">
                      Work Email
                    </FieldLabel>
                    <Input
                      id="staff-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@narahariadhikari.com"
                      className="h-10 rounded-xl border-slate-200 text-sm focus-visible:border-[#2CBC63] focus-visible:ring-[#2CBC63]/25"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="staff-password" className="text-xs font-bold text-[#023A51]">
                      Account Password
                    </FieldLabel>
                    <Input
                      id="staff-password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      maxLength={128}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Must be at least 8 characters"
                      className="h-10 rounded-xl border-slate-200 text-sm focus-visible:border-[#2CBC63] focus-visible:ring-[#2CBC63]/25 font-mono"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="staff-confirm-password" className="text-xs font-bold text-[#023A51]">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="staff-confirm-password"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      maxLength={128}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Re-enter password"
                      className="h-10 rounded-xl border-slate-200 text-sm focus-visible:border-[#2CBC63] focus-visible:ring-[#2CBC63]/25 font-mono"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="staff-role" className="text-xs font-bold text-[#023A51]">
                      Access Level
                    </FieldLabel>
                    <select
                      id="staff-role"
                      name="role"
                      value={role}
                      onChange={(event) => setRole(event.target.value as PracticeRole)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-[#023A51] outline-none focus:border-[#2CBC63] focus:ring-2 focus:ring-[#2CBC63]/20 transition-all font-medium"
                    >
                      <option value="staff">Staff — manage website content</option>
                      <option value="admin">Administrator — manage content &amp; staff</option>
                    </select>
                  </Field>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-10 rounded-xl bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        <span>Creating account…</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span>Add Staff Account</span>
                      </>
                    )}
                  </Button>

                  <FieldDescription className="text-center text-[11px] text-[#7A889B] pt-1">
                    This is the account’s sign-in password. You can adjust its access role later.
                  </FieldDescription>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Password Changing Modal / Section (signup-01 style) */}
      {changingPasswordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-md relative">
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-2xl p-2 sm:p-4">
              <CardHeader className="pb-3 relative">
                <button
                  type="button"
                  onClick={() => setChangingPasswordUser(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="inline-flex items-center gap-1.5 text-[#2CBC63] text-xs font-bold uppercase tracking-wider mb-1">
                  <KeyRound className="w-4 h-4" />
                  <span>Security &amp; Credentials</span>
                </div>
                <CardTitle className="text-xl font-extrabold text-[#023A51]">
                  Change Password
                </CardTitle>
                <CardDescription className="text-xs text-[#59667D]">
                  Updating password for <strong className="text-[#023A51]">{changingPasswordUser.displayName}</strong> ({changingPasswordUser.email})
                </CardDescription>
              </CardHeader>

              <CardContent>
                {pwSuccess && (
                  <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-[#BFE5CB] bg-[#F1FAF4] p-3 text-xs text-[#236B3F]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2CBC63]" />
                    <span className="font-medium">{pwSuccess}</span>
                  </div>
                )}
                {pwError && (
                  <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    <span className="font-medium">{pwError}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <FieldGroup className="space-y-3.5">
                    <Field>
                      <FieldLabel htmlFor="current-admin-password" className="text-xs font-bold text-[#023A51]">Your current administrator password</FieldLabel>
                      <Input id="current-admin-password" type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="h-10 rounded-xl border-slate-200 text-sm font-mono focus-visible:border-[#2CBC63] focus-visible:ring-[#2CBC63]/25" />
                      <FieldDescription className="text-[11px] text-[#7A889B]">Verify your identity before changing this account’s password.</FieldDescription>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="new-pw" className="text-xs font-bold text-[#023A51]">
                        New Password
                      </FieldLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="new-pw"
                          type="password"
                          required
                          minLength={8}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="pl-9 h-10 rounded-xl border-slate-200 text-sm font-mono focus-visible:border-[#2CBC63] focus-visible:ring-[#2CBC63]/25"
                        />
                      </div>
                      <FieldDescription className="text-[11px] text-[#7A889B]">
                        Must be at least 8 characters long.
                      </FieldDescription>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="confirm-new-pw" className="text-xs font-bold text-[#023A51]">
                        Confirm New Password
                      </FieldLabel>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="confirm-new-pw"
                          type="password"
                          required
                          minLength={8}
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="pl-9 h-10 rounded-xl border-slate-200 text-sm font-mono focus-visible:border-[#2CBC63] focus-visible:ring-[#2CBC63]/25"
                        />
                      </div>
                    </Field>

                    <div className="flex items-center justify-end gap-2.5 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setChangingPasswordUser(null)}
                        className="rounded-xl border-slate-200 text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isUpdatingPw}
                        className="rounded-xl bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-xs"
                      >
                        {isUpdatingPw ? (
                          <>
                            <LoaderCircle className="w-4 h-4 mr-1.5 animate-spin" />
                            <span>Updating…</span>
                          </>
                        ) : (
                          <span>Update Password</span>
                        )}
                      </Button>
                    </div>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function fetchPracticeUsers(): Promise<PracticeUser[]> {
  return fetch('/api/admin/users', { cache: 'no-store' })
    .then(async (response) => {
      const result = (await response.json()) as { users?: PracticeUser[]; error?: string };
      if (!response.ok) throw new Error(result.error || 'We could not load staff accounts.');
      return result.users ?? [];
    });
}
