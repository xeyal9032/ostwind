import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { prisma } from '@/prisma';
import { getLocaleText } from '@/lib/locale-content';
import { notDeleted } from '@/lib/soft-delete';
import { OSTWIND_LOGO_BG } from '@/lib/services-brand';

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Pricing');

  const plans = await prisma.pricingPlan.findMany({
    where: notDeleted,
    orderBy: { id: 'asc' },
  });

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

          {plans.length === 0 ? (
            <p className="text-center text-gray-500">{t('noPlans')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => {
                const name = getLocaleText(plan.name, locale);
                const featuresRaw = getLocaleText(plan.features, locale);
                const features = featuresRaw.split('\n').map((f) => f.trim()).filter(Boolean);

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-2xl p-8 border ${
                      plan.isPopular
                        ? 'border-blue-500 shadow-xl shadow-blue-500/10 bg-white dark:bg-zinc-900 scale-105'
                        : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                    }`}
                  >
                    {plan.isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {t('popular')}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{name}</h3>
                    <p className="text-3xl font-extrabold text-blue-600 mb-6">{plan.price}</p>
                    <ul className="space-y-3 mb-8">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/apply"
                      className={`block w-full text-center py-3 rounded-xl font-semibold transition-colors ${
                        plan.isPopular
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {t('choosePlan')}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
