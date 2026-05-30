import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { prisma } from '@/prisma';
import { ServiceIconBadge } from '@/components/ServiceIcon';
import { SERVICES_LOGO_BG } from '@/lib/services-brand';
import {
  getLocalizedField,
  getServiceDescription,
  getServicesForDisplay,
} from '@/lib/services-defaults';
import { notDeleted } from '@/lib/soft-delete';

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Services' });

  const dbServices = await prisma.service.findMany({
    where: notDeleted,
    orderBy: { id: 'asc' },
  });
  const services = getServicesForDisplay(dbServices);

  const whyItems = [
    { title: t('whyExpertTitle'), desc: t('whyExpertDesc') },
    { title: t('whyTransparentTitle'), desc: t('whyTransparentDesc') },
    { title: t('whySupportTitle'), desc: t('whySupportDesc') },
  ];

  const processSteps = [
    { step: '01', title: t('processStep1Title'), desc: t('processStep1Desc') },
    { step: '02', title: t('processStep2Title'), desc: t('processStep2Desc') },
    { step: '03', title: t('processStep3Title'), desc: t('processStep3Desc') },
    { step: '04', title: t('processStep4Title'), desc: t('processStep4Desc') },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      <section className="relative isolate overflow-hidden py-24 lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.18]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SERVICES_LOGO_BG}
            alt=""
            className="h-auto w-auto max-h-full max-w-[min(92vw,560px)] object-contain"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#3d1210]/55 via-zinc-950/94 to-zinc-950" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_15%,rgba(166,61,50,0.22),transparent_65%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-rose-300/95 text-sm font-semibold uppercase tracking-wider">
              {t('corporateSolutions')}
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-3 mb-5 drop-shadow-sm">
              {t('title')}
            </h1>
            <p className="text-lg text-zinc-300 leading-relaxed">{t('description')}</p>
            <p className="mt-4 text-base text-zinc-400 leading-relaxed">{t('intro')}</p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {services.map((service) => {
              const title = getLocalizedField(service.title, locale);
              const description = getServiceDescription(service.description, locale);
              return (
                <Link
                  href={`/services/${service.slug}`}
                  key={service.slug}
                  className="group relative block rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-8 lg:p-10 shadow-sm backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-rose-500/35 hover:shadow-2xl hover:shadow-rose-900/10"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#8b2e22]/10 via-transparent to-blue-900/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative flex gap-5">
                    <ServiceIconBadge
                      icon={service.icon}
                      slug={service.slug}
                      className="transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="min-w-0">
                      <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-rose-200">
                        {title || '—'}
                      </h3>
                      <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
                      <div className="mt-5 flex items-center text-sm font-semibold text-rose-300/90">
                        {t('viewDetails')}
                        <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {services.length === 0 && (
            <div className="mt-16 rounded-2xl border border-zinc-800/80 bg-zinc-900/70 py-20 text-center text-zinc-400">
              {t('noServices')}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-zinc-800/80 bg-zinc-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">{t('whyTitle')}</h2>
            <p className="text-zinc-400 leading-relaxed">{t('whyDesc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyItems.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8"
              >
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800/80 bg-[#120908] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">{t('processTitle')}</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">{t('processDesc')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6"
              >
                <span className="text-3xl font-extrabold text-rose-500/30">{item.step}</span>
                <h3 className="mt-3 text-base font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a2540] via-blue-700 to-[#6e241c] p-10 sm:p-12 text-center shadow-2xl shadow-blue-900/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12)_0%,rgba(0,0,0,0)_60%)]" />

          <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-bold text-white">{t('ctaTitle')}</h2>
            <p className="mx-auto mb-8 max-w-2xl text-blue-100">{t('ctaDesc')}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/apply"
                className="inline-block rounded-xl bg-white px-8 py-3 font-semibold text-blue-700 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-50"
              >
                {t('ctaButton')}
              </Link>
              <Link
                href="/contact"
                className="inline-block rounded-xl border border-white/30 px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                {t('ctaContact')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
