import type { useTranslations } from 'next-intl';

/** CMS məzmun redaktoru tabları (az/tr/en/ru/uk/ge) */
export function getContentLocaleTabs(
  t: ReturnType<typeof useTranslations<'contentLocales'>>,
) {
  return [
    { code: 'tr', name: t('tr') },
    { code: 'en', name: t('en') },
    { code: 'az', name: t('az') },
    { code: 'ru', name: t('ru') },
    { code: 'uk', name: t('uk') },
    { code: 'ge', name: t('ge') },
  ] as const;
}
