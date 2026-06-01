'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LocaleJsonEditor from '@/components/admin/LocaleJsonEditor';
import { EMPTY_LOCALES } from '@/components/admin/LocaleJsonEditor';
import { mergeLocaleJson, sanitizeLocaleJson } from '@/lib/locale-content';

export default function EditBlogCategoryPage() {
  const router = useRouter();
  const { id } = useParams();
  const t = useTranslations('blog');
  const tCommon = useTranslations('common');
  const [activeTab, setActiveTab] = useState('az');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [slug, setSlug] = useState('');
  const [name, setName] = useState({ ...EMPTY_LOCALES });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/admin/categories/${id}`);
        if (res.ok) {
          const data = await res.json();
          setSlug(data.slug || '');
          setName(mergeLocaleJson(data.name));
        } else {
          setError(t('categoryNotFound'));
        }
      } catch {
        setError(tCommon('connectionError'));
      } finally {
        setPageLoading(false);
      }
    };
    if (id) fetchCategory();
  }, [id, t, tCommon]);

  const handleLocaleChange = (fieldKey: string, locale: string, value: string) => {
    if (fieldKey === 'name') {
      setName((prev) => ({ ...prev, [locale]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          name: sanitizeLocaleJson(name),
        }),
      });

      if (res.ok) {
        router.push('/admin/blog/categories');
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
    return <div className="text-center py-12 text-gray-500">{tCommon('loading')}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('editCategory')}</h1>
        <Link href="/admin/blog/categories" className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
          &larr; {tCommon('back')}
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
        <div className="mb-8">
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('slugField')} <span className="text-red-500">*</span>
          </label>
          <input
            id="slug"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500"
            value={slug}
            onChange={(e) =>
              setSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9-]/g, '-')
                  .replace(/-+/g, '-'),
              )
            }
          />
        </div>

        <LocaleJsonEditor
          activeTab={activeTab}
          onTabChange={setActiveTab}
          values={{ name }}
          onChange={handleLocaleChange}
          fields={[{ key: 'name', label: t('categoryNameField') }]}
        />

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? tCommon('saving') : tCommon('save')}
          </button>
        </div>
      </form>
    </div>
  );
}
