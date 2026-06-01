import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isSuperAdmin } from '@/lib/admin-roles';
import XeyalNav from '@/components/admin/xeyal/XeyalNav';
import Link from 'next/link';

export default async function XeyalLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!isSuperAdmin(session?.user?.role)) {
    redirect('/admin/dashboard');
  }

  const t = await getTranslations('xeyal');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            {t('superAdmin')}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{t('title')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('layoutIntro')}</p>
        </div>
        <Link
          href="/admin/dashboard"
          className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 shrink-0"
        >
          {t('backDashboard')}
        </Link>
      </div>
      <XeyalNav />
      {children}
    </div>
  );
}
