import { Link } from '@/i18n/routing';

type Uni = {
  id: number;
  slug: string;
  name: unknown;
  country: unknown;
  city: unknown;
  description: unknown;
  image: string | null;
  tuitionFee: string | null;
};

function getFallback(record: Record<string, string> | null, locale: string) {
  if (!record) return '';
  if (record[locale]?.trim()) return record[locale].trim();
  const v = Object.values(record).find((x) => x?.trim());
  return v?.trim() || '';
}

export default function UniversityListGrid({
  universities,
  locale,
  labels,
}: {
  universities: Uni[];
  locale: string;
  labels: {
    noImage: string;
    noFeeInfo: string;
    viewDetails: string;
    empty: string;
  };
}) {
  if (universities.length === 0) {
    return (
      <div className="text-center py-20 rounded-2xl border border-dashed border-gray-300 dark:border-zinc-700">
        <p className="text-gray-500 dark:text-gray-400">{labels.empty}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {universities.map((uni) => {
        const nameRecord = uni.name as Record<string, string> | null;
        const countryRecord = uni.country as Record<string, string> | null;
        const cityRecord = uni.city as Record<string, string> | null;
        const descRecord = uni.description as Record<string, string> | null;

        const name = getFallback(nameRecord, locale) || '—';
        const country = getFallback(countryRecord, locale);
        const city = getFallback(cityRecord, locale);
        const description = getFallback(descRecord, locale);

        return (
          <Link href={`/universities/${uni.slug}`} key={uni.id} className="group">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
              <div className="relative h-48 bg-gray-200 dark:bg-zinc-800">
                {uni.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={uni.image} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    {labels.noImage}
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
                  {city}
                  {city && country ? ', ' : ''}
                  {country}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                  {description}
                </p>

                <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {uni.tuitionFee || labels.noFeeInfo}
                  </span>
                  <span className="text-blue-600 font-medium text-sm group-hover:underline">
                    {labels.viewDetails} &rarr;
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
