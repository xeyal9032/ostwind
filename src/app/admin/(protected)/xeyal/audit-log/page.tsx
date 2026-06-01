'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type AuditLog = {
  id: number;
  userEmail: string;
  userName: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  summary: string | null;
  createdAt: string;
};

export default function XeyalAuditLogPage() {
  const t = useTranslations('xeyal');
  const tCommon = useTranslations('common');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [entity, setEntity] = useState('');
  const [action, setAction] = useState('');
  const [q, setQ] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (entity) params.set('entity', entity);
    if (action) params.set('action', action);
    if (q.trim()) params.set('q', q.trim());
    try {
      const res = await fetch(`/api/admin/xeyal/audit-log?${params}`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setLogs(data);
      else setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [entity, action, q]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('auditTitle')}</h2>

      <form
        className="flex flex-wrap gap-3 items-end bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800"
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <div>
          <label htmlFor="audit-entity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {tCommon('colEntity')}
          </label>
          <input
            id="audit-entity"
            name="entity"
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm w-40"
            placeholder={tCommon('entityPlaceholder')}
          />
        </div>
        <div>
          <label htmlFor="audit-action" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {tCommon('colAction')}
          </label>
          <input
            id="audit-action"
            name="action"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm w-40"
            placeholder={tCommon('actionPlaceholder')}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="audit-q" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {tCommon('search')}
          </label>
          <input
            id="audit-q"
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
            placeholder={tCommon('auditSearchPlaceholder')}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium"
        >
          {tCommon('filter')}
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500">{tCommon('loading')}</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500">{tCommon('empty')}</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-800">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left">{tCommon('dateCol')}</th>
                <th className="px-4 py-3 text-left">{tCommon('colUser')}</th>
                <th className="px-4 py-3 text-left">{tCommon('colAction')}</th>
                <th className="px-4 py-3 text-left">{tCommon('colEntity')}</th>
                <th className="px-4 py-3 text-left">{tCommon('colSummary')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {logs.map((log) => (
                <tr key={log.id} className="bg-white dark:bg-zinc-950">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('tr-TR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{log.userEmail}</div>
                    {log.userName && <div className="text-gray-500 text-xs">{log.userName}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 text-xs">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {log.entity}
                    {log.entityId ? ` #${log.entityId}` : ''}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-md truncate">
                    {log.summary || '—'}
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
