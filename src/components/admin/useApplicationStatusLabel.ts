'use client';

import { useTranslations } from 'next-intl';
import {
  APPLICATION_STATUS_KEYS,
  type ApplicationStatus,
} from '@/lib/application-status';

export function useApplicationStatusLabel() {
  const t = useTranslations('status');

  return (status: string): string => {
    if ((APPLICATION_STATUS_KEYS as readonly string[]).includes(status)) {
      return t(status as ApplicationStatus);
    }
    return status;
  };
}
