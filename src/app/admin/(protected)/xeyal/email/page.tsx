'use client';

import { useCallback, useEffect, useState } from 'react';

type EmailSettings = {
  enabled: boolean;
  smtpHost: string | null;
  smtpPort: number | null;
  smtpSecure: boolean;
  smtpUser: string | null;
  fromEmail: string | null;
  notifyAdminOnApplication: boolean;
  adminNotifyEmail: string | null;
  notifyAdminOnMessage: boolean;
  sendApplicantConfirmation: boolean;
  applicantEmailSubject: unknown;
  applicantEmailBody: unknown;
};

const defaultForm: EmailSettings & { smtpPass: string } = {
  enabled: false,
  smtpHost: '',
  smtpPort: 587,
  smtpSecure: false,
  smtpUser: '',
  smtpPass: '',
  fromEmail: '',
  notifyAdminOnApplication: true,
  adminNotifyEmail: '',
  notifyAdminOnMessage: true,
  sendApplicantConfirmation: false,
  applicantEmailSubject: null,
  applicantEmailBody: null,
};

export default function XeyalEmailPage() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testTo, setTestTo] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/xeyal/email');
    const data = await res.json();
    if (res.ok) {
      setForm({
        enabled: data.enabled ?? false,
        smtpHost: data.smtpHost ?? '',
        smtpPort: data.smtpPort ?? 587,
        smtpSecure: data.smtpSecure ?? false,
        smtpUser: data.smtpUser ?? '',
        smtpPass: '',
        fromEmail: data.fromEmail ?? '',
        notifyAdminOnApplication: data.notifyAdminOnApplication ?? true,
        adminNotifyEmail: data.adminNotifyEmail ?? '',
        notifyAdminOnMessage: data.notifyAdminOnMessage ?? true,
        sendApplicantConfirmation: data.sendApplicantConfirmation ?? false,
        applicantEmailSubject: data.applicantEmailSubject,
        applicantEmailBody: data.applicantEmailBody,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const testSmtp = async () => {
    setTesting(true);
    setMessage('');
    try {
      const body: Record<string, unknown> = {
        to: testTo.trim() || form.adminNotifyEmail || form.fromEmail,
        smtpHost: form.smtpHost,
        smtpPort: form.smtpPort,
        smtpSecure: form.smtpSecure,
        smtpUser: form.smtpUser,
        fromEmail: form.fromEmail,
        adminNotifyEmail: form.adminNotifyEmail,
      };
      if (form.smtpPass) body.smtpPass = form.smtpPass;

      const res = await fetch('/api/admin/xeyal/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Test başarısız');
      setMessage(data.message || 'Test e-postası gönderildi.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Test başarısız');
    } finally {
      setTesting(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const body: Record<string, unknown> = { ...form };
      if (!form.smtpPass) delete body.smtpPass;
      const res = await fetch('/api/admin/xeyal/email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Kaydedilemedi');
      setMessage('Ayarlar kaydedildi.');
      setForm((f) => ({ ...f, smtpPass: '' }));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Hata');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500">Yükleniyor...</p>;

  return (
    <form
      onSubmit={save}
      className="max-w-xl space-y-5 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6"
    >
      <label htmlFor="email-enabled" className="flex items-center gap-2 text-sm font-medium">
        <input
          id="email-enabled"
          name="enabled"
          type="checkbox"
          checked={form.enabled}
          onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))}
        />
        E-posta gönderimini etkinleştir
      </label>

      <div>
        <label htmlFor="smtp-host" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          SMTP sunucusu
        </label>
        <input
          id="smtp-host"
          name="smtpHost"
          value={form.smtpHost ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, smtpHost: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="smtp-port" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Port
          </label>
          <input
            id="smtp-port"
            name="smtpPort"
            type="number"
            value={form.smtpPort ?? 587}
            onChange={(e) => setForm((f) => ({ ...f, smtpPort: Number(e.target.value) }))}
            className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="smtp-secure" className="flex items-center gap-2 text-sm mt-7">
            <input
              id="smtp-secure"
              name="smtpSecure"
              type="checkbox"
              checked={form.smtpSecure}
              onChange={(e) => setForm((f) => ({ ...f, smtpSecure: e.target.checked }))}
            />
            SSL/TLS
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="smtp-user" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          SMTP kullanıcı
        </label>
        <input
          id="smtp-user"
          name="smtpUser"
          value={form.smtpUser ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, smtpUser: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
          autoComplete="username"
        />
      </div>

      <div>
        <label htmlFor="smtp-pass" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          SMTP şifre
        </label>
        <input
          id="smtp-pass"
          name="smtpPass"
          type="password"
          value={form.smtpPass}
          onChange={(e) => setForm((f) => ({ ...f, smtpPass: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
          placeholder="Değiştirmek için doldurun"
          autoComplete="new-password"
        />
      </div>

      <div>
        <label htmlFor="from-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Gönderen e-posta
        </label>
        <input
          id="from-email"
          name="fromEmail"
          type="email"
          value={form.fromEmail ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, fromEmail: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="admin-notify-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Admin bildirim e-postası
        </label>
        <input
          id="admin-notify-email"
          name="adminNotifyEmail"
          type="email"
          value={form.adminNotifyEmail ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, adminNotifyEmail: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
        />
      </div>

      <fieldset className="space-y-2 border-t border-gray-100 dark:border-zinc-800 pt-4">
        <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bildirimler</legend>
        <label htmlFor="notify-app" className="flex items-center gap-2 text-sm">
          <input
            id="notify-app"
            type="checkbox"
            checked={form.notifyAdminOnApplication}
            onChange={(e) => setForm((f) => ({ ...f, notifyAdminOnApplication: e.target.checked }))}
          />
          Yeni başvuruda admin bilgilendir
        </label>
        <label htmlFor="notify-msg" className="flex items-center gap-2 text-sm">
          <input
            id="notify-msg"
            type="checkbox"
            checked={form.notifyAdminOnMessage}
            onChange={(e) => setForm((f) => ({ ...f, notifyAdminOnMessage: e.target.checked }))}
          />
          Yeni mesajda admin bilgilendir
        </label>
        <label htmlFor="notify-applicant" className="flex items-center gap-2 text-sm">
          <input
            id="notify-applicant"
            type="checkbox"
            checked={form.sendApplicantConfirmation}
            onChange={(e) => setForm((f) => ({ ...f, sendApplicantConfirmation: e.target.checked }))}
          />
          Başvurana onay e-postası gönder
        </label>
      </fieldset>

      <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 space-y-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">SMTP testi</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Kaydetmeden önce de test edebilirsiniz. Şifre alanı boşsa veritabanındaki kayıtlı şifre kullanılır.
        </p>
        <div>
          <label htmlFor="test-to" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Test alıcısı (isteğe bağlı)
          </label>
          <input
            id="test-to"
            type="email"
            value={testTo}
            onChange={(e) => setTestTo(e.target.value)}
            placeholder={form.adminNotifyEmail || form.fromEmail || 'admin@ornek.com'}
            className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving || testing}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
        <button
          type="button"
          disabled={saving || testing}
          onClick={testSmtp}
          className="px-4 py-2 border border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/40 disabled:opacity-50 rounded-lg text-sm font-medium"
        >
          {testing ? 'Test ediliyor...' : 'SMTP test et'}
        </button>
        {message && (
          <p
            className={`text-sm w-full ${
              message.includes('kaydedildi') || message.includes('gönderildi') || message.includes('başarı')
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-500 dark:text-red-400'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
