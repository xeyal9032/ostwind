'use client';

import { useCallback, useEffect, useState } from 'react';
import MessageReplyBox, { type MessageWithReply } from '@/components/admin/MessageReplyBox';

type Tab = 'applications' | 'messages';

type Application = {
  id: number;
  studentName: string;
  email: string;
  phone: string;
  status: string;
  readAt: string | null;
  createdAt: string;
};

type Message = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  readAt: string | null;
  adminReply?: string | null;
  repliedAt?: string | null;
  repliedByEmail?: string | null;
  createdAt: string;
};

const STATUS_OPTIONS = ['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'];

export default function XeyalInboxPage() {
  const [tab, setTab] = useState<Tab>('applications');
  const [status, setStatus] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    if (unreadOnly) params.set('unread', '1');
    if (q.trim()) params.set('q', q.trim());
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (tab === 'applications' && status) params.set('status', status);
    return params;
  }, [tab, status, unreadOnly, q, from, to]);

  const updateMessage = (updated: MessageWithReply) => {
    setMessages((prev) => prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m)));
  };

  const load = useCallback(async () => {
    setLoading(true);
    const params = buildParams();
    const url =
      tab === 'applications'
        ? `/api/admin/applications?${params}`
        : `/api/admin/messages?${params}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        if (tab === 'applications') setApplications(data);
        else setMessages(data);
      }
    } finally {
      setLoading(false);
    }
  }, [tab, buildParams]);

  useEffect(() => {
    load();
  }, [load]);

  const exportCsv = (type: 'applications' | 'messages') => {
    const url =
      type === 'applications'
        ? `/api/admin/xeyal/export/applications${status ? `?status=${status}` : ''}`
        : '/api/admin/xeyal/export/messages';
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-zinc-800 pb-4">
        <button
          type="button"
          onClick={() => setTab('applications')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            tab === 'applications'
              ? 'bg-violet-600 text-white'
              : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300'
          }`}
        >
          Başvurular
        </button>
        <button
          type="button"
          onClick={() => setTab('messages')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            tab === 'messages'
              ? 'bg-violet-600 text-white'
              : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300'
          }`}
        >
          Mesajlar
        </button>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => exportCsv('applications')}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800"
          >
            Başvuru CSV
          </button>
          <button
            type="button"
            onClick={() => exportCsv('messages')}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800"
          >
            Mesaj CSV
          </button>
        </div>
      </div>

      <form
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800"
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        {tab === 'applications' && (
          <div>
            <label htmlFor="inbox-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Durum
            </label>
            <select
              id="inbox-status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
            >
              <option value="">Tümü</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label htmlFor="inbox-from" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Başlangıç tarihi
          </label>
          <input
            id="inbox-from"
            name="from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="inbox-to" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bitiş tarihi
          </label>
          <input
            id="inbox-to"
            name="to"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="inbox-q" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ara
          </label>
          <input
            id="inbox-q"
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
            placeholder="İsim, e-posta..."
          />
        </div>
        <div className="flex items-end gap-3 sm:col-span-2">
          <label htmlFor="inbox-unread" className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              id="inbox-unread"
              name="unread"
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => setUnreadOnly(e.target.checked)}
              className="rounded border-gray-300"
            />
            Sadece okunmamış
          </label>
          <button
            type="submit"
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium"
          >
            Filtrele
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-gray-500">Yükleniyor...</p>
      ) : tab === 'applications' ? (
        applications.length === 0 ? (
          <p className="text-gray-500">Kayıt bulunamadı.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-800">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-zinc-900">
                <tr>
                  <th className="px-4 py-3 text-left">Öğrenci</th>
                  <th className="px-4 py-3 text-left">E-posta</th>
                  <th className="px-4 py-3 text-left">Durum</th>
                  <th className="px-4 py-3 text-left">Tarih</th>
                  <th className="px-4 py-3 text-left">Okundu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {applications.map((a) => (
                  <tr key={a.id} className={`bg-white dark:bg-zinc-950 ${!a.readAt ? 'font-medium' : ''}`}>
                    <td className="px-4 py-3">{a.studentName}</td>
                    <td className="px-4 py-3">{a.email}</td>
                    <td className="px-4 py-3">{a.status}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(a.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-4 py-3">{a.readAt ? 'Evet' : 'Hayır'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : messages.length === 0 ? (
        <p className="text-gray-500">Kayıt bulunamadı.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-4 rounded-xl border ${
                !m.readAt
                  ? 'border-violet-300 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-950/20'
                  : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
              }`}
            >
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{m.name}</p>
                  <p className="text-sm text-gray-500">{m.email}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {new Date(m.createdAt).toLocaleString('tr-TR')}
                </span>
              </div>
              {m.subject && <p className="text-sm font-medium mt-2">{m.subject}</p>}
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap">{m.message}</p>
              <MessageReplyBox message={m} onReplied={updateMessage} compact />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
