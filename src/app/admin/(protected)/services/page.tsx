'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { isServiceIconKey } from '@/lib/service-icon-options';
import { useAdminLocaleFieldText } from '@/lib/use-admin-locale-field';

interface Service {
  id: number;
  slug: string;
  title: Record<string, string>;
  icon: string | null;
  createdAt: string;
}

export default function ServicesPage() {
  const t = useTranslations('services');
  const tCommon = useTranslations('common');
  const tIcons = useTranslations('services.icons');
  const fieldText = useAdminLocaleFieldText();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/admin/services');
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        } else {
          setError(t('loadError'));
        }
      } catch {
        setError(tCommon('connectionError'));
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [t, tCommon]);

  const handleDelete = async (id: number) => {
    if (!confirm(t('confirmDelete'))) return;

    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setServices(services.filter((s) => s.id !== id));
      } else {
        alert(tCommon('deleteFailed'));
      }
    } catch {
      alert(tCommon('connectionError'));
    }
  };

  if (loading) {
    return <div className="text-center py-10">{tCommon('loading')}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <Link
          href="/admin/services/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
        >
          {t('addButton')}
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-zinc-800/50">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('colIcon')}
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('colTitleAz')}
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('colSlug')}
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('colCreated')}
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                {tCommon('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {service.icon && isServiceIconKey(service.icon)
                    ? tIcons(`${service.icon}.label`)
                    : service.icon || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                  {fieldText(service.title) || tCommon('unnamed')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{service.slug}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(service.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-3">
                  <Link
                    href={`/admin/services/${service.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    {tCommon('edit')}
                  </Link>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                  >
                    {tCommon('delete')}
                  </button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                  {t('empty')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
