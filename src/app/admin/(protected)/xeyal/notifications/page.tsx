'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

type Application = {
  id: number;
  studentName: string;
  email: string;
  createdAt: string;
};

type Message = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  createdAt: string;
};

type Data = {
  unreadApplications: number;
  unreadMessages: number;
  recentApplications: Application[];
  recentMessages: Message[];
};

export default function XeyalNotificationsPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/xeyal/notifications');
    const json = await res.json();
    if (res.ok) setData(json);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markRead = async (type: 'applications' | 'messages' | 'all') => {
    setMarking(type);
    try {
      const res = await fetch('/api/admin/xeyal/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      if (res.ok) await load();
      else alert('İşlem başarısız.');
    } finally {
      setMarking(null);
    }
  };

  if (loading) return <p className="text-gray-500">Yükleniyor...</p>;
  if (!data) return <p className="text-red-500">Veri yüklenemedi.</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 text-sm font-medium">
            {data.unreadApplications} okunmamış başvuru
          </span>
          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 text-sm font-medium">
            {data.unreadMessages} okunmamış mesaj
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={marking !== null || data.unreadApplications === 0}
            onClick={() => markRead('applications')}
            className="px-3 py-1.5 text-sm bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg"
          >
            Başvuruları okundu işaretle
          </button>
          <button
            type="button"
            disabled={marking !== null || data.unreadMessages === 0}
            onClick={() => markRead('messages')}
            className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg"
          >
            Mesajları okundu işaretle
          </button>
          <button
            type="button"
            disabled={marking !== null}
            onClick={() => markRead('all')}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800"
          >
            Tümünü okundu işaretle
          </button>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Son başvurular</h2>
          <Link href="/admin/xeyal/inbox" className="text-sm text-violet-600 hover:underline">
            Tümünü gör →
          </Link>
        </div>
        {data.recentApplications.length === 0 ? (
          <p className="text-gray-500 text-sm">Okunmamış başvuru yok.</p>
        ) : (
          <ul className="space-y-2">
            {data.recentApplications.map((a) => (
              <li
                key={a.id}
                className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800"
              >
                <p className="font-medium text-gray-900 dark:text-white">{a.studentName}</p>
                <p className="text-sm text-gray-500">{a.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(a.createdAt).toLocaleString('tr-TR')}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Son mesajlar</h2>
          <Link href="/admin/xeyal/inbox" className="text-sm text-violet-600 hover:underline">
            Tümünü gör →
          </Link>
        </div>
        {data.recentMessages.length === 0 ? (
          <p className="text-gray-500 text-sm">Okunmamış mesaj yok.</p>
        ) : (
          <ul className="space-y-2">
            {data.recentMessages.map((m) => (
              <li
                key={m.id}
                className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800"
              >
                <p className="font-medium text-gray-900 dark:text-white">{m.name}</p>
                <p className="text-sm text-gray-500">{m.email}</p>
                {m.subject && <p className="text-sm text-gray-600 dark:text-gray-400">{m.subject}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(m.createdAt).toLocaleString('tr-TR')}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
