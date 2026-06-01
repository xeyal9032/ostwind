'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type Session = {
  id: string;
  userAgent: string | null;
  ip: string | null;
  lastActiveAt: string;
  createdAt: string;
  isCurrent: boolean;
  user: { id: number; name: string | null; email: string; role: string };
};

export default function XeyalSecurityPage() {
  const tSec = useTranslations('xeyal.security');
  const tCommon = useTranslations('common');
  const [setupUri, setSetupUri] = useState('');
  const [setupSecret, setSetupSecret] = useState('');
  const [setupQr, setSetupQr] = useState('');
  const [copied, setCopied] = useState(false);
  const [enableCode, setEnableCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [busy, setBusy] = useState('');

  const loadSessions = useCallback(async () => {
    setLoadingSessions(true);
    try {
      const res = await fetch('/api/admin/xeyal/sessions?all=1');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setSessions(data);
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const setup2fa = async () => {
    setBusy('setup');
    try {
      const res = await fetch('/api/admin/xeyal/2fa/setup', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || tSec('setupFailed'));
      setSetupSecret(data.secret);
      setSetupUri(data.uri);
      setSetupQr(data.qrDataUrl || '');
      setCopied(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : tCommon('error'));
    } finally {
      setBusy('');
    }
  };

  const enable2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy('enable');
    try {
      const res = await fetch('/api/admin/xeyal/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: enableCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || tSec('enableFailed'));
      alert(tSec('enabledAlert'));
      setEnableCode('');
      setSetupSecret('');
      setSetupUri('');
      setSetupQr('');
    } catch (e) {
      alert(e instanceof Error ? e.message : tCommon('error'));
    } finally {
      setBusy('');
    }
  };

  const disable2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy('disable');
    try {
      const res = await fetch('/api/admin/xeyal/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: disablePassword, code: disableCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || tSec('disableFailed'));
      alert(tSec('disabledAlert'));
      setDisablePassword('');
      setDisableCode('');
    } catch (e) {
      alert(e instanceof Error ? e.message : tCommon('error'));
    } finally {
      setBusy('');
    }
  };

  const copySecret = async () => {
    if (!setupSecret) return;
    try {
      await navigator.clipboard.writeText(setupSecret);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(tSec('copyFailed'));
    }
  };

  const openInAuthenticator = () => {
    if (!setupUri) return;
    // otpauth:// masaüstü tarayıcıda çoğu zaman açılmaz; yine de mobilde denenebilir
    window.location.assign(setupUri);
  };

  const revokeSession = async (id: string) => {
    if (!confirm(tSec('revokeConfirm'))) return;
    const res = await fetch(`/api/admin/xeyal/sessions/${id}?all=1`, { method: 'DELETE' });
    if (res.ok) await loadSessions();
    else alert(tSec('revokeFailed'));
  };

  return (
    <div className="space-y-8">
      <section className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{tSec('twoFaTitle')}</h2>

        <button
          type="button"
          disabled={busy === 'setup'}
          onClick={setup2fa}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
        >
          {tSec('startSetup')}
        </button>

        {setupSecret && (
          <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg text-sm space-y-4">
            <p className="text-gray-600 dark:text-gray-400">{tSec('setupHint')}</p>

            {setupQr && (
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={setupQr}
                  alt={tSec('qrAlt')}
                  width={220}
                  height={220}
                  className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-white p-2"
                />
                <div className="space-y-3 min-w-0">
                  <p>
                    <span className="font-medium block mb-1">{tSec('secretKey')}</span>
                    <code className="break-all text-xs">{setupSecret}</code>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={copySecret}
                      className="px-3 py-1.5 rounded-lg border border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 text-xs font-medium hover:bg-violet-50 dark:hover:bg-violet-950/40"
                    >
                      {copied ? tSec('copied') : tSec('copyKey')}
                    </button>
                    {setupUri && (
                      <button
                        type="button"
                        onClick={openInAuthenticator}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        {tSec('openMobile')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={enable2fa} className="flex flex-wrap gap-3 items-end">
          <div>
            <label htmlFor="enable-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {tSec('verifyCode')}
            </label>
            <input
              id="enable-code"
              name="code"
              value={enableCode}
              onChange={(e) => setEnableCode(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm w-40"
              placeholder="000000"
              autoComplete="one-time-code"
            />
          </div>
          <button
            type="submit"
            disabled={busy === 'enable' || !enableCode}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
          >
            {tSec('enable2fa')}
          </button>
        </form>

        <form onSubmit={disable2fa} className="flex flex-wrap gap-3 items-end pt-4 border-t border-gray-100 dark:border-zinc-800">
          <div>
            <label htmlFor="disable-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {tSec('password')}
            </label>
            <input
              id="disable-password"
              name="password"
              type="password"
              value={disablePassword}
              onChange={(e) => setDisablePassword(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
              autoComplete="current-password"
            />
          </div>
          <div>
            <label htmlFor="disable-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {tSec('codeOptional')}
            </label>
            <input
              id="disable-code"
              name="code"
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm w-40"
            />
          </div>
          <button
            type="submit"
            disabled={busy === 'disable' || !disablePassword}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
          >
            {tSec('disable2fa')}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{tSec('activeSessions')}</h2>
        {loadingSessions ? (
          <p className="text-gray-500">{tCommon('loading')}</p>
        ) : sessions.length === 0 ? (
          <p className="text-gray-500">{tSec('noSessions')}</p>
        ) : (
          <div className="space-y-2">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap justify-between gap-3 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800"
              >
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {s.user.name || s.user.email}
                    {s.isCurrent && (
                      <span className="ml-2 text-xs text-green-600">{tSec('currentSession')}</span>
                    )}
                  </p>
                  <p className="text-gray-500">{s.user.email} · {s.user.role}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    IP: {s.ip || '—'} · Son: {new Date(s.lastActiveAt).toLocaleString('tr-TR')}
                  </p>
                  {s.userAgent && (
                    <p className="text-gray-400 text-xs truncate max-w-xl">{s.userAgent}</p>
                  )}
                </div>
                {!s.isCurrent && (
                  <button
                    type="button"
                    onClick={() => revokeSession(s.id)}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    {tSec('revoke')}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
