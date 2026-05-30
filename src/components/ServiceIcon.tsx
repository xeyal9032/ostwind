import type { ServiceIconKey } from '@/lib/services-defaults';

type ServiceIconProps = {
  name: ServiceIconKey | string;
  className?: string;
};

const stroke = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function DocumentsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-full w-full">
      <path
        {...stroke}
        d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
      />
      <path {...stroke} d="M14 2v5h5" />
      <path {...stroke} d="M8 13h5M8 17h8" />
      <path {...stroke} d="m9 11 2 2 4-4" strokeWidth={2} />
    </svg>
  );
}

function VisaIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-full w-full">
      <rect
        x="2"
        y="5"
        width="20"
        height="14"
        rx="2"
        className="fill-rose-500/10"
        stroke="currentColor"
        strokeWidth={1.75}
      />
      <path {...stroke} d="M2 10h20" />
      <rect
        x="5"
        y="13"
        width="4.5"
        height="3"
        rx="0.5"
        className="fill-rose-500/25"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <path {...stroke} d="M12 14.5h7M12 17h5" />
    </svg>
  );
}

function UniversityIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-full w-full">
      <path
        {...stroke}
        d="M22 10v6M2 10l10-5 10 5-10 5z"
      />
      <path
        {...stroke}
        d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5"
      />
      <path {...stroke} d="M12 5v3" strokeWidth={1.5} />
    </svg>
  );
}

function HousingIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-full w-full">
      <path {...stroke} d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path {...stroke} d="M9 22V12h6v10" />
      <circle
        cx="17"
        cy="11"
        r="2.5"
        className="fill-rose-500/15"
        stroke="currentColor"
        strokeWidth={1.75}
      />
      <path {...stroke} d="M17 8.75V9.5M15.5 11h3" strokeWidth={1.5} />
    </svg>
  );
}

function LanguageIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-full w-full">
      <path {...stroke} d="m5 8 6 6" />
      <path {...stroke} d="m4 14 6-6 2-3" />
      <path {...stroke} d="M2 5h12" />
      <path {...stroke} d="M7 2h1" />
      <path {...stroke} d="m22 22-5-10-5 10" />
      <path {...stroke} d="M14 18h6" />
    </svg>
  );
}

const ICON_KEYS: ServiceIconKey[] = ['documents', 'visa', 'university', 'housing', 'language'];

/** Slug və köhnə emoji ikonlarını peşəkar SVG açarına çevirir */
const SLUG_ICON_MAP: Record<string, ServiceIconKey> = {
  'senedlerin-hazirlanmasi': 'documents',
  'vize-danismanligi': 'visa',
  'viza-desteyi': 'visa',
  'universite-basvurusu': 'university',
  'konaklama-destegi': 'housing',
  'yasayis-yeri-secimi': 'housing',
  'dil-kurslari': 'language',
};

const EMOJI_ICON_MAP: Record<string, ServiceIconKey> = {
  '🛂': 'visa',
  '🎓': 'university',
  '🏠': 'housing',
  '📄': 'documents',
  '📋': 'documents',
  '🌐': 'language',
  '🗣️': 'language',
  '✈️': 'visa',
};

function IconGraphic({ name }: { name: ServiceIconKey }) {
  switch (name) {
    case 'documents':
      return <DocumentsIcon />;
    case 'visa':
      return <VisaIcon />;
    case 'university':
      return <UniversityIcon />;
    case 'housing':
      return <HousingIcon />;
    case 'language':
      return <LanguageIcon />;
    default:
      return <DocumentsIcon />;
  }
}

/** Xidmət kartları üçün vahid, peşəkar ikon çərçivəsi */
type ServiceIconBadgeProps = {
  icon?: string | null;
  slug?: string;
  size?: 'md' | 'lg';
  className?: string;
};

export function ServiceIconBadge({
  icon,
  slug,
  size = 'md',
  className = '',
}: ServiceIconBadgeProps) {
  const box = size === 'lg' ? 'h-16 w-16' : 'h-14 w-14';
  const iconSize = size === 'lg' ? 'h-8 w-8' : 'h-7 w-7';
  const key = resolveServiceIconKey(icon, slug);

  return (
    <div
      className={[
        'relative flex shrink-0 items-center justify-center rounded-2xl',
        'bg-gradient-to-br from-rose-500/20 via-rose-600/8 to-zinc-900/40',
        'ring-1 ring-rose-400/25 ring-inset',
        'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_8px_24px_-8px_rgba(190,24,93,0.35)]',
        box,
        className,
      ].join(' ')}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(251,113,133,0.2),transparent_55%)]"
      />
      <div className={`relative text-rose-400 ${iconSize}`}>
        <IconGraphic name={key} />
      </div>
    </div>
  );
}

export default function ServiceIcon({
  name,
  slug,
  className = 'h-7 w-7',
}: ServiceIconProps & { slug?: string }) {
  const key = resolveServiceIconKey(name, slug);
  return (
    <div className={`text-rose-400 ${className}`}>
      <IconGraphic name={key} />
    </div>
  );
}

export function resolveServiceIconKey(
  icon: string | null | undefined,
  slug?: string,
): ServiceIconKey {
  if (slug && SLUG_ICON_MAP[slug]) {
    return SLUG_ICON_MAP[slug];
  }

  if (icon) {
    if (EMOJI_ICON_MAP[icon]) {
      return EMOJI_ICON_MAP[icon];
    }
    if (ICON_KEYS.includes(icon as ServiceIconKey)) {
      return icon as ServiceIconKey;
    }
  }

  return 'documents';
}
