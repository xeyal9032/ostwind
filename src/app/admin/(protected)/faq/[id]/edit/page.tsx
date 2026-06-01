'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LocaleJsonEditor from '@/components/admin/LocaleJsonEditor';
import { EMPTY_LOCALES } from '@/components/admin/LocaleJsonEditor';
import { mergeLocaleJson, sanitizeLocaleJson } from '@/lib/locale-content';

export default function EditFaqPage() {
  const t = useTranslations('faq');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('tr');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [localeValues, setLocaleValues] = useState({
    question: { ...EMPTY_LOCALES },
    answer: { ...EMPTY_LOCALES },
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`/api/admin/faq/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCategory(data.category || '');
          setLocaleValues({
            question: mergeLocaleJson(data.question),
            answer: mergeLocaleJson(data.answer),
          });
        } else {
          setError(tCommon('notFound'));
        }
      } catch {
        setError(tCommon('connectionError'));
      } finally {
        setPageLoading(false);
      }
    };
    if (id) fetchItem();
  }, [id, tCommon]);

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
      const res = await fetch(`/api/admin/faq/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: category.trim() || null,
          question: sanitizeLocaleJson(localeValues.question),
          answer: sanitizeLocaleJson(localeValues.answer),
        }),
      });

      if (res.ok) {
        router.push('/admin/faq');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || tCommon('error'));
      }
    } catch {
      setError(tCommon('connectionError'));
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400">{tCommon('loading')}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('edit')}</h1>
        <Link
          href="/admin/faq"
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {tCommon('backToList')}
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
        <div className="mb-8 pb-8 border-b border-gray-200 dark:border-zinc-800">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('categoryOptional')}
          </label>
          <input
            id="category"
            type="text"
            className="w-full max-w-md px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('multiLocaleContent')}</h2>
        <LocaleJsonEditor
          activeTab={activeTab}
          onTabChange={setActiveTab}
          values={localeValues}
          onChange={handleLocaleChange}
          fields={[
            { key: 'question', label: t('question') },
            { key: 'answer', label: t('answer'), multiline: true },
          ]}
        />

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? tCommon('saving') : tCommon('saveChanges')}
          </button>
        </div>
      </form>
    </div>
  );
}
