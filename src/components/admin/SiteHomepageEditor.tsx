'use client';

import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { getContentLocaleTabs } from '@/lib/admin-content-locales';
import { LOCALE_KEYS } from '@/lib/locale-content';
import {
  buildDefaultSiteContent,
  HERO_TEXT_KEYS,
  HEADER_KEYS,
  FOOTER_KEYS,
  type SiteContentV2,
  type LocaleMap,
  type HomeStatItem,
  type HomeFeatureCard,
} from '@/lib/site-content';

type Section = 'hero' | 'slides' | 'stats' | 'features' | 'featured' | 'header' | 'footer';

function emptyMap(): LocaleMap {
  return Object.fromEntries(LOCALE_KEYS.map((k) => [k, '']));
}

function patchMap(map: LocaleMap | undefined, locale: string, value: string): LocaleMap {
  return { ...(map || emptyMap()), [locale]: value };
}

export default function SiteHomepageEditor() {
  const tHome = useTranslations('xeyal.homepage');
  const tCommon = useTranslations('common');
  const tLocales = useTranslations('contentLocales');
  const LOCALES = getContentLocaleTabs(tLocales);

  const [section, setSection] = useState<Section>('hero');
  const [locale, setLocale] = useState('tr');
  const [content, setContent] = useState<SiteContentV2>(() => buildDefaultSiteContent());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const heroLabels = useMemo(
    () =>
      Object.fromEntries(
        HERO_TEXT_KEYS.map((key) => [key, tHome(key as 'heroTitle1')]),
      ) as Record<string, string>,
    [tHome],
  );

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/xeyal/homepage');
    const data = await res.json();
    if (res.ok && data.content) {
      setContent(data.content as SiteContentV2);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/xeyal/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || tCommon('saveFailed'));
      }
      const data = await res.json();
      if (data.content) setContent(data.content as SiteContentV2);
      setMessage(tCommon('homepageSaved'));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : tCommon('error'));
    } finally {
      setSaving(false);
    }
  };

  const setHeroText = (key: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      texts: {
        ...prev.texts,
        [key]: patchMap(prev.texts[key], locale, value),
      },
    }));
  };

  const setHeaderText = (key: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        [key]: patchMap(prev.header[key], locale, value),
      },
    }));
  };

  const setFooterText = (key: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        [key]: patchMap(prev.footer[key], locale, value),
      },
    }));
  };

  const setLocaleMapField = (
    updater: (prev: SiteContentV2) => SiteContentV2,
  ) => {
    setContent(updater);
  };

  const sections: { id: Section; label: string }[] = [
    { id: 'hero', label: tHome('tabHero') },
    { id: 'slides', label: tHome('tabSlides') },
    { id: 'stats', label: tHome('tabStats') },
    { id: 'features', label: tHome('tabFeatures') },
    { id: 'featured', label: tHome('tabFeatured') },
    { id: 'header', label: tHome('tabHeader') },
    { id: 'footer', label: tHome('tabFooter') },
  ];

  const needsLocaleTabs = section !== 'slides';

  if (loading) return <p className="text-gray-500">{tCommon('loading')}</p>;

  const savedOk = message === tCommon('homepageSaved');

  const inputClass =
    'w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSection(s.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              section === s.id
                ? 'bg-violet-600 text-white'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {needsLocaleTabs && (
        <div className="flex flex-wrap gap-2">
          {LOCALES.map((loc) => (
            <button
              key={loc.code}
              type="button"
              onClick={() => setLocale(loc.code)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                locale === loc.code
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={save}
        className="space-y-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6"
      >
        {section === 'hero' && (
          <div className="space-y-4">
            {HERO_TEXT_KEYS.map((key) => (
              <div key={key}>
                <label htmlFor={`hero-${key}`} className={labelClass}>
                  {heroLabels[key] || key}
                </label>
                {key === 'heroDescription' ? (
                  <textarea
                    id={`hero-${key}`}
                    rows={3}
                    value={content.texts[key]?.[locale] ?? ''}
                    onChange={(e) => setHeroText(key, e.target.value)}
                    className={inputClass}
                  />
                ) : (
                  <input
                    id={`hero-${key}`}
                    type="text"
                    value={content.texts[key]?.[locale] ?? ''}
                    onChange={(e) => setHeroText(key, e.target.value)}
                    className={inputClass}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {section === 'slides' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{tHome('slidesHint')}</p>
            {content.heroSlides.map((url, index) => (
              <div
                key={`slide-${index}`}
                className="flex flex-col gap-2 border border-gray-200 dark:border-zinc-700 rounded-lg p-4"
              >
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <ImageUploadField
                      id={`slide-${index}`}
                      label={`${tHome('slideUrl')} #${index + 1}`}
                      value={url}
                      onChange={(next) => {
                        setContent((prev) => {
                          const slides = [...prev.heroSlides];
                          slides[index] = next;
                          return { ...prev, heroSlides: slides };
                        });
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => {
                        setContent((prev) => {
                          const slides = [...prev.heroSlides];
                          [slides[index - 1], slides[index]] = [slides[index], slides[index - 1]];
                          return { ...prev, heroSlides: slides };
                        });
                      }}
                      className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-zinc-800 disabled:opacity-40"
                    >
                      {tHome('moveUp')}
                    </button>
                    <button
                      type="button"
                      disabled={index === content.heroSlides.length - 1}
                      onClick={() => {
                        setContent((prev) => {
                          const slides = [...prev.heroSlides];
                          [slides[index], slides[index + 1]] = [slides[index + 1], slides[index]];
                          return { ...prev, heroSlides: slides };
                        });
                      }}
                      className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-zinc-800 disabled:opacity-40"
                    >
                      {tHome('moveDown')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setContent((prev) => ({
                          ...prev,
                          heroSlides: prev.heroSlides.filter((_, i) => i !== index),
                        }));
                      }}
                      className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    >
                      {tHome('removeSlide')}
                    </button>
                  </div>
                </div>
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="" className="h-24 w-auto rounded object-cover" />
                ) : null}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setContent((prev) => ({ ...prev, heroSlides: [...prev.heroSlides, ''] }))
              }
              className="px-4 py-2 text-sm rounded-lg border border-dashed border-gray-300 dark:border-zinc-600"
            >
              {tHome('addSlide')}
            </button>
          </div>
        )}

        {section === 'stats' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">{tHome('statsHint')}</p>
            {content.stats.map((stat, index) => (
              <StatEditor
                key={index}
                stat={stat}
                locale={locale}
                tHome={tHome}
                inputClass={inputClass}
                labelClass={labelClass}
                onChange={(next) => {
                  setContent((prev) => {
                    const stats = [...prev.stats];
                    stats[index] = next;
                    return { ...prev, stats };
                  });
                }}
              />
            ))}
          </div>
        )}

        {section === 'features' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">{tHome('featuresHint')}</p>
            <LocaleInput
              label={tHome('featTitle')}
              value={content.features.title[locale] ?? ''}
              onChange={(v) =>
                setLocaleMapField((prev) => ({
                  ...prev,
                  features: {
                    ...prev.features,
                    title: patchMap(prev.features.title, locale, v),
                  },
                }))
              }
              inputClass={inputClass}
              labelClass={labelClass}
            />
            <LocaleInput
              label={tHome('featSubtitle')}
              value={content.features.subtitle[locale] ?? ''}
              onChange={(v) =>
                setLocaleMapField((prev) => ({
                  ...prev,
                  features: {
                    ...prev.features,
                    subtitle: patchMap(prev.features.subtitle, locale, v),
                  },
                }))
              }
              inputClass={inputClass}
              labelClass={labelClass}
              multiline
            />
            {content.features.cards.map((card, index) => (
              <FeatureCardEditor
                key={index}
                card={card}
                index={index}
                locale={locale}
                tHome={tHome}
                inputClass={inputClass}
                labelClass={labelClass}
                onChange={(next) => {
                  setContent((prev) => {
                    const cards = [...prev.features.cards];
                    cards[index] = next;
                    return {
                      ...prev,
                      features: { ...prev.features, cards },
                    };
                  });
                }}
              />
            ))}
          </div>
        )}

        {section === 'featured' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">{tHome('featuredHint')}</p>
            <FeaturedFields
              prefix="featured"
              maps={content.featured}
              locale={locale}
              tHome={tHome}
              setContent={setContent}
              inputClass={inputClass}
              labelClass={labelClass}
            />
            <hr className="border-gray-200 dark:border-zinc-700" />
            <FeaturedFields
              prefix="cta"
              maps={content.cta}
              locale={locale}
              tHome={tHome}
              setContent={setContent}
              inputClass={inputClass}
              labelClass={labelClass}
              isCta
            />
          </div>
        )}

        {section === 'header' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">{tHome('headerHint')}</p>
            {HEADER_KEYS.map((key) => (
              <LocaleInput
                key={key}
                label={tHome(`header_${key}` as 'header_home')}
                value={content.header[key]?.[locale] ?? ''}
                onChange={(v) => setHeaderText(key, v)}
                inputClass={inputClass}
                labelClass={labelClass}
              />
            ))}
          </div>
        )}

        {section === 'footer' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">{tHome('footerHint')}</p>
            {FOOTER_KEYS.map((key) => (
              <LocaleInput
                key={key}
                label={tHome(`footer_${key}` as 'footer_description')}
                value={content.footer[key]?.[locale] ?? ''}
                onChange={(v) => setFooterText(key, v)}
                inputClass={inputClass}
                labelClass={labelClass}
                multiline={key === 'description'}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 pt-2 border-t border-gray-100 dark:border-zinc-800">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
          >
            {saving ? tCommon('saving') : tCommon('save')}
          </button>
          {message && (
            <p className={`text-sm ${savedOk ? 'text-green-600' : 'text-red-500'}`}>{message}</p>
          )}
        </div>
      </form>
    </div>
  );
}

function LocaleInput({
  label,
  value,
  onChange,
  inputClass,
  labelClass,
  multiline,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputClass: string;
  labelClass: string;
  multiline?: boolean;
  id?: string;
}) {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <div>
      <label htmlFor={fieldId} className={labelClass}>
        {label}
      </label>
      {multiline ? (
        <textarea
          id={fieldId}
          name={fieldId}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      ) : (
        <input
          id={fieldId}
          name={fieldId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )}
    </div>
  );
}

function StatEditor({
  stat,
  locale,
  tHome,
  inputClass,
  labelClass,
  onChange,
}: {
  stat: HomeStatItem;
  locale: string;
  tHome: ReturnType<typeof useTranslations<'xeyal.homepage'>>;
  inputClass: string;
  labelClass: string;
  onChange: (s: HomeStatItem) => void;
}) {
  const statEndId = useId();
  const statSuffixId = useId();
  const statThousandsId = useId();

  return (
    <div className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label htmlFor={statEndId} className={labelClass}>
            {tHome('statEnd')}
          </label>
          <input
            id={statEndId}
            name={statEndId}
            type="number"
            value={stat.end}
            onChange={(e) => onChange({ ...stat, end: Number(e.target.value) || 0 })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={statSuffixId} className={labelClass}>
            {tHome('statSuffix')}
          </label>
          <input
            id={statSuffixId}
            name={statSuffixId}
            type="text"
            value={stat.suffix}
            onChange={(e) => onChange({ ...stat, suffix: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="flex items-end pb-2">
          <label htmlFor={statThousandsId} className="flex items-center gap-2 text-sm">
            <input
              id={statThousandsId}
              name={statThousandsId}
              type="checkbox"
              checked={!!stat.thousands}
              onChange={(e) => onChange({ ...stat, thousands: e.target.checked })}
            />
            {tHome('statThousands')}
          </label>
        </div>
      </div>
      <LocaleInput
        label={`${tHome('statEnd')} — etiket`}
        value={stat.label[locale] ?? ''}
        onChange={(v) => onChange({ ...stat, label: patchMap(stat.label, locale, v) })}
        inputClass={inputClass}
        labelClass={labelClass}
      />
    </div>
  );
}

function FeatureCardEditor({
  card,
  index,
  locale,
  tHome,
  inputClass,
  labelClass,
  onChange,
}: {
  card: HomeFeatureCard;
  index: number;
  locale: string;
  tHome: ReturnType<typeof useTranslations<'xeyal.homepage'>>;
  inputClass: string;
  labelClass: string;
  onChange: (c: HomeFeatureCard) => void;
}) {
  return (
    <div className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4 space-y-3">
      <p className="font-medium text-sm">
        {tHome('featureCard')} {index + 1}
      </p>
      <LocaleInput
        label={tHome('cardIcon')}
        value={card.icon}
        onChange={(v) => onChange({ ...card, icon: v })}
        inputClass={inputClass}
        labelClass={labelClass}
      />
      <LocaleInput
        label="Başlıq"
        value={card.title[locale] ?? ''}
        onChange={(v) => onChange({ ...card, title: patchMap(card.title, locale, v) })}
        inputClass={inputClass}
        labelClass={labelClass}
      />
      <LocaleInput
        label="Mətn"
        value={card.desc[locale] ?? ''}
        onChange={(v) => onChange({ ...card, desc: patchMap(card.desc, locale, v) })}
        inputClass={inputClass}
        labelClass={labelClass}
        multiline
      />
    </div>
  );
}

function FeaturedFields({
  prefix,
  maps,
  locale,
  tHome,
  setContent,
  inputClass,
  labelClass,
  isCta,
}: {
  prefix: 'featured' | 'cta';
  maps: SiteContentV2['featured'] | SiteContentV2['cta'];
  locale: string;
  tHome: ReturnType<typeof useTranslations<'xeyal.homepage'>>;
  setContent: React.Dispatch<React.SetStateAction<SiteContentV2>>;
  inputClass: string;
  labelClass: string;
  isCta?: boolean;
}) {
  const fields = isCta
    ? ([
        ['title', tHome('ctaTitle')],
        ['desc', tHome('ctaDesc')],
        ['button', tHome('ctaButton')],
      ] as const)
    : ([
        ['title', tHome('featuredTitle')],
        ['viewAll', tHome('featuredViewAll')],
        ['viewDetails', tHome('featuredViewDetails')],
        ['noUniversities', tHome('featuredNoUni')],
      ] as const);

  return (
    <>
      {fields.map(([key, label]) => (
        <LocaleInput
          key={key}
          label={label}
          value={(maps as Record<string, LocaleMap>)[key]?.[locale] ?? ''}
          onChange={(v) => {
            setContent((prev) => {
              const block = { ...prev[prefix] } as Record<string, LocaleMap>;
              block[key] = patchMap(block[key], locale, v);
              return { ...prev, [prefix]: block } as SiteContentV2;
            });
          }}
          inputClass={inputClass}
          labelClass={labelClass}
          multiline={key === 'desc'}
        />
      ))}
    </>
  );
}
