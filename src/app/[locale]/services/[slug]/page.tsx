import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { prisma } from '@/prisma';
import { ServiceIconBadge } from '@/components/ServiceIcon';
import {
  findDefaultServiceBySlug,
  getLocalizedField,
  getServiceDescription,
  getServiceFeatures,
  getServicesForDisplay,
} from '@/lib/services-defaults';
import { notDeleted } from '@/lib/soft-delete';

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tDetail = await getTranslations({ locale, namespace: 'ServiceDetail' });

  const dbService = await prisma.service.findFirst({
    where: { slug, ...notDeleted },
  });

  let service = dbService
    ? getServicesForDisplay([dbService])[0]
    : null;

  if (!service) {
    const fallback = findDefaultServiceBySlug(slug);
    if (fallback) {
      service = {
        id: fallback.id,
        slug: fallback.slug,
        title: fallback.title,
        description: fallback.description,
        icon: fallback.icon,
        createdAt: fallback.createdAt,
        updatedAt: fallback.updatedAt,
      };
    }
  }

  if (!service) {
    notFound();
  }

  const title = getLocalizedField(service.title, locale);
  const description = getServiceDescription(service.description, locale);
  const featuresFromDb = getServiceFeatures(service.description, locale);
  const features =
    featuresFromDb.length > 0
      ? featuresFromDb
      : [tDetail('feature1'), tDetail('feature2'), tDetail('feature3')];

  return (
    <div className="min-h-screen bg-zinc-950 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/services"
          className="mb-8 inline-flex items-center text-sm font-medium text-rose-300 hover:text-rose-200"
        >
          ← {tDetail('backToServices')}
        </Link>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 sm:p-10 shadow-xl backdrop-blur-md">
          <ServiceIconBadge icon={service.icon} slug={service.slug} size="lg" className="mb-8" />

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">{title}</h1>

          <p className="text-lg leading-relaxed text-zinc-300 whitespace-pre-wrap">{description}</p>

          <div className="mt-12 border-t border-zinc-800 pt-10">
            <h2 className="text-2xl font-bold text-white mb-6">{tDetail('whatsIncluded')}</h2>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-0.5 text-rose-400">✓</span>
                  <span className="text-zinc-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">{tDetail('interested')}</h3>
            <p className="text-sm text-zinc-400">{tDetail('interestedDesc')}</p>
          </div>
          <Link
            href="/apply"
            className="inline-flex justify-center rounded-xl bg-rose-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-rose-500"
          >
            {tDetail('applyNow')}
          </Link>
        </div>
      </div>
    </div>
  );
}
