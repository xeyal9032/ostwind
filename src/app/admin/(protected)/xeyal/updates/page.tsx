'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type UpdatesData = {
  repo: string;
  branch: string;
  deployEnabled: boolean;
  gitAvailable: boolean;
  local: {
    branch: string;
    shortHash: string;
    subject: string;
    date: string;
    dirty: boolean;
  } | null;
  remote: {
    behind: number;
    ahead: number;
    remoteShort: string | null;
    upToDate: boolean;
  };
  incoming: Array<{
    shortHash: string;
    subject: string;
    date: string;
    author: string;
  }>;
  github: {
    repoUrl: string;
    commits: Array<{
      shortSha: string;
      message: string;
      date: string;
      author: string;
      url: string;
    }>;
    latestRelease: {
      tag: string;
      name: string;
      publishedAt: string;
      url: string;
      body: string;
    } | null;
  };
  lastDeploy: {
    at: string;
    commit: string;
    success: boolean;
    message: string;
  } | null;
  deployLogTail: string;
};

export default function XeyalUpdatesPage() {
  const t = useTranslations('xeyal.updates');
  const tCommon = useTranslations('common');
  const [data, setData] = useState<UpdatesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [message, setMessage] = useState('');
  const [messageOk, setMessageOk] = useState(false);
  const [deployLog, setDeployLog] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/xeyal/updates');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || tCommon('error'));
      setData(json as UpdatesData);
      setDeployLog(json.deployLogTail || '');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : tCommon('error'));
    } finally {
      setLoading(false);
    }
  }, [tCommon]);

  useEffect(() => {
    load();
  }, [load]);

  const deploy = async () => {
    if (!window.confirm(t('deployConfirm'))) return;

    setDeploying(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/xeyal/updates/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: true }),
      });
      const json = await res.json();
      if (json.output) setDeployLog(json.output);
      if (!res.ok) throw new Error(json.error || t('deployFailed'));
      setMessageOk(!!json.success);
      setMessage(json.success ? t('deploySuccess') : t('deployFailed'));
      await load();
    } catch (err) {
      setMessageOk(false);
      setMessage(err instanceof Error ? err.message : t('deployFailed'));
    } finally {
      setDeploying(false);
    }
  };

  if (loading && !data) {
    return <p className="text-gray-500">{tCommon('loading')}</p>;
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 p-4 text-red-600">
        {message || tCommon('error')}
      </div>
    );
  }

  const canDeploy =
    data.deployEnabled && data.gitAvailable && data.remote.behind > 0 && !data.local?.dirty;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-violet-200 dark:border-violet-900/50 bg-violet-50/50 dark:bg-violet-950/20 p-5">
        <p className="text-sm text-gray-600 dark:text-gray-300">{t('intro')}</p>
        <p className="mt-2 text-xs text-gray-500">
          <a
            href={data.github.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-600 hover:underline"
          >
            github.com/{data.repo}
          </a>
          {' · '}
          {t('branch')}: <strong>{data.branch}</strong>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {t('serverVersion')}
          </h2>
          {data.local ? (
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-mono text-violet-600 dark:text-violet-400">
                  {data.local.shortHash}
                </span>
                {data.local.dirty && (
                  <span className="ml-2 text-amber-600 text-xs">({t('dirty')})</span>
                )}
              </p>
              <p className="text-gray-700 dark:text-gray-300">{data.local.subject}</p>
              <p className="text-xs text-gray-500">{data.local.date}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">{t('noGit')}</p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {t('githubVersion')}
          </h2>
          {data.remote.remoteShort ? (
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-mono text-violet-600">{data.remote.remoteShort}</span>
              </p>
              {data.remote.upToDate ? (
                <p className="text-green-600 dark:text-green-400 font-medium">{t('upToDate')}</p>
              ) : (
                <p className="text-amber-600 dark:text-amber-400 font-medium">
                  {t('behind', { count: data.remote.behind })}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">{t('fetchHint')}</p>
          )}
        </div>
      </div>

      {data.github.latestRelease && (
        <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('latestRelease')}: {data.github.latestRelease.tag}
          </h2>
          <p className="text-xs text-gray-500 mb-2">
            {new Date(data.github.latestRelease.publishedAt).toLocaleString()}
          </p>
          {data.github.latestRelease.body ? (
            <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap max-h-32 overflow-y-auto">
              {data.github.latestRelease.body.slice(0, 800)}
            </pre>
          ) : null}
        </div>
      )}

      {data.incoming.length > 0 && (
        <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/10 p-5">
          <h2 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-3">
            {t('incomingTitle')}
          </h2>
          <ul className="space-y-2 text-sm max-h-48 overflow-y-auto">
            {data.incoming.map((c) => (
              <li key={c.shortHash} className="border-b border-amber-100 dark:border-amber-900/30 pb-2">
                <span className="font-mono text-xs text-violet-600">{c.shortHash}</span>{' '}
                {c.subject}
                <span className="block text-xs text-gray-500">
                  {c.author} · {c.date}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={deploy}
          disabled={deploying || !canDeploy}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
        >
          {deploying ? t('deploying') : t('deployBtn')}
        </button>
        <button
          type="button"
          onClick={load}
          disabled={loading || deploying}
          className="px-4 py-2.5 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm"
        >
          {t('refresh')}
        </button>
        {!data.deployEnabled && (
          <p className="text-sm text-amber-600 w-full">{t('deployDisabled')}</p>
        )}
        {data.local?.dirty && (
          <p className="text-sm text-amber-600 w-full">{t('dirtyBlock')}</p>
        )}
        {data.deployEnabled && data.remote.behind === 0 && !data.local?.dirty && (
          <p className="text-sm text-green-600">{t('upToDate')}</p>
        )}
      </div>

      {data.lastDeploy && (
        <div className="rounded-lg border border-gray-200 dark:border-zinc-800 p-4 text-sm">
          <p className="font-medium text-gray-700 dark:text-gray-300">{t('lastDeploy')}</p>
          <p className="text-gray-500 mt-1">
            {new Date(data.lastDeploy.at).toLocaleString()} ·{' '}
            <span className={data.lastDeploy.success ? 'text-green-600' : 'text-red-500'}>
              {data.lastDeploy.message}
            </span>
          </p>
        </div>
      )}

      {message && (
        <p className={`text-sm ${messageOk ? 'text-green-600' : 'text-red-500'}`}>{message}</p>
      )}

      {deployLog && (
        <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-zinc-950 p-4">
          <h3 className="text-xs font-semibold text-gray-400 mb-2">{t('deployLog')}</h3>
          <pre className="text-xs text-green-400/90 whitespace-pre-wrap overflow-x-auto max-h-80 overflow-y-auto">
            {deployLog}
          </pre>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 p-5">
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">{t('githubCommits')}</h2>
        <ul className="space-y-2 text-sm max-h-64 overflow-y-auto">
          {data.github.commits.map((c) => (
            <li key={c.shortSha + c.url}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-violet-600 hover:underline"
              >
                {c.shortSha}
              </a>{' '}
              {c.message}
              <span className="block text-xs text-gray-500">
                {c.author} · {new Date(c.date).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
