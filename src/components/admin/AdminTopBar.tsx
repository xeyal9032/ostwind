'use client';

import { useTranslations } from 'next-intl';
import AdminLocaleSwitcher from '@/components/admin/AdminLocaleSwitcher';

export default function AdminTopBar() {
  const t = useTranslations('layout');

  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">{t('panelTitle')}</span>
        <AdminLocaleSwitcher />
      </div>
    </header>
  );
}
