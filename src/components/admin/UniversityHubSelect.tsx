'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAdminLocaleFieldText } from '@/lib/use-admin-locale-field';

type Hub = { id: number; slug: string; title?: Record<string, string> };

export default function UniversityHubSelect({
  value,
  onChange,
}: {
  value: number | '';
  onChange: (hubId: number | '') => void;
}) {
  const t = useTranslations('universityHubs');
  const fieldText = useAdminLocaleFieldText();
  const [hubs, setHubs] = useState<Hub[]>([]);

  useEffect(() => {
    fetch('/api/admin/university-hubs')
      .then((r) => (r.ok ? r.json() : []))
      .then(setHubs);
  }, []);

  return (
    <div>
      <label htmlFor="university-hub" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {t('assignHub')}
      </label>
      <select
        id="university-hub"
        value={value === '' ? '' : String(value)}
        onChange={(e) => onChange(e.target.value ? parseInt(e.target.value, 10) : '')}
        className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
      >
        <option value="">{t('selectHub')}</option>
        {hubs.map((h) => (
          <option key={h.id} value={h.id}>
            {fieldText(h.title)} ({h.slug})
          </option>
        ))}
      </select>
    </div>
  );
}
