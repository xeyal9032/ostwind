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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center mb-12 md:mb-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
          {tHub('eyebrow')}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {tHeader('universities')}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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
