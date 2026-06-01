'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useApplicationStatusLabel } from '@/components/admin/useApplicationStatusLabel';

type Row = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  universityName: string;
  studyType: string;
  status: string;
  readAt: string | null;
  createdAt: string;
};

export default function OnlineAdmissionsPage() {
  const t = useTranslations('onlineAdmissions');
  const tCommon = useTranslations('common');
  const statusLabel = useApplicationStatusLabel();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/online-admissions')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{t('intro')}</p>

      {loading ? (
        <p className="text-gray-500">{tCommon('loading')}</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">{t('empty')}</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-800">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left">{t('colStudent')}</th>
                <th className="px-4 py-3 text-left">{t('colUniversity')}</th>
                <th className="px-4 py-3 text-left">{t('colPhone')}</th>
                <th className="px-4 py-3 text-left">{t('colStatus')}</th>
                <th className="px-4 py-3 text-left">{t('colDate')}</th>
                <th className="px-4 py-3 text-right">{t('colActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {items.map((a) => (
                <tr key={a.id} className="bg-white dark:bg-zinc-950">
                  <td className="px-4 py-3">
                    <span className="font-medium">
                      {a.firstName} {a.lastName}
                    </span>
                    <br />
                    <span className="text-gray-500 text-xs">{a.email}</span>
                    {!a.readAt && (
                      <span className="ml-2 inline-block text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                        {tCommon('newBadge')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{a.universityName}</td>
                  <td className="px-4 py-3">{a.phone}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium">{statusLabel(a.status)}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(a.createdAt).toLocaleDateString('az-AZ')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/online-admissions/${a.id}`}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {tCommon('view')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
