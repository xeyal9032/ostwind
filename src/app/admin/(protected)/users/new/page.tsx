'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ADMIN_ROLE_LABELS, type AdminRole } from '@/lib/admin-roles';

export default function NewAdminUserPage() {
  const t = useTranslations('users');
  const tCommon = useTranslations('common');
  const tForms = useTranslations('forms');
  const tAccount = useTranslations('account');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN' as AdminRole,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        router.push('/admin/users');
        router.refresh();
      } else {
        setError(data.error || tCommon('error'));
      }
    } catch {
      setError(tCommon('connectionError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('new')}</h1>
        <Link href="/admin/users" className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
          {tCommon('back')}
        </Link>
      </div>

      {error && (
        <div role="alert" className="bg-red-50 dark:bg-red-900/30 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 shadow-sm rounded-xl border border-gray-200 dark:border-zinc-800 p-6 space-y-5"
      >
        <div>
          <label htmlFor="new-admin-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('nameOptional')}
          </label>
          <input
            id="new-admin-name"
            name="name"
            type="text"
            autoComplete="name"
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="new-admin-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {tForms('email')} <span className="text-red-500">*</span>
          </label>
          <input
            id="new-admin-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="new-admin-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {tForms('password')} <span className="text-red-500">*</span>
          </label>
          <input
            id="new-admin-password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            aria-describedby="new-admin-password-hint"
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <p id="new-admin-password-hint" className="text-xs text-gray-500 mt-1">
            {tAccount('passwordMinHint')}
          </p>
        </div>

        <div>
          <label htmlFor="new-admin-role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('role')}
          </label>
          <select
            id="new-admin-role"
            name="role"
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })}
          >
            <option value="ADMIN">{ADMIN_ROLE_LABELS.ADMIN}</option>
            <option value="SUPER_ADMIN">{ADMIN_ROLE_LABELS.SUPER_ADMIN}</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">{t('roleHint')}</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50"
        >
          {loading ? t('creating') : t('createAdmin')}
        </button>
      </form>
    </div>
  );
}
