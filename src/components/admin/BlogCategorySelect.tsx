'use client';

import { useEffect, useState } from 'react';
import { getLocaleText } from '@/lib/locale-content';

type CategoryRow = {
  id: number;
  slug: string;
  name: unknown;
};

type BlogCategorySelectProps = {
  value: string;
  onChange: (categoryId: string) => void;
};

export default function BlogCategorySelect({ value, onChange }: BlogCategorySelectProps) {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <label htmlFor="blog-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Kategori
      </label>
      <select
        id="blog-category"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
      >
        <option value="">— Kategori yok —</option>
        {categories.map((category) => (
          <option key={category.id} value={String(category.id)}>
            {getLocaleText(category.name, 'az') || getLocaleText(category.name, 'tr') || category.slug}
          </option>
        ))}
      </select>
      {!loading && categories.length === 0 && (
        <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
          Henüz kategori yok.{' '}
          <a href="/admin/blog/categories/new" className="underline font-medium">
            Yeni kategori ekle
          </a>
          {' '}veya{' '}
          <a href="/admin/blog/categories" className="underline font-medium">
            kategorileri yönet
          </a>
        </p>
      )}
    </div>
  );
}
