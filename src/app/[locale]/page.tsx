import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/prisma';
import HeroBackgroundSlider from '@/components/HeroBackgroundSlider';
import HomeStatsSection from '@/components/HomeStatsSection';
import { getSiteContent, resolveHomeTextKey, resolveLocaleText } from '@/lib/site-content';
import { notDeleted } from '@/lib/soft-delete';

const STAT_FALLBACK_KEYS = ['students', 'universities', 'countries', 'acceptance'] as const;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });
  const site = await getSiteContent();

  const ht = (key: string) =>
    resolveHomeTextKey(site, key, locale, t(key as Parameters<typeof t>[0]));

  const statItems = site.stats.map((stat, i) => ({
    end: stat.end,
    suffix: stat.suffix,
    thousands: stat.thousands,
    label: resolveLocaleText(
      stat.label,
      locale,
      t(`stats.${STAT_FALLBACK_KEYS[i] ?? 'students'}`),
    ),
  }));

  const featuresTitle = resolveLocaleText(site.features.title, locale, t('features.title'));
  const featuresSubtitle = resolveLocaleText(
    site.features.subtitle,
    locale,
    t('features.subtitle'),
  );

  const featuredUniversities = await prisma.university.findMany({
    where: notDeleted,
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative isolate overflow-hidden min-h-[100svh] min-h-[100dvh] sm:min-h-[85vh] bg-zinc-950">
        <HeroBackgroundSlider slides={site.heroSlides} />

        <div className="relative z-10 flex min-h-[100svh] min-h-[100dvh] sm:min-h-[85vh] items-center justify-center px-4 py-20 sm:py-28 sm:px-6 lg:px-8 lg:py-40">
          <div className="w-full max-w-7xl mx-auto text-center">
            <h1 className="text-[clamp(1.75rem,7vw,4.5rem)] font-extrabold text-white tracking-tight mb-6 sm:mb-8 leading-[1.15] drop-shadow-sm px-1">
              {ht('heroTitle1')} <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
                {ht('heroTitleHighlight')}
              </span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto font-light leading-relaxed mb-8 sm:mb-10 drop-shadow-sm px-1">
              {ht('heroDescription')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-6 w-full max-w-md sm:max-w-none mx-auto">
              <Link
                href="/apply"
                className="w-full sm:w-auto min-h-[48px] flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg font-bold rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all sm:hover:-translate-y-1"
              >
                {ht('heroApplyNow')}
              </Link>
              <Link
                href="/universities"
                className="w-full sm:w-auto min-h-[48px] flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg font-semibold rounded-full text-white bg-white/10 border border-white/30 hover:bg-white/20 backdrop-blur-sm transition-all"
              >
                {ht('heroExplore')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HomeStatsSection items={statItems} />

      <section className="section-pad bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{featuresTitle}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {featuresSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {site.features.cards.map((card, i) => {
              const titleFallback = t(
                `features.card${i + 1}Title` as 'features.card1Title',
              );
              const descFallback = t(`features.card${i + 1}Desc` as 'features.card1Desc');
              return (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-zinc-900 rounded-3xl p-8 border border-gray-100 dark:border-zinc-800 hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-2xl mb-6">
                    {card.icon || '🎓'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {resolveLocaleText(card.title, locale, titleFallback)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {resolveLocaleText(card.desc, locale, descFallback)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
                {resolveLocaleText(site.featured.title, locale, t('featured.title'))}
              </h2>
            </div>
            <Link
              href="/universities"
              className="inline-flex min-h-[44px] items-center text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
            >
              {resolveLocaleText(site.featured.viewAll, locale, t('featured.viewAll'))} &rarr;
            </Link>
          </div>

          {featuredUniversities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredUniversities.map(
                (uni: {
                  id: number;
                  slug: string;
                  name: unknown;
                  country: unknown;
                  image: string | null;
                }) => {
                  const nameRecord = uni.name as Record<string, string> | null;
                  const countryRecord = uni.country as Record<string, string> | null;
                  const name = nameRecord?.[locale] || nameRecord?.['tr'] || 'İsimsiz';
                  const country = countryRecord?.[locale] || countryRecord?.['tr'] || '';

                  return (
                    <Link href={`/universities/${uni.slug}`} key={uni.id} className="group block">
                      <div className="bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 dark:border-zinc-800">
                        <div className="h-48 bg-gray-200 dark:bg-zinc-800 relative">
                          {uni.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={uni.image}
                              alt={name}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 px-3 py-1 rounded-full text-xs font-semibold">
                            {country}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">
                            {name}
                          </h3>
                          <p className="text-blue-600 font-medium text-sm group-hover:underline">
                            {resolveLocaleText(
                              site.featured.viewDetails,
                              locale,
                              t('featured.viewDetails'),
                            )}{' '}
                            &rarr;
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                },
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-zinc-800 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700">
              <p className="text-gray-500 dark:text-gray-400">
                {resolveLocaleText(
                  site.featured.noUniversities,
                  locale,
                  t('featured.noUniversities'),
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-blue-600 dark:bg-blue-900 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          {resolveLocaleText(site.cta.title, locale, t('cta.title'))}
        </h2>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
          {resolveLocaleText(site.cta.desc, locale, t('cta.desc'))}
        </p>
        <Link
          href="/apply"
          className="inline-block px-10 py-4 text-lg font-bold rounded-full text-blue-600 bg-white hover:bg-gray-50 shadow-xl transition-transform transform hover:scale-105"
        >
          {resolveLocaleText(site.cta.button, locale, t('cta.button'))}
        </Link>
      </section>
    </div>
  );
}
