import Link from 'next/link';
import { prisma } from '@/prisma';

/** Super admin dashboard — təmiz giriş nöqtəsi */
export default async function XeyalDashboardCard() {
  const [unreadApplications, unreadMessages, auditToday] = await Promise.all([
    prisma.application.count({ where: { readAt: null } }),
    prisma.message.count({ where: { readAt: null } }),
    prisma.adminAuditLog.count({
      where: {
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
  ]);

  return (
    <div className="rounded-2xl border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/40 dark:to-indigo-950/30 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            Super Admin
          </p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Xeyal</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-lg">
            Audit log, bildirişlər, export, rollar, 2FA, medya, SEO, zibil qutusu və e-poçt — hamısı
            burada.
          </p>
          <div className="flex flex-wrap gap-3 mt-4 text-sm">
            <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
              {unreadApplications} yeni başvuru
            </span>
            <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
              {unreadMessages} yeni mesaj
            </span>
            <span className="px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
              {auditToday} bugünkü audit
            </span>
          </div>
        </div>
        <Link
          href="/admin/xeyal"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-lg transition-colors shrink-0"
        >
          Xeyal panelinə keç →
        </Link>
      </div>
    </div>
  );
}
