'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { useSiteText } from '@/components/SiteContentProvider';

const pillBase =
  'inline-flex items-center justify-center rounded-full text-[11px] sm:text-xs font-medium transition-colors shadow-sm whitespace-nowrap leading-tight';

const linkClass =
  'px-2 sm:px-2.5 py-1 sm:py-1.5 text-gray-800 dark:text-gray-100 hover:bg-primary hover:text-white transition-colors';

export default function StudentAuthLinks() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const [loggedIn, setLoggedIn] = useState(false);

  const loginLabel = useSiteText('header', 'login', locale, t('login'));
  const registerLabel = useSiteText('header', 'register', locale, t('register'));
  const admissionLabel = useSiteText('header', 'onlineAdmission', locale, t('onlineAdmission'));

  useEffect(() => {
    fetch('/api/student/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setLoggedIn(!!data?.student))
      .catch(() => setLoggedIn(false));
  }, []);

  if (loggedIn) {
    return (
      <Link
        href="/portal/admission"
        className={`${pillBase} px-3 py-1.5 text-white bg-primary hover:bg-primary/90 max-w-[9rem] sm:max-w-none truncate`}
      >
        {admissionLabel}
      </Link>
    );
  }

  return (
    <div
      className={`${pillBase} overflow-hidden border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 shrink-0`}
      role="group"
      aria-label={`${loginLabel} / ${registerLabel}`}
    >
      <Link href="/auth/login" className={linkClass}>
        {loginLabel}
      </Link>
      <span className="h-3.5 w-px shrink-0 bg-gray-200 dark:bg-zinc-600" aria-hidden />
      <Link href="/auth/register" className={linkClass}>
        {registerLabel}
      </Link>
    </div>
  );
}
