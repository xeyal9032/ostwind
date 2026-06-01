import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/prisma';
import { formatAdminLastSeen, isAdminOnline } from '@/lib/admin-presence';
import { ADMIN_ROLE_LABELS, type AdminRole } from '@/lib/admin-roles';

/** Super admin dashboard — admin onlayn statistikası */
export default async function AdminPresenceSummary() {
  const t = await getTranslations('xeyal');
  const tCommon = await getTranslations('common');
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      lastSeenAt: true,
    },
    orderBy: [{ role: 'asc' }, { id: 'asc' }],
  });

  const online = users.filter((u) => isAdminOnline(u.lastSeenAt));
  const offline = users.length - online.length;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('presenceTitle')}</h2>
        <Link
          href="/admin/users"
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          {tCommon('manageAll')}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg bg-gray-50 dark:bg-zinc-800/50 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('totalAdmins')}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
        </div>
        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
          <p className="text-sm text-green-700 dark:text-green-400">{t('onlineNow')}</p>
          <p className="mt-1 text-2xl font-bold text-green-700 dark:text-green-300">{online.length}</p>
        </div>
        <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('offlineCount')}</p>
          <p className="mt-1 text-2xl font-bold text-gray-700 dark:text-gray-300">{offline}</p>
        </div>
      </div>

      <ul className="divide-y divide-gray-100 dark:divide-zinc-800">
        {users.map((user) => {
          const onlineNow = isAdminOnline(user.lastSeenAt);
          return (
            <li key={user.id} className="flex items-center justify-between py-3 gap-4">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {ADMIN_ROLE_LABELS[user.role as AdminRole] ?? user.role}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                    onlineNow
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                      : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      onlineNow ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                    }`}
                    aria-hidden
                  />
                  {onlineNow ? t('online') : t('offline')}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatAdminLastSeen(user.lastSeenAt)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
