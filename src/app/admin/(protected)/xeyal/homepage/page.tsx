'use client';

import { useCallback, useEffect, useState } from 'react';

const LOCALES = ['az', 'tr', 'en'] as const;
type Locale = (typeof LOCALES)[number];

const KEY_LABELS: Record<string, string> = {
  heroTitle1: 'Başlık 1',
  heroTitleHighlight: 'Vurgulu başlık',
  heroDescription: 'Açıklama',
  heroApplyNow: 'Başvur butonu',
  heroExplore: 'Keşfet butonu',
};

type Content = Record<string, Record<string, string>>;

export default function XeyalHomepagePage() {
  const [locale, setLocale] = useState<Locale>('tr');
  const [keys, setKeys] = useState<string[]>([]);
  const [content, setContent] = useState<Content>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/xeyal/homepage');
    const data = await res.json();
    if (res.ok) {
      setContent((data.content as Content) || {});
      setKeys(data.keys || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const getValue = (key: string) => content[locale]?.[key] ?? '';

  const setValue = (key: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [locale]: { ...(prev[locale] || {}), [key]: value },
    }));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/xeyal/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Kaydedilemedi');
      }
      setMessage('Kaydedildi.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Hata');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500">Yükleniyor...</p>;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {LOCALES.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setLocale(loc)}
            className={`px-4 py-2 rounded-lg text-sm font-medium uppercase ${
              locale === loc
                ? 'bg-violet-600 text-white'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      <form onSubmit={save} className="space-y-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
        {keys.map((key) => (
          <div key={key}>
            <label htmlFor={`home-${locale}-${key}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {KEY_LABELS[key] || key}
            </label>
            {key.includes('Description') ? (
              <textarea
                id={`home-${locale}-${key}`}
                name={key}
                value={getValue(key)}
                onChange={(e) => setValue(key, e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
              />
            ) : (
              <input
                id={`home-${locale}-${key}`}
                name={key}
                type="text"
                value={getValue(key)}
                onChange={(e) => setValue(key, e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
              />
            )}
          </div>
        ))}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
          {message && (
            <p className={`text-sm ${message === 'Kaydedildi.' ? 'text-green-600' : 'text-red-500'}`}>
              {message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
