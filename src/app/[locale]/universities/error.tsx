'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/routing';

/** Universitetlər səhifəsi server xətası */
export default function UniversitiesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[universities]', error);
  }, [error]);

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Səhifə yüklənmədi
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
        Verilənlər bazası və ya server müvəqqəti cavab vermədi. Bir dəfə yeniləyin; davam edərsə
        adminə müraciət edin.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={reset}
          className="min-h-[44px] px-6 rounded-full bg-primary text-white font-medium"
        >
          Yenidən cəhd et
        </button>
        <Link
          href="/"
          className="min-h-[44px] inline-flex items-center justify-center px-6 rounded-full border border-gray-300 dark:border-zinc-600 font-medium"
        >
          Ana səhifə
        </Link>
      </div>
    </div>
  );
}
