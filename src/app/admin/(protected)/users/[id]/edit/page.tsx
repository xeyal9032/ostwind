'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ADMIN_ROLE_LABELS, type AdminRole } from '@/lib/admin-roles';

export default function EditAdminUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ADMIN' as AdminRole,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${id}`);
        if (res.ok) {
          const data = await res.json();
          setForm({
            name: data.name || '',
            email: data.email,
            password: '',
            confirmPassword: '',
            role: data.role,
          });
        } else {
          const data = await res.json().catch(() => ({}));
          setError(data.error || 'İstifadəçi tapılmadı');
        }
      } catch {
        setError('Bağlantı xətası');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload: Record<string, string> = {
      name: form.name,
      email: form.email,
      role: form.role,
    };
    if (form.password.trim()) {
      if (form.password.length < 6) {
        setError('Yeni şifrə ən azı 6 simvol olmalıdır');
        setSaving(false);
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError('Şifrə və təsdiq uyğun gəlmir');
        setSaving(false);
        return;
      }
      payload.password = form.password;
    }

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        router.push('/admin/users');
        router.refresh();
      } else {
        setError(data.error || 'Yenilənə bilmədi');
      }
    } catch {
      setError('Bağlantı xətası');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Yüklənir...</div>;
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Düzəlt</h1>
        <Link href="/admin/users" className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
          &larr; Geri
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
          <label
            htmlFor="edit-admin-name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Ad
          </label>
          <input
            id="edit-admin-name"
            name="name"
            type="text"
            autoComplete="name"
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label
            htmlFor="edit-admin-email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            E-posta <span className="text-red-500">*</span>
          </label>
          <input
            id="edit-admin-email"
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
          <label
            htmlFor="edit-admin-password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Yeni şifrə (boş buraxın — dəyişməz)
          </label>
          <input
            id="edit-admin-password"
            name="password"
            type="password"
            minLength={6}
            autoComplete="new-password"
            aria-describedby="edit-admin-password-hint"
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <p id="edit-admin-password-hint" className="text-xs text-gray-500 mt-1">
            Boş buraxılsa şifrə dəyişməz; doldurularsa ən azı 6 simvol olmalıdır.
          </p>
        </div>

        <div>
          <label
            htmlFor="edit-admin-confirm-password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Yeni şifrə (təsdiq)
          </label>
          <input
            id="edit-admin-confirm-password"
            name="confirmPassword"
            type="password"
            minLength={6}
            autoComplete="new-password"
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />
        </div>

        <div>
          <label
            htmlFor="edit-admin-role"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Rol
          </label>
          <select
            id="edit-admin-role"
            name="role"
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })}
          >
            <option value="ADMIN">{ADMIN_ROLE_LABELS.ADMIN}</option>
            <option value="SUPER_ADMIN">{ADMIN_ROLE_LABELS.SUPER_ADMIN}</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50"
        >
          {saving ? 'Saxlanılır...' : 'Yadda saxla'}
        </button>
      </form>
    </div>
  );
}
