'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getLocaleText } from '@/lib/locale-content';

type CategoryRow = {
  id: number;
  slug: string;
  name: unknown;
  _count?: { posts: number };
};

export default function BlogCategoriesPage() {
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
          setError(String(data.error || 'Yüklənə bilmədi'));
        }
      })
      .catch(() => setError('Bağlantı xətası'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Bu kateqoriyanı silmək istəyirsiniz? Yazılarda kateqoriya boş qalacaq.')) return;

    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      const data = await res.json();
      alert(data.error || 'Silinə bilmədi');
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
            ← Blog
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Kateqoriyaları</h1>
        </div>
        <Link
          href="/admin/blog/categories/new"
          className="inline-flex justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
        >
          + Yeni Kateqoriya
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
              <th className="px-6 py-3">Ad (AZ)</th>
              <th className="px-6 py-3">Slug</th>
              <th className="px-6 py-3">Yazı sayı</th>
              <th className="px-6 py-3 text-right">Əməliyyat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Yüklənir...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Kateqoriya yoxdur.
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
                      Redaktə
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Sil
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
