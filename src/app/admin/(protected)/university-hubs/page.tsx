'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAdminLocaleFieldText } from '@/lib/use-admin-locale-field';

type Hub = {
  id: number;
  slug: string;
  title?: Record<string, string>;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  _count: { universities: number };
};

export default function AdminUniversityHubsPage() {
  const t = useTranslations('universityHubs');
  const tCommon = useTranslations('common');
  const fieldText = useAdminLocaleFieldText();
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch('/api/admin/university-hubs')
      .then((r) => (r.ok ? r.json() : []))
      .then(setHubs)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: number) => {
    if (!confirm(t('confirmDelete'))) return;
    const res = await fetch(`/api/admin/university-hubs/${id}`, { method: 'DELETE' });
    if (res.ok) setHubs((prev) => prev.filter((h) => h.id !== id));
    else alert(tCommon('deleteFailed'));
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('intro')}</p>
        </div>
        <Link
          href="/admin/university-hubs/new"
          className="shrink-0 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          {t('addButton')}
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
            <tr>
              <th className="px-4 py-3 font-semibold">{t('colOrder')}</th>
              <th className="px-4 py-3 font-semibold">{t('colName')}</th>
              <th className="px-4 py-3 font-semibold">slug</th>
              <th className="px-4 py-3 font-semibold">{t('colUniversities')}</th>
              <th className="px-4 py-3 font-semibold">{t('colStatus')}</th>
              <th className="px-4 py-3 font-semibold text-right">{tCommon('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  {tCommon('loading')}
                </td>
              </tr>
            ) : hubs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  {t('empty')}
                </td>
              </tr>
            ) : (
              hubs.map((hub) => (
                <tr key={hub.id}>
                  <td className="px-4 py-3">{hub.sortOrder}</td>
                  <td className="px-4 py-3">
                    <span className="mr-2">{hub.icon}</span>
                    {fieldText(hub.title)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{hub.slug}</td>
                  <td className="px-4 py-3">{hub._count.universities}</td>
                  <td className="px-4 py-3">
                    {hub.isActive ? (
                      <span className="text-green-600">{t('active')}</span>
                    ) : (
                      <span className="text-gray-400">{t('inactive')}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link
                      href={`/admin/university-hubs/${hub.id}/edit`}
                      className="text-violet-600 hover:underline"
                    >
                      {tCommon('edit')}
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(hub.id)}
                      className="text-red-500 hover:underline"
                    >
                      {tCommon('delete')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
