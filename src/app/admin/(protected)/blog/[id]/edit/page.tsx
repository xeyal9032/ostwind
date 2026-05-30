'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import LocaleJsonEditor from '@/components/admin/LocaleJsonEditor';
import { EMPTY_LOCALES } from '@/components/admin/LocaleJsonEditor';
import ImageUploadField from '@/components/admin/ImageUploadField';
import BlogCategorySelect from '@/components/admin/BlogCategorySelect';
import { mergeLocaleJson, sanitizeLocaleJson } from '@/lib/locale-content';

export default function EditBlogPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('tr');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [published, setPublished] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [localeValues, setLocaleValues] = useState({
    title: { ...EMPTY_LOCALES },
    content: { ...EMPTY_LOCALES },
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/blog/${id}`);
        if (res.ok) {
          const data = await res.json();
          setSlug(data.slug || '');
          setImage(data.image || '');
          setPublished(Boolean(data.published));
          setCategoryId(data.categoryId ? String(data.categoryId) : '');
          setLocaleValues({
            title: mergeLocaleJson(data.title),
            content: mergeLocaleJson(data.content),
          });
        } else {
          setError('Yazı bulunamadı');
        }
      } catch {
        setError('Bağlantı hatası');
      } finally {
        setPageLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

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
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          image: image || null,
          published,
          categoryId: categoryId ? Number(categoryId) : null,
          title: sanitizeLocaleJson(localeValues.title),
          content: sanitizeLocaleJson(localeValues.content),
        }),
      });

      if (res.ok) {
        router.push('/admin/blog');
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

  if (pageLoading) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Yazısını Düzenle</h1>
        <Link
          href="/admin/blog"
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
        <div className="mb-8 pb-8 border-b border-gray-200 dark:border-zinc-800 space-y-6">
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slug <span className="text-red-500">*</span>
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
                    .replace(/-+/g, '-')
                )
              }
            />
          </div>
          <ImageUploadField value={image} onChange={setImage} />
          <BlogCategorySelect value={categoryId} onChange={setCategoryId} />
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Yayınla</span>
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
            { key: 'title', label: 'Başlık' },
            { key: 'content', label: 'İçerik', multiline: true },
          ]}
        />

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
