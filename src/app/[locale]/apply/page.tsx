import { getTranslations } from 'next-intl/server';
import { prisma } from '@/prisma';
import { notDeleted } from '@/lib/soft-delete';
import ApplyForm from '@/components/forms/ApplyForm';

export default async function ApplyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ university?: string }>;
}) {
  const { locale } = await params;
  const { university: universitySlug } = await searchParams;
  const t = await getTranslations('Apply');

  const universities = await prisma.university.findMany({
    where: notDeleted,
    orderBy: { createdAt: 'desc' },
  });

  const getLabel = (name: unknown) => {
    if (!name || typeof name !== 'object') return '—';
    const record = name as Record<string, string>;
    return record[locale] || record.tr || record.en || Object.values(record)[0] || '—';
  };

  const options = universities.map((u) => ({
    id: u.id,
    slug: u.slug,
    label: getLabel(u.name),
  }));

  const preselected = universitySlug
    ? universities.find((u) => u.slug === universitySlug)?.id
    : undefined;

  return (
    <div className="py-24 min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('title')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
        <ApplyForm universities={options} defaultUniversityId={preselected} />
      </div>
    </div>
  );
}
