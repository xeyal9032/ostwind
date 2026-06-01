'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import MessageReplyBox, { type MessageWithReply } from '@/components/admin/MessageReplyBox';
import { useApplicationStatusLabel } from '@/components/admin/useApplicationStatusLabel';
import { APPLICATION_STATUS_KEYS } from '@/lib/application-status';

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

export default function XeyalInboxPage() {
  const t = useTranslations('xeyal');
  const tApps = useTranslations('applications');
  const tCommon = useTranslations('common');
  const statusLabel = useApplicationStatusLabel();

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
          {t('applicationsTab')}
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
          {t('messagesTab')}
        </button>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => exportCsv('applications')}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800"
          >
            {t('exportAppCsv')}
          </button>
          <button
            type="button"
            onClick={() => exportCsv('messages')}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800"
          >
            {t('exportMsgCsv')}
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
              {tCommon('statusLabel')}
            </label>
            <select
              id="inbox-status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
            >
              <option value="">{tCommon('all')}</option>
              {APPLICATION_STATUS_KEYS.map((s) => (
                <option key={s} value={s}>
                  {statusLabel(s)}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label htmlFor="inbox-from" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {tCommon('dateFrom')}
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
            {tCommon('dateTo')}
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
            {tCommon('search')}
          </label>
          <input
            id="inbox-q"
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
            placeholder={tCommon('searchPlaceholder')}
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
            {tCommon('unreadOnly')}
          </label>
          <button
            type="submit"
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium"
          >
            {tCommon('filter')}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-gray-500">{tCommon('loading')}</p>
      ) : tab === 'applications' ? (
        applications.length === 0 ? (
          <p className="text-gray-500">{tCommon('empty')}</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-800">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-zinc-900">
                <tr>
                  <th className="px-4 py-3 text-left">{tApps('colStudent')}</th>
                  <th className="px-4 py-3 text-left">{tApps('colEmail')}</th>
                  <th className="px-4 py-3 text-left">{tApps('colStatus')}</th>
                  <th className="px-4 py-3 text-left">{tApps('colDate')}</th>
                  <th className="px-4 py-3 text-left">{tCommon('readCol')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {applications.map((a) => (
                  <tr key={a.id} className={`bg-white dark:bg-zinc-950 ${!a.readAt ? 'font-medium' : ''}`}>
                    <td className="px-4 py-3">{a.studentName}</td>
                    <td className="px-4 py-3">{a.email}</td>
                    <td className="px-4 py-3">{statusLabel(a.status)}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(a.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-4 py-3">{a.readAt ? tCommon('readYes') : tCommon('readNo')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : messages.length === 0 ? (
        <p className="text-gray-500">{tCommon('empty')}</p>
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
