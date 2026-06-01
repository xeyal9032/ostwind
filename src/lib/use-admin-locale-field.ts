'use client';

import { useLocale } from 'next-intl';
import { getLocaleText } from '@/lib/locale-content';
import { isAdminLocale, type AdminLocale } from '@/lib/admin-locale';

/** Admin panel dilinə görə çoxdilli DB sahəsini göstərir */
export function useAdminLocaleFieldText() {
  const raw = useLocale();
  const locale: AdminLocale = isAdminLocale(raw) ? raw : 'az';
  return (field: unknown) => getLocaleText(field, locale);
}

export function useAdminContentLocale(): AdminLocale {
  const raw = useLocale();
  return isAdminLocale(raw) ? raw : 'az';
}
