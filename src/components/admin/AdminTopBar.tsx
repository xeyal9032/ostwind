'use client';

import { useTranslations } from 'next-intl';
import AdminLocaleSwitcher from '@/components/admin/AdminLocaleSwitcher';

type AdminTopBarProps = {
  onMenuToggle?: () => void;
  menuOpen?: boolean;
};

export default function AdminTopBar({ onMenuToggle, menuOpen }: AdminTopBarProps) {
  const t = useTranslations('layout');

  return (
    <header className="shrink-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 py-3 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {onMenuToggle ? (
            menuOpen ? (
              <button
                type="button"
                onClick={onMenuToggle}
                aria-expanded="true"
                className="lg:hidden inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
              >
                <span className="sr-only">Menüyü bağla</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={onMenuToggle}
                aria-expanded="false"
                className="lg:hidden inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
              >
                <span className="sr-only">Menüyü aç</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )
          ) : null}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            {t('panelTitle')}
          </span>
        </div>
        <AdminLocaleSwitcher />
      </div>
    </header>
  );
}
