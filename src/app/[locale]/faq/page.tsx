import { getTranslations } from 'next-intl/server';
import { prisma } from '@/prisma';
import { getLocaleText } from '@/lib/locale-content';
import { notDeleted } from '@/lib/soft-delete';
import FaqAccordion from '@/components/FaqAccordion';
import { OSTWIND_LOGO_BG } from '@/lib/services-brand';

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('FAQ');

  const faqs = await prisma.fAQ.findMany({
    where: notDeleted,
    orderBy: { id: 'asc' },
  });

  const items = faqs.map((faq) => ({
    id: faq.id,
    question: getLocaleText(faq.question, locale),
    answer: getLocaleText(faq.answer, locale),
    category: faq.category,
  }));

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-zinc-950 dark:to-zinc-900">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.07] dark:opacity-[0.16]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={OSTWIND_LOGO_BG}
          alt=""
          className="h-auto w-auto max-h-[min(85vh,520px)] max-w-[min(88vw,520px)] object-contain"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/88 via-gray-50/94 to-gray-50 dark:from-zinc-950/90 dark:via-zinc-950/95 dark:to-zinc-900" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_35%,rgba(166,61,50,0.07),transparent_68%)] dark:bg-[radial-gradient(ellipse_85%_55%_at_50%_35%,rgba(166,61,50,0.18),transparent_68%)]" />

      <div className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('title')}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t('subtitle')}</p>
          </div>
          <FaqAccordion items={items} emptyMessage={t('noItems')} />
        </div>
      </div>
    </div>
  );
}
