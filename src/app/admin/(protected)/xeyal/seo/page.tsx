'use client';

import { useCallback, useEffect, useState } from 'react';

type SeoItem = {
  id: number;
  slug: string;
  title?: unknown;
  name?: unknown;
  metaTitle: unknown;
  metaDescription: unknown;
  ogImage: string | null;
};

type SeoData = {
  posts: SeoItem[];
  services: SeoItem[];
  universities: SeoItem[];
};

type EditState = {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
};

function jsonLabel(value: unknown, fallback = ''): string {
  if (value == null) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    const o = value as Record<string, string>;
    return o.tr || o.az || o.en || Object.values(o)[0] || fallback;
  }
  return fallback;
}

function jsonField(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return jsonLabel(value);
  return String(value);
}

export default function XeyalSeoPage() {
  const [data, setData] = useState<SeoData | null>(null);
  const [edits, setEdits] = useState<Record<string, EditState>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/xeyal/seo');
    const json = await res.json();
    if (res.ok) {
      setData(json);
      const next: Record<string, EditState> = {};
      const add = (type: string, items: SeoItem[]) => {
        for (const item of items) {
          const key = `${type}-${item.id}`;
          next[key] = {
            metaTitle: jsonField(item.metaTitle),
            metaDescription: jsonField(item.metaDescription),
            ogImage: item.ogImage || '',
          };
        }
      };
      add('post', json.posts);
      add('service', json.services);
      add('university', json.universities);
      setEdits(next);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (type: 'post' | 'service' | 'university', id: number) => {
    const key = `${type}-${id}`;
    const edit = edits[key];
    if (!edit) return;
    setSavingKey(key);
    try {
      const res = await fetch('/api/admin/xeyal/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          id,
          metaTitle: edit.metaTitle || null,
          metaDescription: edit.metaDescription || null,
          ogImage: edit.ogImage || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Kaydedilemedi');
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Hata');
    } finally {
      setSavingKey(null);
    }
  };

  const renderSection = (
    title: string,
    type: 'post' | 'service' | 'university',
    items: SeoItem[],
    nameKey: 'title' | 'name',
  ) => (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">Kayıt yok.</p>
      ) : (
        items.map((item) => {
          const key = `${type}-${item.id}`;
          const edit = edits[key];
          const label = jsonLabel(item[nameKey], item.slug);
          if (!edit) return null;
          return (
            <div
              key={key}
              className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 space-y-3"
            >
              <p className="font-medium text-gray-900 dark:text-white">
                {label} <span className="text-gray-400 text-sm">/{item.slug}</span>
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${key}-title`} className="block text-xs font-medium text-gray-500 mb-1">
                    Meta başlık
                  </label>
                  <input
                    id={`${key}-title`}
                    value={edit.metaTitle}
                    onChange={(e) =>
                      setEdits((prev) => ({
                        ...prev,
                        [key]: { ...prev[key], metaTitle: e.target.value },
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor={`${key}-og`} className="block text-xs font-medium text-gray-500 mb-1">
                    OG görsel URL
                  </label>
                  <input
                    id={`${key}-og`}
                    value={edit.ogImage}
                    onChange={(e) =>
                      setEdits((prev) => ({
                        ...prev,
                        [key]: { ...prev[key], ogImage: e.target.value },
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor={`${key}-desc`} className="block text-xs font-medium text-gray-500 mb-1">
                  Meta açıklama
                </label>
                <textarea
                  id={`${key}-desc`}
                  value={edit.metaDescription}
                  onChange={(e) =>
                    setEdits((prev) => ({
                      ...prev,
                      [key]: { ...prev[key], metaDescription: e.target.value },
                    }))
                  }
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
                />
              </div>
              <button
                type="button"
                disabled={savingKey === key}
                onClick={() => save(type, item.id)}
                className="px-3 py-1.5 text-sm bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg"
              >
                {savingKey === key ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          );
        })
      )}
    </section>
  );

  if (loading) return <p className="text-gray-500">Yükleniyor...</p>;
  if (!data) return <p className="text-red-500">Veri yüklenemedi.</p>;

  return (
    <div className="space-y-10">
      {renderSection('Blog yazıları', 'post', data.posts, 'title')}
      {renderSection('Hizmetler', 'service', data.services, 'title')}
      {renderSection('Üniversiteler', 'university', data.universities, 'name')}
    </div>
  );
}
