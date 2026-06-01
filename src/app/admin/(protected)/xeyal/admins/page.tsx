'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function XeyalAdminsPage() {
  const t = useTranslations('xeyal');

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('adminsTitle')}</h2>
      <p className="text-gray-600 dark:text-gray-400">{t('adminsIntro')}</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/admin/users/new"
          className="block p-6 rounded-xl border-2 border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/30 hover:border-violet-400 transition-colors"
        >
          <h2 className="font-semibold text-gray-900 dark:text-white">{t('adminsAddCardTitle')}</h2>
          <p className="text-sm text-gray-500 mt-2">{t('adminsAddCardDesc')}</p>
        </Link>
        <Link
          href="/admin/users"
          className="block p-6 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-violet-300 transition-colors"
        >
          <h2 className="font-semibold text-gray-900 dark:text-white">{t('adminsListCardTitle')}</h2>
          <p className="text-sm text-gray-500 mt-2">{t('adminsListCardDesc')}</p>
        </Link>
      </div>
    </div>
  );
}
