'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getLocaleText } from '@/lib/locale-content';

type FaqItem = {
  id: number;
  question: unknown;
  answer: unknown;
  category: string | null;
};

export default function AdminFaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch('/api/admin/faq')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Bu SSS kaydını silmek istiyor musunuz?')) return;
    const res = await fetch(`/api/admin/faq/${id}`, { method: 'DELETE' });
    if (res.ok) setItems((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SSS</h1>
        <Link
          href="/admin/faq/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Yeni Soru
        </Link>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3">Soru (TR)</th>
              <th className="px-6 py-3">Kategori</th>
              <th className="px-6 py-3 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  Yükleniyor...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  Kayıt yok.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 font-medium">{getLocaleText(item.question, 'tr')}</td>
                  <td className="px-6 py-4 text-gray-500">{item.category || '—'}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link href={`/admin/faq/${item.id}/edit`} className="text-blue-600 hover:underline">
                      Düzenle
                    </Link>
                    <button type="button" onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">
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
