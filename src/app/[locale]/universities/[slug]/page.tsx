import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/prisma';
import { notDeleted } from '@/lib/soft-delete';

export default async function UniversityDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string, slug: string }> 
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'UniversityDetail' });

  const university = await prisma.university.findFirst({
    where: { slug, ...notDeleted },
  });

  if (!university) {
    notFound();
  }

  const nameRecord = university.name as Record<string, string> | null;
  const countryRecord = university.country as Record<string, string> | null;
  const cityRecord = university.city as Record<string, string> | null;
  const descRecord = university.description as Record<string, string> | null;

  const getFallback = (record: Record<string, string> | null, currentLocale: string) => {
    if (!record) return '';
    if (record[currentLocale] && record[currentLocale].trim() !== '') {
      return record[currentLocale];
    }
    // Eğer o dilde yoksa, ilk bulduğu dolu dili dönsün
    const fallbackValue = Object.values(record).find(v => v && v.trim() !== '');
    return fallbackValue || '';
  };

  const name = getFallback(nameRecord, locale) || 'İsimsiz';
  const country = getFallback(countryRecord, locale);
  const city = getFallback(cityRecord, locale);
  const description = getFallback(descRecord, locale);

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-96 bg-zinc-900 w-full">
        {university.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={university.image} 
            alt={name}
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <Link href="/universities" className="text-blue-400 hover:text-blue-300 mb-6 inline-block font-medium">
              &larr; {t('backToUniversities')}
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {name}
            </h1>
            <div className="flex items-center text-zinc-300 space-x-6">
              <span className="flex items-center">
                <span className="mr-2">📍</span> {city}, {country}
              </span>
              {university.tuitionFee && (
                <span className="flex items-center">
                  <span className="mr-2">💰</span> {university.tuitionFee}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sol Kolon: Açıklama */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('aboutUniversity')}</h2>
              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {description}
              </div>
            </div>
          </div>

          {/* Sağ Kolon: Başvuru Formu CTA */}
          <div className="lg:col-span-1">
            <div className="bg-blue-600 rounded-2xl shadow-lg p-8 text-white sticky top-24">
              <h3 className="text-2xl font-bold mb-4">{t('applyNow')}</h3>
              <p className="text-blue-100 mb-8">
                {t('applyDescription', { name })}
              </p>
              <Link 
                href={`/apply?university=${university.slug}`}
                className="block w-full py-3 px-4 bg-white text-blue-600 text-center font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
              >
                {t('fillApplicationForm')}
              </Link>
              
              <div className="mt-6 pt-6 border-t border-blue-500/50">
                <p className="text-sm text-blue-200 mb-2">{t('haveQuestions')}</p>
                <Link href="/contact" className="flex items-center text-white hover:text-blue-100 font-medium">
                  <span className="mr-2">📞</span> {t('talkToAdvisor')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
