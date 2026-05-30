'use client';

import { useEffect, useState } from 'react';

type Application = {
  id: number;
  studentName: string;
  email: string;
  phone: string;
  universityId: number | null;
  message: string | null;
  status: string;
  createdAt: string;
};

const STATUS_OPTIONS = ['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'] as const;

export default function ApplicationsPage() {
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/applications')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status: updated.status } : a)));
    } else {
      alert('Durum güncellenemedi.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu başvuruyu silmek istediğinize emin misiniz?')) return;
    const res = await fetch(`/api/admin/applications/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((prev) => prev.filter((a) => a.id !== id));
    } else {
      alert('Silme işlemi başarısız oldu.');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Başvurular</h1>
      {loading ? (
        <p className="text-gray-500">Yükleniyor...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Henüz başvuru yok.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-800">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left">Öğrenci</th>
                <th className="px-4 py-3 text-left">E-posta</th>
                <th className="px-4 py-3 text-left">Telefon</th>
                <th className="px-4 py-3 text-left">Durum</th>
                <th className="px-4 py-3 text-left">Tarih</th>
                <th className="px-4 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {items.map((a) => (
                <tr key={a.id} className="bg-white dark:bg-zinc-950">
                  <td className="px-4 py-3 font-medium">{a.studentName}</td>
                  <td className="px-4 py-3">{a.email}</td>
                  <td className="px-4 py-3">{a.phone}</td>
                  <td className="px-4 py-3">
                    <select
                      id={`application-status-${a.id}`}
                      name={`application-status-${a.id}`}
                      aria-label={`${a.studentName} — başvuru durumu`}
                      value={a.status}
                      onChange={(e) => handleStatusChange(a.id, e.target.value)}
                      className="text-xs rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(a.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(a.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 font-medium"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
