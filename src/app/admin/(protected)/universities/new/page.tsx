'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LOCALES = [
  { code: 'tr', name: 'Türkçe' },
  { code: 'en', name: 'English' },
  { code: 'az', name: 'Azərbaycanca' },
  { code: 'ru', name: 'Русский' },
  { code: 'uk', name: 'Українська' },
  { code: 'ge', name: 'ქართული' },
];

export default function NewUniversityPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tr');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [translating, setTranslating] = useState(false);

  // Form State (Multi-language JSON fields)
  const [formData, setFormData] = useState({
    slug: '',
    image: '',
    tuitionFee: '',
    name: { tr: '', en: '', az: '', ru: '', uk: '', ge: '' },
    description: { tr: '', en: '', az: '', ru: '', uk: '', ge: '' },
    country: { tr: '', en: '', az: '', ru: '', uk: '', ge: '' },
    city: { tr: '', en: '', az: '', ru: '', uk: '', ge: '' },
  });

  const handleLangChange = (field: string, lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...(prev[field as keyof typeof prev] as Record<string, string>),
        [lang]: value
      }
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });
      
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, image: data.url }));
      } else {
        alert('Resim yüklenemedi!');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleTranslateAll = async () => {
    const sourceLang = activeTab;
    const sourceData = {
      name: (formData.name as Record<string, string>)[sourceLang],
      description: (formData.description as Record<string, string>)[sourceLang],
      country: (formData.country as Record<string, string>)[sourceLang],
      city: (formData.city as Record<string, string>)[sourceLang],
    };

    if (!sourceData.name && !sourceData.description) {
      alert('Lütfen önce mevcut dilde (aktif sekmede) içerik girin.');
      return;
    }

    setTranslating(true);
    const targetLocales = LOCALES.filter(l => l.code !== sourceLang);

    try {
      for (const target of targetLocales) {
        const fields = ['name', 'description', 'country', 'city'];
        const updatedFields: Record<string, string> = {};

        for (const field of fields) {
          const text = (formData[field as keyof typeof formData] as Record<string, string>)[sourceLang];
          if (text && text.trim() !== '') {
            const res = await fetch('/api/admin/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text,
                targetLang: target.code,
                sourceLang
              })
            });

            if (res.ok) {
              const data = await res.json();
              updatedFields[field] = data.translatedText;
            }
          }
        }

        setFormData(prev => {
          const newState = { ...prev };
          fields.forEach(field => {
            if (updatedFields[field]) {
              (newState[field as keyof typeof newState] as Record<string, string>)[target.code] = updatedFields[field];
            }
          });
          return newState;
        });
      }
      alert('Çeviriler tamamlandı!');
    } catch (err) {
      console.error(err);
      alert('Çeviri sırasında bir hata oluştu.');
    } finally {
      setTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Otomatik doldurma (Fallback) mantığı
    const processedFormData = { ...formData };
    const fieldsToFill = ['name', 'description', 'country', 'city'];
    
    fieldsToFill.forEach(field => {
      const fieldData = { ...(processedFormData[field as keyof typeof processedFormData] as Record<string, string>) };
      // İlk dolu olan dili bul
      const firstNonEmptyLang = Object.keys(fieldData).find(lang => fieldData[lang] && fieldData[lang].trim() !== '');
      
      if (firstNonEmptyLang) {
        const fallbackValue = fieldData[firstNonEmptyLang];
        // Boş olan dilleri bu değerle doldur
        Object.keys(fieldData).forEach(lang => {
          if (!fieldData[lang] || fieldData[lang].trim() === '') {
            fieldData[lang] = fallbackValue;
          }
        });
        // Güncellenmiş alanı geri yaz
        const key = field as keyof typeof processedFormData;
        if (key === 'name' || key === 'description' || key === 'country' || key === 'city') {
          processedFormData[key] = fieldData as typeof formData.name;
        }
      }
    });

    try {
      const res = await fetch('/api/admin/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedFormData)
      });

      if (res.ok) {
        router.push('/admin/universities');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Bir hata oluştu');
      }
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Yeni Üniversite Ekle</h1>
        <Link 
          href="/admin/universities" 
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          &larr; Geri Dön
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 shadow-sm rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
        {/* Global Settings */}
        <div className="mb-8 pb-8 border-b border-gray-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <input
              id="slug"
              type="text"
              required
              placeholder="ornek-universite"
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500"
              value={formData.slug}
              onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
            />
            <p className="text-xs text-gray-500 mt-1">Sadece küçük harf ve tire (-) kullanın.</p>
          </div>
          <div>
            <label htmlFor="tuitionFee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Harç Ücreti (Örn: $2,500/yıl)
            </label>
            <input
              id="tuitionFee"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500"
              value={formData.tuitionFee}
              onChange={e => setFormData({...formData, tuitionFee: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Görsel URL veya Yükle
            </label>
            <div className="flex space-x-4">
              <input
                id="image"
                type="text"
                placeholder="Görsel URL'si veya bilgisayardan seçin"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500"
                value={formData.image}
                onChange={e => setFormData({...formData, image: e.target.value})}
              />
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  title="Görsel seç"
                  aria-label="Görsel seç"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button
                  type="button"
                  disabled={uploading}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium transition-colors border border-gray-300 dark:border-zinc-700 h-full flex items-center justify-center whitespace-nowrap"
                >
                  {uploading ? 'Yükleniyor...' : 'Bilgisayardan Seç'}
                </button>
              </div>
            </div>
            {formData.image && (
              <div className="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formData.image} alt="Preview" className="object-cover w-full h-full" />
              </div>
            )}
          </div>
        </div>

        {/* Translation Tabs */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">Çoklu Dil İçerikleri</h2>
            <div className="flex border-b border-gray-200 dark:border-zinc-800 space-x-1 overflow-x-auto">
              {LOCALES.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setActiveTab(lang.code)}
                  className={`py-2 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === lang.code
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {lang.name} ({lang.code.toUpperCase()})
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={handleTranslateAll}
            disabled={translating}
            className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center ${translating ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {translating ? 'Çevriliyor...' : `Bu Dilden (${activeTab.toUpperCase()}) Tüm Dillere Çevir`}
          </button>
        </div>

        {/* Active Language Fields */}
        <div className="space-y-6">
          <div>
            <label htmlFor="nameInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Üniversite Adı ({activeTab.toUpperCase()})
            </label>
            <input
              id="nameInput"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500"
              value={(formData.name as Record<string, string>)[activeTab]}
              onChange={e => handleLangChange('name', activeTab, e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="countryInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ülke ({activeTab.toUpperCase()})
              </label>
              <input
                id="countryInput"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500"
                value={(formData.country as Record<string, string>)[activeTab]}
                onChange={e => handleLangChange('country', activeTab, e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="cityInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Şehir ({activeTab.toUpperCase()})
              </label>
              <input
                id="cityInput"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500"
                value={(formData.city as Record<string, string>)[activeTab]}
                onChange={e => handleLangChange('city', activeTab, e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="descInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Detaylı Açıklama ({activeTab.toUpperCase()})
            </label>
            <textarea
              id="descInput"
              rows={15}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500"
              value={(formData.description as Record<string, string>)[activeTab]}
              onChange={e => handleLangChange('description', activeTab, e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
          >
            {loading ? 'Kaydediliyor...' : 'Üniversiteyi Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
