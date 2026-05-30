'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_CONTACT } from '@/lib/contact-defaults';
import { mergeLocaleJson } from '@/lib/about-defaults';

type LocaleRecord = Record<string, string>;

type FormData = {
  address: string;
  phone: string;
  email: string;
  mapsUrl: string;
  hoursWeekdays: string;
  hoursSaturday: string;
  sundayClosed: boolean;
  hoursSunday: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  pageSubtitle: LocaleRecord;
};

const LOCALES = [
  { code: 'tr', name: 'Türkçe' },
  { code: 'en', name: 'English' },
  { code: 'az', name: 'Azərbaycanca' },
  { code: 'ru', name: 'Русский' },
  { code: 'uk', name: 'Українська' },
  { code: 'ge', name: 'ქართული' },
];

function defaultFormData(): FormData {
  return {
    address: DEFAULT_CONTACT.address,
    phone: DEFAULT_CONTACT.phone,
    email: DEFAULT_CONTACT.email,
    mapsUrl: DEFAULT_CONTACT.mapsUrl,
    hoursWeekdays: DEFAULT_CONTACT.hoursWeekdays,
    hoursSaturday: DEFAULT_CONTACT.hoursSaturday,
    sundayClosed: DEFAULT_CONTACT.sundayClosed,
    hoursSunday: '',
    facebookUrl: DEFAULT_CONTACT.facebookUrl,
    instagramUrl: DEFAULT_CONTACT.instagramUrl,
    tiktokUrl: DEFAULT_CONTACT.tiktokUrl,
    pageSubtitle: { ...DEFAULT_CONTACT.pageSubtitle },
  };
}

export default function AdminContactPage() {
  const [activeTab, setActiveTab] = useState('tr');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  useEffect(() => {
    fetch('/api/admin/contact', { credentials: 'same-origin' })
      .then(async (res) => {
        let data: Record<string, unknown> = {};
        try {
          data = await res.json();
        } catch {
          setError('Sunucu yanıtı okunamadı. Dev sunucusunu yeniden başlatın.');
          return;
        }
        if (!res.ok) {
          setError(String(data.error || 'Yüklenemedi'));
          return;
        }
        setFormData({
          address: String(data.address ?? defaultFormData().address),
          phone: String(data.phone ?? defaultFormData().phone),
          email: String(data.email ?? defaultFormData().email),
          mapsUrl: String(data.mapsUrl ?? defaultFormData().mapsUrl),
          hoursWeekdays: String(data.hoursWeekdays ?? defaultFormData().hoursWeekdays),
          hoursSaturday: String(data.hoursSaturday ?? defaultFormData().hoursSaturday),
          sundayClosed: Boolean(data.sundayClosed ?? true),
          hoursSunday: data.hoursSunday ? String(data.hoursSunday) : '',
          facebookUrl: String(data.facebookUrl ?? defaultFormData().facebookUrl),
          instagramUrl: String(data.instagramUrl ?? defaultFormData().instagramUrl),
          tiktokUrl: String(data.tiktokUrl ?? defaultFormData().tiktokUrl),
          pageSubtitle: mergeLocaleJson(data.pageSubtitle),
        });
      })
      .catch(() => setError('Bağlantı hatası'))
      .finally(() => setPageLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/contact', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        throw new Error('Sunucu yanıtı okunamadı. `npm run dev` yeniden başlatın.');
      }
      if (!res.ok) throw new Error(data.error || 'Kaydedilemedi');
      setSuccess('Əlaqə məlumatları yadda saxlanıldı.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kaydedilemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Bütün əlaqə məlumatları varsayılan dəyərlərə qaytarılsın?')) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/contact', {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sıfırlanamadı');
      setFormData({
        address: data.address,
        phone: data.phone,
        email: data.email,
        mapsUrl: data.mapsUrl ?? '',
        hoursWeekdays: data.hoursWeekdays,
        hoursSaturday: data.hoursSaturday,
        sundayClosed: data.sundayClosed,
        hoursSunday: data.hoursSunday ?? '',
        facebookUrl: data.facebookUrl ?? '',
        instagramUrl: data.instagramUrl ?? '',
        tiktokUrl: data.tiktokUrl ?? '',
        pageSubtitle: mergeLocaleJson(data.pageSubtitle),
      });
      setSuccess('Varsayılan məlumatlar bərpa edildi.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sıfırlanamadı');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-gray-900 dark:text-white';

  if (pageLoading) {
    return <p className="text-gray-500">Yüklənir...</p>;
  }

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Əlaqə / İletişim</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Əlaqə səhifəsi, footer və WhatsApp düymələrində göstərilən məlumatlar.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-60"
        >
          Varsayılana sıfırla
        </button>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-4 py-3 rounded-lg">
          {error}
        </p>
      )}
      {success && (
        <p className="mb-4 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-4 py-3 rounded-lg">
          {success}
        </p>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        <section className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ünvan və əlaqə</h2>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ünvan
            </label>
            <textarea id="address" rows={3} className={inputClass} value={formData.address}
              onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telefon / WhatsApp
              </label>
              <input id="phone" className={inputClass} value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                E-poçt
              </label>
              <input id="email" type="email" className={inputClass} value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} />
            </div>
          </div>

          <div>
            <label htmlFor="mapsUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Google Maps linki
            </label>
            <input id="mapsUrl" type="url" className={inputClass} value={formData.mapsUrl}
              onChange={(e) => setFormData((p) => ({ ...p, mapsUrl: e.target.value }))} />
          </div>
        </section>

        <section className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">İş saatları</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hoursWeekdays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bazar ertəsi – Cümə
              </label>
              <input id="hoursWeekdays" className={inputClass} value={formData.hoursWeekdays}
                onChange={(e) => setFormData((p) => ({ ...p, hoursWeekdays: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="hoursSaturday" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Şənbə
              </label>
              <input id="hoursSaturday" className={inputClass} value={formData.hoursSaturday}
                onChange={(e) => setFormData((p) => ({ ...p, hoursSaturday: e.target.value }))} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={formData.sundayClosed}
              onChange={(e) => setFormData((p) => ({ ...p, sundayClosed: e.target.checked }))}
              className="rounded border-gray-300"
            />
            Bazar günü bağlı
          </label>

          {!formData.sundayClosed && (
            <div>
              <label htmlFor="hoursSunday" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bazar saatları
              </label>
              <input id="hoursSunday" className={inputClass} value={formData.hoursSunday}
                onChange={(e) => setFormData((p) => ({ ...p, hoursSunday: e.target.value }))} />
            </div>
          )}
        </section>

        <section className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sosial şəbəkələr</h2>

          <div>
            <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Facebook
            </label>
            <input id="facebookUrl" type="url" className={inputClass} value={formData.facebookUrl}
              onChange={(e) => setFormData((p) => ({ ...p, facebookUrl: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Instagram
            </label>
            <input id="instagramUrl" type="url" className={inputClass} value={formData.instagramUrl}
              onChange={(e) => setFormData((p) => ({ ...p, instagramUrl: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="tiktokUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              TikTok
            </label>
            <input id="tiktokUrl" type="url" className={inputClass} value={formData.tiktokUrl}
              onChange={(e) => setFormData((p) => ({ ...p, tiktokUrl: e.target.value }))} />
          </div>
        </section>

        <section className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Səhifə mətni (alt başlıq)</h2>

          <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-zinc-700 pb-2">
            {LOCALES.map((loc) => (
              <button
                key={loc.code}
                type="button"
                onClick={() => setActiveTab(loc.code)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  activeTab === loc.code
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>

          <div>
            <label htmlFor="pageSubtitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Alt başlıq ({activeTab})
            </label>
            <textarea
              id="pageSubtitle"
              rows={2}
              className={inputClass}
              value={formData.pageSubtitle[activeTab] ?? ''}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  pageSubtitle: { ...p.pageSubtitle, [activeTab]: e.target.value },
                }))
              }
            />
          </div>
        </section>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-60"
        >
          {loading ? 'Yadda saxlanılır...' : 'Yadda saxla'}
        </button>
      </form>
    </div>
  );
}
