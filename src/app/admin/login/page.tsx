'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const res = await signIn('credentials', {
        email: normalizedEmail,
        password,
        otp: otp.replace(/\D/g, '').slice(0, 6) || undefined,
        redirect: false,
      });

      if (res?.error) {
        const err = res.error;
        if (err.includes('2FA') || err === '2FA_REQUIRED') {
          setShowOtp(true);
          setError('2FA aktif — Authenticator uygulamasındaki 6 haneli kodu girin');
        } else if (err === 'INVALID_2FA_CODE') {
          setShowOtp(true);
          setError('2FA kodu yanlış veya geçersiz. Yalnızca 6 haneli güncel kodu girin.');
        } else if (err === 'CredentialsSignin') {
          setError(
            'E-posta veya şifre yanlış. Yeni admin oluşturduysanız şifreyi tam yazdığınızdan emin olun; super admin panelden şifreyi sıfırlayabilir.',
          );
        } else {
          setError(`Giriş başarısız (${err})`);
        }
      } else if (res?.ok) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setError('Giriş başarısız. Lütfen tekrar deneyin.');
      }
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-900 p-10 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            OstWind Yönetim Paneli
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Lütfen yetkili bilgilerinizle giriş yapın
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                E-posta Adresi
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 rounded-md dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Şifre
              </label>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 rounded-md dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {showOtp && (
              <div>
                <label
                  htmlFor="login-otp"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  2FA Kodu
                </label>
                <input
                  id="login-otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="000000"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 rounded-md dark:text-white tracking-widest text-center text-lg"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/30 p-2 rounded"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}
