'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ServiceIconSelect from '@/components/admin/ServiceIconSelect';
import type { ServiceIconKey } from '@/lib/services-defaults';

const LOCALES = [
  { code: 'tr', name: 'Türkçe' },
  { code: 'en', name: 'English' },
  { code: 'az', name: 'Azərbaycanca' },
  { code: 'ru', name: 'Русский' },
  { code: 'uk', name: 'Українська' },
  { code: 'ge', name: 'ქართული' },
];

export default function NewServicePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('az'); // Default to AZ since user enters content in AZ
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [translating, setTranslating] = useState(false);

  const [formData, setFormData] = useState({
    slug: '',
    icon: 'documents' as ServiceIconKey,
    title: { tr: '', en: '', az: '', ru: '', uk: '', ge: '' } as Record<string, string>,
    description: { tr: '', en: '', az: '', ru: '', uk: '', ge: '' } as Record<string, string>,
    features: { tr: '', en: '', az: '', ru: '', uk: '', ge: '' } as Record<string, string>,
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

  const handleTranslateAll = async () => {
    const sourceLang = activeTab;
    const sourceData = {
      title: formData.title[sourceLang as keyof typeof formData.title],
      description: formData.description[sourceLang as keyof typeof formData.description],
    };

    if (!sourceData.title && !sourceData.description) {
      alert('Lütfen önce mevcut dilde (aktif sekmede) içerik girin.');
      return;
    }

    setTranslating(true);
    const targetLocales = LOCALES.filter(l => l.code !== sourceLang);

    try {
      for (const target of targetLocales) {
        const fields = ['title', 'description'];
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

    // Fallback logic
    const processedFormData = { ...formData };
    const fieldsToFill = ['title', 'description'];
    
    fieldsToFill.forEach(field => {
      const fieldData = { ...(processedFormData[field as keyof typeof processedFormData] as Record<string, string>) };
      const firstNonEmptyLang = Object.keys(fieldData).find(lang => fieldData[lang] && fieldData[lang].trim() !== '');
      
      if (firstNonEmptyLang) {
        const fallbackValue = fieldData[firstNonEmptyLang];
        Object.keys(fieldData).forEach(lang => {
          if (!fieldData[lang] || fieldData[lang].trim() === '') {
            fieldData[lang] = fallbackValue;
          }
        });
        const key = field as keyof typeof processedFormData;
        if (key === 'title' || key === 'description') {
          processedFormData[key] = fieldData as typeof formData.title;
        }
      }
    });

    // Merge features into description
    const descObj = { ...processedFormData.description } as Record<string, string>;
    LOCALES.forEach(lang => {
      const featuresText = processedFormData.features[lang.code as keyof typeof processedFormData.features];
      if (featuresText && featuresText.trim() !== '') {
        descObj[`features_${lang.code}`] = featuresText;
      }
    });
    processedFormData.description = descObj;

    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedFormData)
      });

      if (res.ok) {
        router.push('/admin/services');
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Yeni Hizmet Ekle</h1>
        <Link 
          href="/admin/services" 
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
              placeholder="vize-danismanligi"
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500"
              value={formData.slug}
              onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
            />
          </div>
          <ServiceIconSelect
            value={formData.icon}
            onChange={(icon) => setFormData({ ...formData, icon })}
          />
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
            <label htmlFor="titleInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hizmet Adı ({activeTab.toUpperCase()})
            </label>
            <input
              id="titleInput"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500"
              value={formData.title[activeTab as keyof typeof formData.title]}
              onChange={e => handleLangChange('title', activeTab, e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="descInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Detaylı Açıklama ({activeTab.toUpperCase()})
            </label>
            <textarea
              id="descInput"
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500"
              value={formData.description[activeTab as keyof typeof formData.description]}
              onChange={e => handleLangChange('description', activeTab, e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="featuresInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Özellikler (Satır başına bir tane) ({activeTab.toUpperCase()})
            </label>
            <textarea
              id="featuresInput"
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500"
              value={formData.features[activeTab as keyof typeof formData.features] || ''}
              onChange={e => handleLangChange('features', activeTab, e.target.value)}
              placeholder="Kişiye özel durum analizi&#10;Gerekli tüm evrakların kontrolü"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Kaydediliyor...' : 'Hizmeti Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
