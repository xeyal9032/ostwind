'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getContentLocaleTabs } from '@/lib/admin-content-locales';
import ImageUploadField from '@/components/admin/ImageUploadField';
import TeamSocialLinksFields from '@/components/admin/TeamSocialLinksFields';
import { EMPTY_SOCIAL_LINKS, normalizeSocialLinks, parseSocialLinks } from '@/lib/team-social';

export default function EditTeamMemberPage() {
  const t = useTranslations('team');
  const tCommon = useTranslations('common');
  const tLocales = useTranslations('contentLocales');
  const LOCALES = getContentLocaleTabs(tLocales);
  const router = useRouter();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('az');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    image: '',
    role: { tr: '', en: '', az: '', ru: '', uk: '', ge: '' },
    socialLinks: { ...EMPTY_SOCIAL_LINKS },
  });

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(`/api/admin/team/${id}`);
        if (res.ok) {
          const data = await res.json();

          const mergeJson = (field: unknown) => {
            const base = { tr: '', en: '', az: '', ru: '', uk: '', ge: '' };
            if (!field) return base;
            return { ...base, ...(typeof field === 'string' ? JSON.parse(field) : field) };
          };

          setFormData({
            name: data.name || '',
            image: data.image || '',
            role: mergeJson(data.role),
            socialLinks: parseSocialLinks(data.socialLinks),
          });
        } else {
          setError(t('notFound'));
        }
      } catch {
        setError(tCommon('connectionError'));
      } finally {
        setPageLoading(false);
      }
    };
    if (id) fetchMember();
  }, [id, t, tCommon]);

  const handleLangChange = (lang: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: {
        ...prev.role,
        [lang]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const roleData = { ...formData.role };
    const firstNonEmptyLang = Object.keys(roleData).find(
      (lang) => roleData[lang as keyof typeof roleData] && roleData[lang as keyof typeof roleData].trim() !== '',
    );

    if (firstNonEmptyLang) {
      const fallbackValue = roleData[firstNonEmptyLang as keyof typeof roleData];
      Object.keys(roleData).forEach((lang) => {
        if (!roleData[lang as keyof typeof roleData] || roleData[lang as keyof typeof roleData].trim() === '') {
          roleData[lang as keyof typeof roleData] = fallbackValue;
        }
      });
    }

    try {
      const res = await fetch(`/api/admin/team/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: roleData,
          socialLinks: normalizeSocialLinks(formData.socialLinks),
        }),
      });

      if (res.ok) {
        router.push('/admin/team');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || tCommon('error'));
      }
    } catch {
      setError(tCommon('connectionError'));
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400">{tCommon('loading')}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('edit')}</h1>
        <Link
          href="/admin/team"
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {tCommon('backToList')}
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 shadow-sm rounded-xl border border-gray-200 dark:border-zinc-800 p-6"
      >
        <div className="mb-8 pb-8 border-b border-gray-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('fullNameRequired')} <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <ImageUploadField
            value={formData.image}
            onChange={(image) => setFormData((prev) => ({ ...prev, image }))}
          />
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
              {t('multiLocaleRole')}
            </h2>
            <div className="flex border-b border-gray-200 dark:border-zinc-800 space-x-1 overflow-x-auto">
              {LOCALES.map((lang) => (
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
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="roleInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('roleField')} ({activeTab.toUpperCase()})
            </label>
            <input
              id="roleInput"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500"
              value={formData.role[activeTab as keyof typeof formData.role]}
              onChange={(e) => handleLangChange(activeTab, e.target.value)}
              placeholder={t('rolePlaceholder')}
            />
          </div>
        </div>

        <TeamSocialLinksFields
          value={formData.socialLinks}
          onChange={(socialLinks) => setFormData((prev) => ({ ...prev, socialLinks }))}
        />

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? tCommon('saving') : tCommon('saveChanges')}
          </button>
        </div>
      </form>
    </div>
  );
}
