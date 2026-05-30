'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type UniversityOption = {
  id: number;
  slug: string;
  label: string;
};

export default function ApplyForm({
  universities,
  defaultUniversityId,
}: {
  universities: UniversityOption[];
  defaultUniversityId?: number;
}) {
  const t = useTranslations('Apply');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const form = e.currentTarget;
    const data = new FormData(form);
    const universityId = data.get('universityId');

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: data.get('studentName'),
          email: data.get('email'),
          phone: data.get('phone'),
          universityId: universityId ? Number(universityId) : undefined,
          message: data.get('message') || undefined,
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <div>
        <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('studentName')}
        </label>
        <input id="studentName" name="studentName" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('email')}
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('phone')}
        </label>
        <input id="phone" name="phone" type="tel" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="universityId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('university')}
        </label>
        <select
          id="universityId"
          name="universityId"
          defaultValue={defaultUniversityId ?? ''}
          className={inputClass}
        >
          <option value="">{t('universityOptional')}</option>
          {universities.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('message')}
        </label>
        <textarea id="message" name="message" rows={4} className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
      >
        {status === 'loading' ? t('sending') : t('submit')}
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
