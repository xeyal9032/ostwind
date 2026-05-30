'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LocaleJsonEditor from '@/components/admin/LocaleJsonEditor';
import { EMPTY_LOCALES } from '@/components/admin/LocaleJsonEditor';
import { sanitizeLocaleJson } from '@/lib/locale-content';

export default function NewPricingPlanPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tr');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [price, setPrice] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [localeValues, setLocaleValues] = useState({
    name: { ...EMPTY_LOCALES },
    features: { ...EMPTY_LOCALES },
  });

  const handleLocaleChange = (fieldKey: string, locale: string, value: string) => {
    setLocaleValues((prev) => ({
      ...prev,
      [fieldKey]: { ...prev[fieldKey as keyof typeof prev], [locale]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price,
          isPopular,
          name: sanitizeLocaleJson(localeValues.name),
          features: sanitizeLocaleJson(localeValues.features),
        }),
      });

      if (res.ok) {
        router.push('/admin/pricing');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Bir hata oluştu');
      }
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Yeni Fiyat Planı</h1>
        <Link
          href="/admin/pricing"
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          &larr; Geri Dön
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 shadow-sm rounded-xl border border-gray-200 dark:border-zinc-800 p-6"
      >
        <div className="mb-8 pb-8 border-b border-gray-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fiyat <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              type="text"
              required
              placeholder="₺9.999 / yıl"
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Popüler plan</span>
            </label>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Çoklu Dil İçerikleri</h2>
        <LocaleJsonEditor
          activeTab={activeTab}
          onTabChange={setActiveTab}
          values={localeValues}
          onChange={handleLocaleChange}
          fields={[
            { key: 'name', label: 'Plan Adı' },
            {
              key: 'features',
              label: 'Özellikler (satır başına bir)',
              multiline: true,
              placeholder: 'Vize danışmanlığı\nKonaklama desteği',
            },
          ]}
        />

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Kaydediliyor...' : 'Planı Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
