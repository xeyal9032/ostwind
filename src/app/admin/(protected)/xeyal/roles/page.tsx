'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  PERMISSION_KEYS,
  PERMISSION_LABELS,
  parsePermissions,
  type PermissionKey,
} from '@/lib/admin-permissions';
import { ADMIN_ROLE_LABELS, type AdminRole } from '@/lib/admin-roles';

type AdminUser = {
  id: number;
  name: string | null;
  email: string;
  role: AdminRole;
  isActive: boolean;
  permissions: unknown;
};

type UserState = {
  fullAccess: boolean;
  permissions: PermissionKey[];
  isActive: boolean;
  saving: boolean;
};

export default function XeyalRolesPage() {
  const t = useTranslations('xeyal');
  const tRoles = useTranslations('xeyal.roles');
  const tCommon = useTranslations('common');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [states, setStates] = useState<Record<number, UserState>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || tCommon('loadFailed'));
      const list: AdminUser[] = data.users.filter((u: AdminUser) => u.role !== 'SUPER_ADMIN');
      setUsers(list);
      const next: Record<number, UserState> = {};
      for (const u of list) {
        const parsed = parsePermissions(u.permissions);
        next[u.id] = {
          fullAccess: parsed === null,
          permissions: parsed ?? [...PERMISSION_KEYS],
          isActive: u.isActive ?? true,
          saving: false,
        };
      }
      setStates(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : tCommon('error'));
    } finally {
      setLoading(false);
    }
  }, [tCommon]);

  useEffect(() => {
    load();
  }, [load]);

  const updateState = (id: number, patch: Partial<UserState>) => {
    setStates((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const togglePermission = (id: number, key: PermissionKey) => {
    const s = states[id];
    if (!s || s.fullAccess) return;
    const has = s.permissions.includes(key);
    const permissions = has ? s.permissions.filter((k) => k !== key) : [...s.permissions, key];
    updateState(id, { permissions });
  };

  const save = async (user: AdminUser) => {
    const s = states[user.id];
    if (!s) return;
    updateState(user.id, { saving: true });
    try {
      const res = await fetch(`/api/admin/xeyal/users/${user.id}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          permissions: s.fullAccess ? null : s.permissions,
          isActive: s.isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || tCommon('saveFailed'));
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : tCommon('error'));
    } finally {
      updateState(user.id, { saving: false });
    }
  };

  if (loading) return <p className="text-gray-500">{tCommon('loading')}</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">{tRoles('intro')}</p>

      {users.length === 0 ? (
        <p className="text-gray-500">{t('noAdmins')}</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => {
            const s = states[user.id];
            if (!s) return null;
            return (
              <div
                key={user.id}
                className={`rounded-xl border p-5 ${
                  s.isActive
                    ? 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                    : 'border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20'
                }`}
              >
                <div className="flex flex-wrap justify-between gap-3 mb-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {user.name || user.email}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <span className="text-xs text-blue-600">{ADMIN_ROLE_LABELS[user.role]}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <label htmlFor={`freeze-${user.id}`} className="flex items-center gap-2 text-sm">
                      <input
                        id={`freeze-${user.id}`}
                        type="checkbox"
                        checked={!s.isActive}
                        onChange={(e) => updateState(user.id, { isActive: !e.target.checked })}
                      />
                      {tRoles('freezeAccount')}
                    </label>
                    <label htmlFor={`full-${user.id}`} className="flex items-center gap-2 text-sm">
                      <input
                        id={`full-${user.id}`}
                        type="checkbox"
                        checked={s.fullAccess}
                        onChange={(e) =>
                          updateState(user.id, {
                            fullAccess: e.target.checked,
                            permissions: e.target.checked ? [...PERMISSION_KEYS] : [],
                          })
                        }
                      />
                      {tRoles('fullAccess')}
                    </label>
                    <button
                      type="button"
                      disabled={s.saving}
                      onClick={() => save(user)}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
                    >
                      {s.saving ? tCommon('saving') : tCommon('save')}
                    </button>
                  </div>
                </div>

                {!s.fullAccess && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {PERMISSION_KEYS.map((key) => (
                      <label
                        key={key}
                        htmlFor={`perm-${user.id}-${key}`}
                        className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <input
                          id={`perm-${user.id}-${key}`}
                          type="checkbox"
                          checked={s.permissions.includes(key)}
                          onChange={() => togglePermission(user.id, key)}
                        />
                        {PERMISSION_LABELS[key]}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
