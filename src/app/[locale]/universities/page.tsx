import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/prisma';
import { notDeleted } from '@/lib/soft-delete';

export default async function UniversitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tHeader = await getTranslations('Header');
  const tList = await getTranslations('UniversitiesList');
  
  const universities = await prisma.university.findMany({
    where: notDeleted,
    orderBy: { createdAt: 'desc' },
  });

  const getFallback = (record: Record<string, string> | null, currentLocale: string) => {
    if (!record) return '';
    if (record[currentLocale] && record[currentLocale].trim() !== '') {
      return record[currentLocale];
    }
    const fallbackValue = Object.values(record).find(v => v && v.trim() !== '');
    return fallbackValue || '';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {tHeader('universities')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {tList('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {universities.map((uni: { id: number, slug: string, name: unknown, country: unknown, city: unknown, description: unknown, image: string | null, tuitionFee: string | null }) => {
          const nameRecord = uni.name as Record<string, string> | null;
          const countryRecord = uni.country as Record<string, string> | null;
          const cityRecord = uni.city as Record<string, string> | null;
          const descRecord = uni.description as Record<string, string> | null;

          const name = getFallback(nameRecord, locale) || 'İsimsiz';
          const country = getFallback(countryRecord, locale);
          const city = getFallback(cityRecord, locale);
          const description = getFallback(descRecord, locale);

          return (
            <Link href={`/universities/${uni.slug}`} key={uni.id} className="group">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                <div className="relative h-48 bg-gray-200 dark:bg-zinc-800">
                  {uni.image ? (
                    // Next.js Image bileşeni yerine standart img kullanıyoruz çünkü harici URL'ler için next.config.ts ayarı gerekecek.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={uni.image} 
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      {tList('noImage')}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {country}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="mr-2">📍</span>
                    {city}, {country}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                    {description}
                  </p>
                  
                  <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {uni.tuitionFee || tList('noFeeInfo')}
                    </span>
                    <span className="text-blue-600 font-medium text-sm group-hover:underline">
                      {tList('viewDetails')} &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
