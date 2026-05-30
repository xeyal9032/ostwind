'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ContactForm() {
  const t = useTranslations('Contact');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          subject: data.get('subject') || undefined,
          message: data.get('message'),
        }),
      });
      if (!res.ok) throw new Error('failed');
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const inputClass =
    'w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('name')}
        </label>
        <input id="name" name="name" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('email')}
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('subject')}
        </label>
        <input id="subject" name="subject" className={inputClass} />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('message')}
        </label>
        <textarea id="message" name="message" required rows={5} className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
      >
        {status === 'loading' ? t('sending') : t('send')}
      </button>
      {status === 'success' && (
        <p className="text-green-600 dark:text-green-400 text-center text-sm">{t('success')}</p>
      )}
      {status === 'error' && (
        <p className="text-red-600 dark:text-red-400 text-center text-sm">{t('error')}</p>
      )}
    </form>
  );
}
