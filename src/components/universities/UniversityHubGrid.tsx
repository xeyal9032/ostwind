import Image from 'next/image';
import { Link } from '@/i18n/routing';
import HubCampusPhoto from '@/components/universities/HubCampusPhoto';
import {
  hubTitle,
  hubSubtitle,
  getHubAccentStyle,
  resolveHubFlagUrl,
  resolveHubCampusImage,
  hubCampusFallback,
} from '@/lib/university-hub';

type HubRow = {
  slug: string;
  title: unknown;
  subtitle?: unknown;
  icon: string | null;
  flagImage?: string | null;
  image: string | null;
  accentColor: string | null;
  _count: { universities: number };
  universities?: { image: string | null }[];
};

export default function UniversityHubGrid({
  hubs,
  locale,
  exploreLabel,
  countLabel,
}: {
  hubs: HubRow[];
  locale: string;
  exploreLabel: string;
  countLabel: (count: number) => string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
      {hubs.map((hub, index) => {
        const accent = getHubAccentStyle(hub.accentColor);
        const title = hubTitle(hub, locale);
        const subtitle = hubSubtitle(hub, locale);
        const count = hub._count.universities;
        const flagUrl = resolveHubFlagUrl(hub);
        const campusUrl = resolveHubCampusImage(
          hub,
          hub.universities?.[0]?.image ?? null,
        );
        const showEmoji = !flagUrl && hub.icon && !hub.icon.startsWith('http');

        return (
          <Link
            key={hub.slug}
            href={`/universities/${hub.slug}`}
            className={`group relative flex flex-col-reverse sm:flex-row overflow-hidden rounded-2xl sm:rounded-3xl ring-1 ${accent.ring} bg-gray-900 shadow-xl ${accent.glow} transition-all duration-300 sm:hover:-translate-y-1 sm:hover:shadow-2xl`}
          >
            <div
              className={`relative flex flex-1 flex-col justify-between min-h-0 sm:min-h-[220px] p-5 sm:p-8 bg-gradient-to-br ${accent.gradient}`}
            >
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors" />

              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-4">
                  {flagUrl ? (
                    <div className="shrink-0 rounded-xl overflow-hidden ring-2 ring-white/40 shadow-lg bg-white/10">
                      <Image
                        src={flagUrl}
                        alt=""
                        width={64}
                        height={48}
                        priority={index === 0}
                        className="h-12 w-16 object-cover"
                      />
                    </div>
                  ) : showEmoji ? (
                    <span className="text-4xl drop-shadow-md shrink-0" aria-hidden>
                      {hub.icon}
                    </span>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-sm leading-tight">
                      {title}
                    </h2>
                  </div>
                </div>
                {subtitle ? (
                  <p className="text-sm md:text-base text-white/90 max-w-md leading-relaxed">
                    {subtitle}
                  </p>
                ) : null}
              </div>

              <div className="relative z-10 mt-5 sm:mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-medium text-white/75 uppercase tracking-wider order-2 sm:order-1">
                  {count > 0 ? countLabel(count) : ''}
                </span>
                <span className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-2.5 text-sm font-semibold text-white border border-white/25 group-hover:bg-white group-hover:text-gray-900 transition-colors shrink-0 order-1 sm:order-2">
                  {exploreLabel}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </div>

            {campusUrl ? (
              <div className="group/photo relative w-full sm:w-[42%] aspect-[16/10] sm:aspect-auto sm:min-h-0 min-h-[180px] sm:min-w-[180px] overflow-hidden bg-gray-900 shrink-0">
                <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover/photo:scale-105">
                  <HubCampusPhoto
                    src={campusUrl}
                    alt={title}
                    fallbackSrc={hubCampusFallback(hub.slug)}
                    priority={index === 0}
                  />
                </div>
                {/* Bütün foto üzrə yüngül qaralma — mətn tərəfi ilə keçid */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-black/5 pointer-events-none"
                  aria-hidden
                />
                {/* Hover: tam şəkil sahəsində vahid işıqlanma */}
                <div
                  className="absolute inset-0 bg-white/0 transition-colors duration-300 group-hover/photo:bg-white/20 pointer-events-none"
                  aria-hidden
                />
              </div>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
