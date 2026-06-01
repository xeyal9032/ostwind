'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
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

function itemLabel(item: TrashItem): string {
  const title = item.title != null ? getLocaleText(item.title, 'tr') : '';
  const name = item.name != null ? getLocaleText(item.name, 'tr') : '';
  const question = item.question != null ? getLocaleText(item.question, 'tr') : '';
  return title || name || question || item.slug || `#${item.id}`;
}

export default function XeyalTrashPage() {
  const t = useTranslations('xeyal');
  const tCommon = useTranslations('common');
  const [items, setItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const typeLabel = (type: string) => {
    const key = type as 'service' | 'university' | 'blog' | 'team' | 'faq' | 'post' | 'pricing' | 'category';
    if (key === 'post') return t('types.post');
    if (key in { service: 1, university: 1, blog: 1, team: 1, faq: 1, pricing: 1, category: 1 }) {
      return t(`types.${key}` as 'types.service');
    }
    return type;
  };

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
          (a, b) => new Date(b.deletedAt || 0).getTime() - new Date(a.deletedAt || 0).getTime(),
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
      else alert(t('restoreFailed'));
    } finally {
      setBusyKey(null);
    }
  };

  const permanentDelete = async (item: TrashItem) => {
    const label = itemLabel(item);
    const ok = window.confirm(
      t('permanentDeleteConfirm', { label, type: typeLabel(item.type) }),
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
        alert(data.error || t('permanentDeleteFailed'));
      }
    } finally {
      setBusyKey(null);
    }
  };

  if (loading) return <p className="text-gray-500">{tCommon('loading')}</p>;

  if (items.length === 0) {
    return <p className="text-gray-500">{t('trashEmpty')}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-800">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3 text-left">{t('colType')}</th>
            <th className="px-4 py-3 text-left">{tCommon('name')}</th>
            <th className="px-4 py-3 text-left">{t('deletedAt')}</th>
            <th className="px-4 py-3 text-right">{tCommon('actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
          {items.map((item) => {
            const key = `${item.type}-${item.id}`;
            return (
              <tr key={key} className="bg-white dark:bg-zinc-950">
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-xs">
                    {typeLabel(item.type)}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">{itemLabel(item)}</td>
                <td className="px-4 py-3 text-gray-500">
                  {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      disabled={busyKey === `restore:${key}` || busyKey === `delete:${key}`}
                      onClick={() => restore(item.type, item.id)}
                      className="text-violet-600 hover:text-violet-800 font-medium disabled:opacity-50"
                    >
                      {busyKey === `restore:${key}` ? tCommon('loading') : t('restore')}
                    </button>
                    <button
                      type="button"
                      disabled={busyKey === `restore:${key}` || busyKey === `delete:${key}`}
                      onClick={() => permanentDelete(item)}
                      className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                    >
                      {busyKey === `delete:${key}` ? tCommon('deleting') : t('permanentDelete')}
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
