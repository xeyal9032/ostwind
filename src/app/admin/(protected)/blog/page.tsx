'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getLocaleText } from '@/lib/locale-content';

type BlogPost = {
  id: number;
  slug: string;
  title: unknown;
  published: boolean;
  createdAt: string;
  category?: { name: unknown } | null;
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/blog')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Bu yazıyı silmek istiyor musunuz?')) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    if (res.ok) setPosts((prev) => prev.filter((x) => x.id !== id));
  };

  const draftCount = posts.filter((p) => !p.published).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sitede yalnızca <strong>Yayında</strong> işaretli yazılar görünür.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/blog/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            + Yeni Yazı
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Blog Kategorileri</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Yazılara kategori atamak için önce kategori oluşturun.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/blog/categories"
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
              Kategorileri yönet
            </Link>
            <Link
              href="/admin/blog/categories/new"
              className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium"
            >
              + Yeni kategori
            </Link>
          </div>
        </div>

        {draftCount > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 p-5">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>{draftCount}</strong> taslak yazı var — sitede görünmez. Düzenle → &quot;Yayınla&quot; işaretleyin.
            </p>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3">Başlık (TR)</th>
              <th className="px-6 py-3">Slug</th>
              <th className="px-6 py-3">Kategori</th>
              <th className="px-6 py-3">Durum</th>
              <th className="px-6 py-3 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Yükleniyor...
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Yazı yok.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 font-medium">{getLocaleText(post.title, 'tr')}</td>
                  <td className="px-6 py-4 text-gray-500">{post.slug}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {post.category
                      ? getLocaleText(post.category.name, 'tr') ||
                        getLocaleText(post.category.name, 'az') ||
                        '—'
                      : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.published
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400'
                      }`}
                    >
                      {post.published ? 'Yayında' : 'Taslak'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    {post.published && (
                      <a
                        href={`/tr/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        Sitede gör
                      </a>
                    )}
                    <Link href={`/admin/blog/${post.id}/edit`} className="text-blue-600 hover:underline">
                      Düzenle
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:underline"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
