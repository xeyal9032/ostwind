'use client';

import { useTranslations } from 'next-intl';

export default function AdminLoading({ className = 'text-gray-500' }: { className?: string }) {
  const t = useTranslations('common');
  return <p className={className}>{t('loading')}</p>;
}
