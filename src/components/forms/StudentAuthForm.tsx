'use client';

import { useId, useState } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';

type Mode = 'login' | 'register';

function IconLogin({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l6-6-6-6zm9 12h-8v2h8a2 2 0 002-2V5a2 2 0 00-2-2h-8v2h8v14z" />
    </svg>
  );
}

function IconHeart({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function IconUserPlus({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9 8v-1c0-2.21 3.58-4 8-4s8 1.79 8 4v1H6zm9-10c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm3.5 3.5c.83 0 1.5-.67 1.5-1.5S20.33 10.5 19.5 10.5 18 11.17 18 12s.67 1.5 1.5 1.5zM4 18v-1c0-1.65 2.46-3 5.5-3 .7 0 1.37.08 2 .22C9.87 14.08 9.2 14 8.5 14 5.46 14 3 15.35 3 17v1h1z" />
    </svg>
  );
}

export default function StudentAuthForm({ mode }: { mode: Mode }) {
  const t = useTranslations('StudentAuth');
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();
  const passwordId = useId();

  const errorMessages: Record<string, string> = {
    MISSING_FIELDS: t('errors.missing'),
    EMAIL_EXISTS: t('errors.emailExists'),
    INVALID_CREDENTIALS: t('errors.invalidCredentials'),
    WEAK_PASSWORD: t('errors.weakPassword'),
    SERVER_ERROR: t('errors.server'),
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = mode === 'login' ? '/api/student/login' : '/api/student/register';
    const body =
      mode === 'login'
        ? { email, password }
        : { email, password, firstName, lastName };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'same-origin',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(errorMessages[data.error] || t('errors.server'));
        return;
      }
      router.push('/portal/admission');
      router.refresh();
    } catch {
      setError(t('errors.server'));
    } finally {
      setLoading(false);
    }
  }

  const titleText = mode === 'login' ? t('loginTitle') : t('registerTitle');

  return (
    <div className="auth-neon-box">
      <div className="auth-neon-inner">
        <h1 className="auth-neon-title">
          {mode === 'login' ? (
            <IconLogin className="auth-neon-icon" />
          ) : (
            <IconUserPlus className="auth-neon-icon" />
          )}
          <span>{titleText}</span>
          <IconHeart className="auth-neon-icon" />
        </h1>

        <p className="auth-neon-subtitle">{t('subtitle')}</p>

        <form onSubmit={handleSubmit} autoComplete="on" noValidate>
          {mode === 'register' && (
            <>
              <label htmlFor={firstNameId} className="sr-only">
                {t('firstName')}
              </label>
              <input
                id={firstNameId}
                name="firstName"
                autoComplete="given-name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t('firstName')}
                className="auth-neon-input"
              />
              <label htmlFor={lastNameId} className="sr-only">
                {t('lastName')}
              </label>
              <input
                id={lastNameId}
                name="lastName"
                autoComplete="family-name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t('lastName')}
                className="auth-neon-input"
              />
            </>
          )}

          <label htmlFor={emailId} className="sr-only">
            {t('email')}
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('email')}
            className="auth-neon-input"
          />

          <label htmlFor={passwordId} className="sr-only">
            {t('password')}
          </label>
          {mode === 'login' ? (
            <input
              id={passwordId}
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('password')}
              className="auth-neon-input"
            />
          ) : (
            <input
              id={passwordId}
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('password')}
              className="auth-neon-input"
            />
          )}

          {error && <p className="auth-neon-error">{error}</p>}

          <button type="submit" disabled={loading} className="auth-neon-submit">
            {loading ? t('loading') : mode === 'login' ? t('loginButton') : t('registerButton')}
          </button>

          <div className="auth-neon-links">
            <Link href="/" locale={locale} className="auth-neon-link-muted">
              {t('backHome')}
            </Link>
            <Link
              href={mode === 'login' ? '/auth/register' : '/auth/login'}
              locale={locale}
              className="auth-neon-link-accent"
            >
              {mode === 'login' ? t('goRegister') : t('goLogin')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
