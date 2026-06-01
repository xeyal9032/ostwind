'use client';

import { useTranslations } from 'next-intl';
import ServiceIcon from '@/components/ServiceIcon';
import {
  SERVICE_ICON_OPTIONS,
  isServiceIconKey,
  type ServiceIconOption,
} from '@/lib/service-icon-options';
import type { ServiceIconKey } from '@/lib/services-defaults';

type ServiceIconSelectProps = {
  id?: string;
  value: string;
  onChange: (value: ServiceIconKey) => void;
};

export default function ServiceIconSelect({
  id = 'service-icon',
  value,
  onChange,
}: ServiceIconSelectProps) {
  const t = useTranslations('common');
  const tIcons = useTranslations('services.icons');
  const selected: ServiceIconKey = isServiceIconKey(value) ? value : 'documents';
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t('icon')}
      </label>
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <select
          id={id}
          value={selected}
          onChange={(e) => {
            const next = e.target.value;
            if (isServiceIconKey(next)) onChange(next);
          }}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          {SERVICE_ICON_OPTIONS.map((option: ServiceIconOption) => (
            <option key={option.value} value={option.value}>
              {tIcons(`${option.value}.label`)}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-3 shrink-0 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 px-4 py-2">
          <ServiceIcon name={selected} slug={selected} className="h-8 w-8" />
          <span className="text-xs text-gray-500 dark:text-gray-400 max-w-[140px]">
            {tIcons(`${selected}.hint`)}
          </span>
        </div>
      </div>
    </div>
  );
}
