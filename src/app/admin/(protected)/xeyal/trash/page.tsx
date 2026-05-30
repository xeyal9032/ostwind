'use client';

import { useCallback, useEffect, useState } from 'react';
import { getLocaleText } from '@/lib/locale-content';

type TrashItem = {
  id: number;
  type: string;
  slug?: string;
  title?: unknown;
  name?: unknown;
  question?: unknown;
  deletedAt: string | null;
};

type TrashData = {
  posts: TrashItem[];
  services: TrashItem[];
  universities: TrashItem[];
  faqs: TrashItem[];
  pricing: TrashItem[];
  team: TrashItem[];
  categories: TrashItem[];
};

const TYPE_LABELS: Record<string, string> = {
  post: 'Blog',
  service: 'Hizmet',
  university: 'Üniversite',
  faq: 'SSS',
  pricing: 'Fiyat',
  team: 'Ekip',
  category: 'Blog kategorisi',
};

function itemLabel(item: TrashItem): string {
  const title = item.title != null ? getLocaleText(item.title, 'tr') : '';
  const name = item.name != null ? getLocaleText(item.name, 'tr') : '';
  const question = item.question != null ? getLocaleText(item.question, 'tr') : '';
  return title || name || question || item.slug || `#${item.id}`;
}

export default function XeyalTrashPage() {
  const [items, setItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/xeyal/trash');
      const data: TrashData = await res.json();
      if (res.ok) {
        const all = [
          ...data.posts,
          ...data.services,
          ...data.universities,
          ...data.faqs,
          ...data.pricing,
          ...data.team,
          ...(data.categories ?? []),
        ].sort(
          (a, b) =>
            new Date(b.deletedAt || 0).getTime() - new Date(a.deletedAt || 0).getTime(),
        );
        setItems(all);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const restore = async (type: string, id: number) => {
    const key = `${type}-${id}`;
    setBusyKey(`restore:${key}`);
    try {
      const res = await fetch('/api/admin/xeyal/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id }),
      });
      if (res.ok) setItems((prev) => prev.filter((i) => !(i.type === type && i.id === id)));
      else alert('Geri yüklenemedi.');
    } finally {
      setBusyKey(null);
    }
  };

  const permanentDelete = async (item: TrashItem) => {
    const label = itemLabel(item);
    const typeLabel = TYPE_LABELS[item.type] || item.type;
    const ok = window.confirm(
      `"${label}" (${typeLabel}) kalıcı olarak silinecek.\n\nBu işlem geri alınamaz. Devam edilsin mi?`,
    );
    if (!ok) return;

    const key = `${item.type}-${item.id}`;
    setBusyKey(`delete:${key}`);
    try {
      const res = await fetch('/api/admin/xeyal/trash', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: item.type, id: item.id }),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => !(i.type === item.type && i.id === item.id)));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Kalıcı silinemedi.');
      }
    } finally {
      setBusyKey(null);
    }
  };

  if (loading) return <p className="text-gray-500">Yükleniyor...</p>;

  if (items.length === 0) {
    return <p className="text-gray-500">Çöp kutusu boş.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-800">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3 text-left">Tür</th>
            <th className="px-4 py-3 text-left">Başlık</th>
            <th className="px-4 py-3 text-left">Silinme</th>
            <th className="px-4 py-3 text-right">İşlem</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
          {items.map((item) => {
            const key = `${item.type}-${item.id}`;
            return (
              <tr key={key} className="bg-white dark:bg-zinc-950">
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-xs">
                    {TYPE_LABELS[item.type] || item.type}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">{itemLabel(item)}</td>
                <td className="px-4 py-3 text-gray-500">
                  {item.deletedAt
                    ? new Date(item.deletedAt).toLocaleString('tr-TR')
                    : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      disabled={busyKey === `restore:${key}` || busyKey === `delete:${key}`}
                      onClick={() => restore(item.type, item.id)}
                      className="text-violet-600 hover:text-violet-800 font-medium disabled:opacity-50"
                    >
                      {busyKey === `restore:${key}` ? 'Yükleniyor...' : 'Geri yükle'}
                    </button>
                    <button
                      type="button"
                      disabled={busyKey === `restore:${key}` || busyKey === `delete:${key}`}
                      onClick={() => permanentDelete(item)}
                      className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                    >
                      {busyKey === `delete:${key}` ? 'Siliniyor...' : 'Kalıcı sil'}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
