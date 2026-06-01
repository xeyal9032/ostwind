'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { getContentLocaleTabs } from '@/lib/admin-content-locales';
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

type LocaleField = keyof Omit<FormData, 'storyImage'>;

export default function AdminAboutPage() {
  const t = useTranslations('about');
  const tCommon = useTranslations('common');
  const tLocales = useTranslations('contentLocales');
  const LOCALES = getContentLocaleTabs(tLocales);

  const [activeTab, setActiveTab] = useState('tr');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  const STORY_FIELDS = useMemo(
    () =>
      [
        { key: 'storyTitle' as LocaleField, label: t('storyTitle') },
        { key: 'storyText' as LocaleField, label: t('storyText'), multiline: true },
      ],
    [t],
  );

  const COMPANY_FIELDS = useMemo(
    () =>
      [
        { key: 'companyTitle' as LocaleField, label: t('companyTitle') },
        { key: 'missionTitle' as LocaleField, label: t('missionBox1Title') },
        { key: 'missionText' as LocaleField, label: t('missionBox1Text'), multiline: true },
        { key: 'valuesTitle' as LocaleField, label: t('valuesBox2Title') },
        { key: 'valuesText' as LocaleField, label: t('valuesBox2Text'), multiline: true },
        {
          key: 'teamTitle' as LocaleField,
          label: t('teamBox3Title'),
          hint: t('storyImageHint'),
        },
        { key: 'teamText' as LocaleField, label: t('teamBox3Text'), multiline: true },
      ],
    [t],
  );

  useEffect(() => {
    fetch('/api/admin/about')
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            setError(tCommon('sessionExpired'));
            return;
          }
          setFormData(defaultFormData());
          setError(t('loadFallback'));
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
        setError(tCommon('connectionFallback'));
      })
      .finally(() => setPageLoading(false));
  }, [t, tCommon]);

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
        setSuccess(t('saved'));
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
        setError(typeof data.error === 'string' ? data.error : tCommon('saveRecordFailed', { status: res.status }));
      }
    } catch {
      setError(tCommon('connectionError'));
    } finally {
      setLoading(false);
    }
  };

  const renderLocaleFields = (
    fields: { key: LocaleField; label: string; multiline?: boolean; hint?: string }[],
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
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">{tCommon('loading')}</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('intro')}</p>
        </div>
        <Link
          href="/az/about"
          target="_blank"
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {t('previewPage')}
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
          label={t('storyImage')}
          value={formData.storyImage}
          onChange={(storyImage) => setFormData((prev) => ({ ...prev, storyImage }))}
          placeholder={t('storyImagePlaceholder')}
        />

        <div className="flex border-b border-gray-200 dark:border-zinc-800 space-x-1 overflow-x-auto">
          {LOCALES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setActiveTab(lang.code)}
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

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('storySection')}</h2>
          {renderLocaleFields(STORY_FIELDS)}
          <p className="mt-2 text-xs text-gray-500">{t('storyParagraphHint')}</p>
        </section>

        <section className="pt-8 border-t border-gray-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{t('companySection')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('companySectionHint')}</p>
          {renderLocaleFields(COMPANY_FIELDS)}
        </section>

        <div className="pt-6 border-t border-gray-200 dark:border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? tCommon('saving') : tCommon('save')}
          </button>
        </div>
      </form>
    </div>
  );
}
