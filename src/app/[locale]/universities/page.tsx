import { getTranslations } from 'next-intl/server';
import { getActiveUniversityHubs } from '@/lib/university-hub';
import UniversityHubGrid from '@/components/universities/UniversityHubGrid';

export default async function UniversitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tHeader = await getTranslations({ locale, namespace: 'Header' });
  const tHub = await getTranslations({ locale, namespace: 'UniversitiesHub' });

  const hubs = await getActiveUniversityHubs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
      <div className="text-center mb-10 sm:mb-12 md:mb-16">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2 sm:mb-3">
          {tHub('eyebrow')}
        </p>
        <h1 className="page-title font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
          {tHeader('universities')}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-1">
          {tHub('subtitle')}
        </p>
      </div>

      {hubs.length > 0 ? (
        <UniversityHubGrid
          hubs={hubs}
          locale={locale}
          exploreLabel={tHub('explore')}
          countLabel={(n) => tHub('universityCount', { count: n })}
        />
      ) : (
        <p className="text-center text-gray-500">{tHub('noHubs')}</p>
      )}
    </div>
  );
}
