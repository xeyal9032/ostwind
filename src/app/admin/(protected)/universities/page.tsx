'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface University {
  id: number;
  name?: Record<string, string>;
  country?: Record<string, string>;
  city?: Record<string, string>;
}

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await fetch('/api/admin/universities');
        if (res.ok) {
          const data = await res.json();
          setUniversities(data);
        }
      } catch (error) {
        console.error('Failed to fetch universities', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Bu üniversiteyi silmek istediğinize emin misiniz?')) {
      try {
        const res = await fetch(`/api/admin/universities/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setUniversities(prev => prev.filter(uni => uni.id !== id));
        }
      } catch {
        alert('Silme işlemi başarısız oldu.');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Üniversiteler</h1>
        <Link 
          href="/admin/universities/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Yeni Ekle
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">ID</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Üniversite Adı (TR)</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Ülke (TR)</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">Şehir (TR)</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Yükleniyor...</td>
                </tr>
              ) : universities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Henüz üniversite eklenmemiş.</td>
                </tr>
              ) : (
                universities.map((uni) => (
                  <tr key={uni.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{uni.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {uni.name?.tr || uni.name?.en || 'İsimsiz'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {uni.country?.tr || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {uni.city?.tr || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-right space-x-3">
                      <Link 
                        href={`/admin/universities/${uni.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        Düzenle
                      </Link>
                      <button 
                        onClick={() => handleDelete(uni.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
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
    </div>
  );
}
