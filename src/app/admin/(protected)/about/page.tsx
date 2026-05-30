'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ImageUploadField from '@/components/admin/ImageUploadField';
import {
  DEFAULT_ABOUT_STORY,
  DEFAULT_COMPANY_SECTION,
  mergeLocaleJson,
} from '@/lib/about-defaults';

type LocaleRecord = Record<string, string>;

type FormData = {
  storyImage: string;
  storyTitle: LocaleRecord;
  storyText: LocaleRecord;
  companyTitle: LocaleRecord;
  missionTitle: LocaleRecord;
  missionText: LocaleRecord;
  valuesTitle: LocaleRecord;
  valuesText: LocaleRecord;
  teamTitle: LocaleRecord;
  teamText: LocaleRecord;
};

function defaultFormData(): FormData {
  return {
    storyImage: DEFAULT_ABOUT_STORY.storyImage,
    storyTitle: { ...DEFAULT_ABOUT_STORY.storyTitle },
    storyText: { ...DEFAULT_ABOUT_STORY.storyText },
    companyTitle: { ...DEFAULT_COMPANY_SECTION.companyTitle },
    missionTitle: { ...DEFAULT_COMPANY_SECTION.missionTitle },
    missionText: { ...DEFAULT_COMPANY_SECTION.missionText },
    valuesTitle: { ...DEFAULT_COMPANY_SECTION.valuesTitle },
    valuesText: { ...DEFAULT_COMPANY_SECTION.valuesText },
    teamTitle: { ...DEFAULT_COMPANY_SECTION.teamTitle },
    teamText: { ...DEFAULT_COMPANY_SECTION.teamText },
  };
}

const LOCALES = [
  { code: 'tr', name: 'Türkçe' },
  { code: 'en', name: 'English' },
  { code: 'az', name: 'Azərbaycanca' },
  { code: 'ru', name: 'Русский' },
  { code: 'uk', name: 'Українська' },
  { code: 'ge', name: 'ქართული' },
];

type LocaleField = keyof Omit<FormData, 'storyImage'>;

const STORY_FIELDS: { key: LocaleField; label: string; multiline?: boolean }[] = [
  { key: 'storyTitle', label: 'Hikaye başlığı' },
  { key: 'storyText', label: 'Hikaye metni', multiline: true },
];

const COMPANY_FIELDS: { key: LocaleField; label: string; multiline?: boolean; hint?: string }[] = [
  { key: 'companyTitle', label: 'Bölüm başlığı (üst)' },
  { key: 'missionTitle', label: 'Kutu 1 — başlık' },
  { key: 'missionText', label: 'Kutu 1 — metin', multiline: true },
  { key: 'valuesTitle', label: 'Kutu 2 — başlık' },
  { key: 'valuesText', label: 'Kutu 2 — metin', multiline: true },
  {
    key: 'teamTitle',
    label: 'Kutu 3 — başlık (isteğe bağlı)',
    hint: 'Boş bırakırsanız sadece numara ve metin gösterilir.',
  },
  { key: 'teamText', label: 'Kutu 3 — metin', multiline: true },
];

export default function AdminAboutPage() {
  const [activeTab, setActiveTab] = useState('tr');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  useEffect(() => {
    fetch('/api/admin/about')
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            setError('Oturum süresi dolmuş olabilir. Tekrar giriş yapın.');
            return;
          }
          setFormData(defaultFormData());
          setError(
            'Kayıtlı içerik yüklenemedi. Varsayılan metinler gösteriliyor — Kaydet ile veritabanına yazabilirsiniz.'
          );
          return;
        }
        const base = defaultFormData();
        setFormData({
          storyImage: data.storyImage || base.storyImage,
          storyTitle: mergeLocaleJson(data.storyTitle),
          storyText: mergeLocaleJson(data.storyText),
          companyTitle: mergeLocaleJson(data.companyTitle ?? base.companyTitle),
          missionTitle: mergeLocaleJson(data.missionTitle ?? base.missionTitle),
          missionText: mergeLocaleJson(data.missionText ?? base.missionText),
          valuesTitle: mergeLocaleJson(data.valuesTitle ?? base.valuesTitle),
          valuesText: mergeLocaleJson(data.valuesText ?? base.valuesText),
          teamTitle: mergeLocaleJson(data.teamTitle ?? base.teamTitle),
          teamText: mergeLocaleJson(data.teamText ?? base.teamText),
        });
      })
      .catch(() => {
        setFormData(defaultFormData());
        setError('Bağlantı hatası. Varsayılan metinler yüklendi.');
      })
      .finally(() => setPageLoading(false));
  }, []);

  const handleLangChange = (field: LocaleField, lang: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccess('Hakkımızda içeriği kaydedildi.');
        const base = defaultFormData();
        setFormData({
          storyImage: data.storyImage || formData.storyImage,
          storyTitle: mergeLocaleJson(data.storyTitle),
          storyText: mergeLocaleJson(data.storyText),
          companyTitle: mergeLocaleJson(data.companyTitle ?? base.companyTitle),
          missionTitle: mergeLocaleJson(data.missionTitle ?? base.missionTitle),
          missionText: mergeLocaleJson(data.missionText ?? base.missionText),
          valuesTitle: mergeLocaleJson(data.valuesTitle ?? base.valuesTitle),
          valuesText: mergeLocaleJson(data.valuesText ?? base.valuesText),
          teamTitle: mergeLocaleJson(data.teamTitle ?? base.teamTitle),
          teamText: mergeLocaleJson(data.teamText ?? base.teamText),
        });
      } else {
        setError(typeof data.error === 'string' ? data.error : `Kayıt başarısız (${res.status})`);
      }
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const renderLocaleFields = (
    fields: { key: LocaleField; label: string; multiline?: boolean; hint?: string }[]
  ) => (
    <div className="space-y-6">
      {fields.map((field) => {
        const inputId = `about-${field.key}-${activeTab}`;
        return (
          <div key={field.key}>
            <label
              htmlFor={inputId}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {field.label} ({activeTab.toUpperCase()})
            </label>
            {field.multiline ? (
              <textarea
                id={inputId}
                name={inputId}
                rows={field.key.includes('Text') && field.key !== 'storyText' ? 4 : 8}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500"
                value={formData[field.key][activeTab] ?? ''}
                onChange={(e) => handleLangChange(field.key, activeTab, e.target.value)}
              />
            ) : (
              <input
                id={inputId}
                name={inputId}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500"
                value={formData[field.key][activeTab] ?? ''}
                onChange={(e) => handleLangChange(field.key, activeTab, e.target.value)}
              />
            )}
            {field.hint && <p className="mt-1 text-xs text-gray-500">{field.hint}</p>}
          </div>
        );
      })}
    </div>
  );

  if (pageLoading) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hakkımızda</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Hikayemiz ve şirket bölümü (3 kutu) — tüm diller.
          </p>
        </div>
        <Link
          href="/az/about"
          target="_blank"
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Sayfayı önizle →
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-lg mb-6">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 shadow-sm rounded-xl border border-gray-200 dark:border-zinc-800 p-6 space-y-10"
      >
        <ImageUploadField
          label="Hikaye görseli"
          value={formData.storyImage}
          onChange={(storyImage) => setFormData((prev) => ({ ...prev, storyImage }))}
          placeholder="/uploads/... veya harici URL"
        />

        <LocaleTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hikayemiz</h2>
          {renderLocaleFields(STORY_FIELDS)}
          <p className="mt-2 text-xs text-gray-500">İki paragraf için araya boş satır ekleyin.</p>
        </section>

        <section className="pt-8 border-t border-gray-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Şirket hakkında (3 kutu)
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Koyu arka planlı bölüm: misyon, değerler ve ekip metni.
          </p>
          {renderLocaleFields(COMPANY_FIELDS)}
        </section>

        <div className="pt-6 border-t border-gray-200 dark:border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}

function LocaleTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (code: string) => void;
}) {
  return (
    <div className="flex border-b border-gray-200 dark:border-zinc-800 space-x-1 overflow-x-auto">
      {LOCALES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => onTabChange(lang.code)}
          className={`py-2 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === lang.code
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
}
