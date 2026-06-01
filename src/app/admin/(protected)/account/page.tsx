'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { ADMIN_ROLE_LABELS, type AdminRole } from '@/lib/admin-roles';

export default function AdminAccountPage() {
  const t = useTranslations('account');
  const tCommon = useTranslations('common');
  const tForms = useTranslations('forms');
  const { data: session } = useSession();
  const role = session?.user?.role as AdminRole | undefined;

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/account/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccess(t('passwordChanged'));
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(data.error || t('passwordChangeFailed'));
      }
    } catch {
      setError(tCommon('connectionError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('title')}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{t('intro')}</p>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 mb-8">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
          {t('profile')}
        </h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">{tCommon('name')}</dt>
            <dd className="text-gray-900 dark:text-white font-medium">{session?.user?.name || '—'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">{tForms('email')}</dt>
            <dd className="text-gray-900 dark:text-white font-medium">{session?.user?.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">{t('roleLabel')}</dt>
            <dd className="text-gray-900 dark:text-white font-medium">{role ? ADMIN_ROLE_LABELS[role] : '—'}</dd>
          </div>
        </dl>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 space-y-5"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('changePassword')}</h2>

        {error && (
          <div role="alert" className="bg-red-50 dark:bg-red-900/30 text-red-600 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div role="status" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-lg text-sm">
            {success}
          </div>
        )}

        <div>
          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('currentPassword')} <span className="text-red-500">*</span>
          </label>
          <input
            id="current-password"
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white"
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {tForms('newPassword')} <span className="text-red-500">*</span>
          </label>
          <input
            id="new-password"
            name="newPassword"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            aria-describedby="new-password-hint"
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          />
          <p id="new-password-hint" className="text-xs text-gray-500 mt-1">
            {t('passwordMinHint')}
          </p>
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {tForms('confirmPassword')} <span className="text-red-500">*</span>
          </label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50"
        >
          {loading ? tCommon('saving') : t('changePasswordButton')}
        </button>
      </form>
    </div>
  );
}
