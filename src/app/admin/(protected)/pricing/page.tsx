'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getLocaleText, mergeLocaleJson } from '@/lib/locale-content';

type Plan = { id: number; name: unknown; price: string; isPopular: boolean };

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch('/api/admin/pricing')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setPlans(data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Bu planı silmek istiyor musunuz?')) return;
    const res = await fetch(`/api/admin/pricing/${id}`, { method: 'DELETE' });
    if (res.ok) setPlans((p) => p.filter((x) => x.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fiyatlandırma</h1>
        <Link href="/admin/pricing/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + Yeni Plan
        </Link>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3">Ad (TR)</th>
              <th className="px-6 py-3">Fiyat</th>
              <th className="px-6 py-3">Popüler</th>
              <th className="px-6 py-3 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Yükleniyor...</td></tr>
            ) : plans.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Plan yok.</td></tr>
            ) : (
              plans.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 font-medium">{getLocaleText(p.name, 'tr')}</td>
                  <td className="px-6 py-4">{p.price}</td>
                  <td className="px-6 py-4">{p.isPopular ? '✓' : '—'}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link href={`/admin/pricing/${p.id}/edit`} className="text-blue-600 hover:underline">Düzenle</Link>
                    <button type="button" onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Sil</button>
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
