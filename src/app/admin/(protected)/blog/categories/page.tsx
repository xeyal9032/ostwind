'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getLocaleText } from '@/lib/locale-content';

type CategoryRow = {
  id: number;
  slug: string;
  name: unknown;
  _count?: { posts: number };
};

export default function BlogCategoriesPage() {
  const t = useTranslations('blog');
  const tCommon = useTranslations('common');
  const [items, setItems] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
          setError('');
        } else {
          setError(String(data.error || tCommon('loadFailed')));
        }
      })
      .catch(() => setError(tCommon('connectionError')))
      .finally(() => setLoading(false));
  }, [tCommon]);

  const handleDelete = async (id: number) => {
    if (!confirm(t('confirmDeleteCategoryDetail'))) return;

    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      const data = await res.json();
      alert(data.error || tCommon('deleteFailed'));
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <Link
            href="/admin/blog"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 mb-2 inline-block"
          >
            {t('backToBlog')}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('categoriesSection')}</h1>
        </div>
        <Link
          href="/admin/blog/categories/new"
          className="inline-flex justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
        >
          {t('addCategory')}
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3">{t('colTitleTr')}</th>
              <th className="px-6 py-3">{t('colSlug')}</th>
              <th className="px-6 py-3">{t('postCountCol')}</th>
              <th className="px-6 py-3 text-right">{tCommon('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  {tCommon('loading')}
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  {t('noCategory')}
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 font-medium">
                    {getLocaleText(item.name, 'az') || getLocaleText(item.name, 'tr') || '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{item.slug}</td>
                  <td className="px-6 py-4 text-gray-500">{item._count?.posts ?? 0}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link
                      href={`/admin/blog/categories/${item.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      {tCommon('edit')}
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:underline"
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
