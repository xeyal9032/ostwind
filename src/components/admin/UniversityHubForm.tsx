'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import ImageUploadField from '@/components/admin/ImageUploadField';
import HubMediaPreview from '@/components/admin/HubMediaPreview';
import { getContentLocaleTabs } from '@/lib/admin-content-locales';
import {
  HUB_ACCENT_COLORS,
  HUB_DEFAULT_MEDIA,
  resolveHubFlagUrl,
} from '@/lib/university-hub';

type LocaleRecord = Record<string, string>;

export type HubFormState = {
  slug: string;
  icon: string;
  flagImage: string;
  image: string;
  accentColor: string;
  sortOrder: number;
  isActive: boolean;
  title: LocaleRecord;
  subtitle: LocaleRecord;
};

type Props = {
  initial: HubFormState;
  hubId?: number;
};

export default function UniversityHubForm({ initial, hubId }: Props) {
  const t = useTranslations('universityHubs');
  const tCommon = useTranslations('common');
  const tLocales = useTranslations('contentLocales');
  const LOCALES = getContentLocaleTabs(tLocales);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('tr');
  const [form, setForm] = useState<HubFormState>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const previewFlag =
    form.flagImage ||
    resolveHubFlagUrl({ slug: form.slug, flagImage: form.flagImage, icon: form.icon }) ||
    HUB_DEFAULT_MEDIA[form.slug]?.flag ||
    '';
  const previewCampus =
    form.image || HUB_DEFAULT_MEDIA[form.slug]?.image || '';

  const setLang = (field: 'title' | 'subtitle', lang: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const url = hubId ? `/api/admin/university-hubs/${hubId}` : '/api/admin/university-hubs';
    const method = hubId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || tCommon('saveFailed'));
      router.push('/admin/university-hubs');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : tCommon('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap gap-2">
        {LOCALES.map((loc) => (
          <button
            key={loc.code}
            type="button"
            onClick={() => setActiveTab(loc.code)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              activeTab === loc.code
                ? 'bg-violet-600 text-white'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-600'
            }`}
          >
            {loc.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
        <div>
          <label htmlFor="hub-slug" className="block text-sm font-medium mb-1">
            {t('slug')}
          </label>
          <input
            id="hub-slug"
            name="slug"
            type="text"
            required
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 text-sm"
            placeholder="ukraine"
          />
          <p className="text-xs text-gray-500 mt-1">{t('slugHint')}</p>
        </div>
        <div>
          <label htmlFor="hub-icon" className="block text-sm font-medium mb-1">
            {t('icon')}
          </label>
          <input
            id="hub-icon"
            name="icon"
            type="text"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 text-sm"
            placeholder="🇺🇦"
          />
        </div>
        <div>
          <label htmlFor="hub-sort-order" className="block text-sm font-medium mb-1">
            {t('sortOrder')}
          </label>
          <input
            id="hub-sort-order"
            name="sortOrder"
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="hub-accent-color" className="block text-sm font-medium mb-1">
            {t('accentColor')}
          </label>
          <select
            id="hub-accent-color"
            name="accentColor"
            value={form.accentColor}
            onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
            className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 text-sm"
          >
            {HUB_ACCENT_COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <ImageUploadField
            label={t('flagImage')}
            value={form.flagImage}
            onChange={(url) => setForm({ ...form, flagImage: url })}
          />
          <p className="text-xs text-gray-500 mt-1">{t('flagImageHint')}</p>
        </div>
        <div className="sm:col-span-2">
          <ImageUploadField
            label={t('campusImage')}
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />
          <p className="text-xs text-gray-500 mt-1">{t('campusImageHint')}</p>
        </div>
        <div className="sm:col-span-2">
          <HubMediaPreview
            flagUrl={previewFlag || undefined}
            campusUrl={previewCampus || undefined}
            title={form.title.tr || form.title.az || form.slug}
          />
        </div>
        <div className="sm:col-span-2 flex items-center gap-2">
          <input
            id="hub-active"
            name="isActive"
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          <label htmlFor="hub-active" className="text-sm">
            {t('isActive')}
          </label>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 space-y-4">
        <div>
          <label htmlFor="hub-field-title" className="block text-sm font-medium mb-1">
            {t('fieldTitle')}
          </label>
          <input
            id="hub-field-title"
            name="fieldTitle"
            type="text"
            value={form.title[activeTab] ?? ''}
            onChange={(e) => setLang('title', activeTab, e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="hub-subtitle" className="block text-sm font-medium mb-1">
            {t('subtitle')}
          </label>
          <textarea
            id="hub-subtitle"
            name="subtitle"
            rows={2}
            value={form.subtitle[activeTab] ?? ''}
            onChange={(e) => setLang('subtitle', activeTab, e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {loading ? tCommon('saving') : tCommon('save')}
        </button>
        <Link href="/admin/university-hubs" className="text-sm text-gray-500 hover:text-gray-800">
          {tCommon('cancel')}
        </Link>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </form>
  );
}
