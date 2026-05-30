'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ADMIN_ROLE_LABELS, type AdminRole } from '@/lib/admin-roles';

interface AdminUser {
  id: number;
  name: string | null;
  email: string;
  role: AdminRole;
  lastSeenAt: string | null;
  isOnline: boolean;
  lastSeenLabel: string;
  createdAt: string;
}

interface UsersResponse {
  users: AdminUser[];
  stats: {
    total: number;
    online: number;
    offline: number;
  };
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id ? parseInt(session.user.id, 10) : null;

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState({ total: 0, online: 0, offline: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data: UsersResponse = await res.json();
        setUsers(data.users);
        setStats(data.stats);
        setError('');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'İstifadəçilər yüklənə bilmədi');
      }
    } catch {
      setError('Bağlantı xətası');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 30_000);
    return () => clearInterval(interval);
  }, [fetchUsers]);

  const handleDelete = async (user: AdminUser) => {
    if (user.id === currentUserId) {
      alert('Öz hesabınızı silə bilməzsiniz.');
      return;
    }

    const confirmed = confirm(
      `"${user.email}" admin hesabını silmək istəyirsiniz?\n\nBu əməliyyat geri alına bilməz.`,
    );
    if (!confirmed) return;

    setDeletingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        await fetchUsers();
      } else {
        alert(data.error || 'Silinə bilmədi');
      }
    } catch {
      alert('Bağlantı xətası');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin İstifadəçilər
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Onlayn status və son aktivlik. Adminlər paneldə tam redaktə hüququna malikdir.
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
        >
          Yeni Admin Əlavə Et
        </Link>
      </div>

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4">
            <p className="text-sm text-gray-500">Toplam admin</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/40 p-4">
            <p className="text-sm text-green-700 dark:text-green-400">İndi onlayn</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {stats.online}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4">
            <p className="text-sm text-gray-500">Oflayn</p>
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.offline}</p>
          </div>
        </div>
      )}

      {error && (
        <div role="alert" className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Yüklənir...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Hələ admin yoxdur.{' '}
          <Link href="/admin/users/new" className="text-blue-600 hover:underline">
            İlk admini əlavə edin
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
            <thead className="bg-gray-50 dark:bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Son onlayn
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Əməliyyat
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name || '—'}
                      {user.id === currentUserId && (
                        <span className="ml-2 text-xs text-blue-600">(siz)</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'SUPER_ADMIN'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'
                      }`}
                    >
                      {ADMIN_ROLE_LABELS[user.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                        user.isOnline
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                          : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          user.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                        }`}
                        aria-hidden
                      />
                      {user.isOnline ? 'Onlayn' : 'Oflayn'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {user.lastSeenLabel}
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-3 whitespace-nowrap">
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Düzəlt
                    </Link>
                    {user.id === currentUserId ? (
                      <span className="text-gray-400 text-xs">Silinmir</span>
                    ) : (
                      <button
                        type="button"
                        disabled={deletingId === user.id}
                        onClick={() => handleDelete(user)}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        {deletingId === user.id ? 'Silinir...' : 'Sil'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-6 py-3 text-xs text-gray-400 border-t border-gray-100 dark:border-zinc-800">
            Onlayn = son 5 dəqiqədə panel aktivliyi. Siyahı hər 30 saniyədə yenilənir.
          </p>
        </div>
      )}
    </div>
  );
}
