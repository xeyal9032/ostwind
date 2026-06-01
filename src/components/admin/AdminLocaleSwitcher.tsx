'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ADMIN_LOCALES, type AdminLocale } from '@/lib/admin-locale';
import LocaleFlag from '@/components/LocaleFlag';

export default function AdminLocaleSwitcher() {
  const locale = useLocale() as AdminLocale;
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const t = useTranslations('localeSwitcher');
  const tLocales = useTranslations('contentLocales');

  function setLocale(next: AdminLocale) {
    if (next === locale) return;
    startTransition(async () => {
      await fetch('/api/admin/locale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: next }),
      });
      router.refresh();
    });
  }

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 p-1"
      role="group"
      aria-label={t('label')}
    >
      {ADMIN_LOCALES.map((code) => {
        const name = tLocales(code);
        const isActive = locale === code;
        const buttonClass = `flex items-center justify-center rounded-md p-1.5 transition-all ${
          isActive
            ? 'bg-primary ring-2 ring-primary/40 scale-105 shadow-sm'
            : 'opacity-80 hover:opacity-100 hover:bg-white dark:hover:bg-zinc-700'
        }`;

        if (isActive) {
          return (
            <button
              key={code}
              type="button"
              disabled={pending}
              title={name}
              aria-current="true"
              aria-label={name}
              onClick={() => setLocale(code)}
              className={buttonClass}
            >
              <LocaleFlag locale={code} label={`${name} bayrağı`} size="sm" />
            </button>
          );
        }

        return (
          <button
            key={code}
            type="button"
            disabled={pending}
            title={name}
            aria-label={name}
            onClick={() => setLocale(code)}
            className={buttonClass}
          >
            <LocaleFlag locale={code} label={`${name} bayrağı`} size="sm" />
          </button>
        );
      })}
    </div>
  );
}
