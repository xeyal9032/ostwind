'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type AuditEntry = {
  id: number;
  userEmail: string;
  action: string;
  entity: string;
  summary: string | null;
  createdAt: string;
};

type Stats = {
  unreadApplications: number;
  unreadMessages: number;
  totalAdmins: number;
  onlineAdmins: number;
  frozenAdmins: number;
  recentAudit: AuditEntry[];
};

const quickLinks = [
  { href: '/admin/xeyal/inbox', label: 'Başvuru & Mesaj', desc: 'Filtre ve export' },
  { href: '/admin/xeyal/audit-log', label: 'Audit Log', desc: 'Tüm işlem kayıtları' },
  { href: '/admin/xeyal/notifications', label: 'Bildirişler', desc: 'Okunmamış öğeler' },
  { href: '/admin/xeyal/roles', label: 'Rol & İzinler', desc: 'Admin modül erişimi' },
  { href: '/admin/xeyal/security', label: 'Güvenlik', desc: '2FA ve oturumlar' },
  { href: '/admin/xeyal/homepage', label: 'Ana Sayfa', desc: 'Çok dilli metinler' },
];

export default function XeyalHubPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/xeyal/stats')
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Yüklenemedi');
        setStats(data);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500">Yükleniyor...</p>;
  }

  if (error || !stats) {
    return (
      <div role="alert" className="text-red-600 dark:text-red-400">
        {error || 'Veri alınamadı'}
      </div>
    );
  }

  const cards = [
    {
      label: 'Okunmamış başvuru',
      value: stats.unreadApplications,
      href: '/admin/xeyal/inbox',
      color: 'text-red-600',
      badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    },
    {
      label: 'Okunmamış mesaj',
      value: stats.unreadMessages,
      href: '/admin/xeyal/inbox',
      color: 'text-orange-600',
      badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    },
    {
      label: 'Toplam admin',
      value: stats.totalAdmins,
      href: '/admin/xeyal/admins',
      color: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    },
    {
      label: 'Şu an çevrimiçi',
      value: stats.onlineAdmins,
      href: '/admin/users',
      color: 'text-green-600',
      badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    },
    {
      label: 'Dondurulmuş admin',
      value: stats.frozenAdmins,
      href: '/admin/xeyal/roles',
      color: 'text-violet-600',
      badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{c.label}</p>
            <p className={`mt-2 text-3xl font-bold ${c.color}`}>{c.value}</p>
            <span className={`inline-block mt-3 text-xs px-2 py-0.5 rounded-full ${c.badge}`}>
              Detay →
            </span>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Hızlı erişim</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
            >
              <p className="font-medium text-gray-900 dark:text-white">{link.label}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900 dark:text-white">Son audit kayıtları</h2>
          <Link href="/admin/xeyal/audit-log" className="text-sm text-violet-600 hover:underline">
            Tümünü gör
          </Link>
        </div>
        {stats.recentAudit.length === 0 ? (
          <p className="p-5 text-gray-500 text-sm">Henüz kayıt yok.</p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-zinc-800">
            {stats.recentAudit.map((a) => (
              <li key={a.id} className="px-5 py-3 text-sm">
                <div className="flex flex-wrap gap-2 justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {a.action} · {a.entity}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {new Date(a.createdAt).toLocaleString('tr-TR')}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                  {a.userEmail}
                  {a.summary ? ` — ${a.summary}` : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
