import type { ServiceIconKey } from '@/lib/services-defaults';

export type ServiceIconOption = {
  value: ServiceIconKey;
  label: string;
  hint: string;
};

/** Admin panel və sayt ikonları — eyni açarlar */
export const SERVICE_ICON_OPTIONS: ServiceIconOption[] = [
  {
    value: 'documents',
    label: 'Sənədlərin hazırlanması',
    hint: 'Sənəd / qəbul sənədləri',
  },
  {
    value: 'visa',
    label: 'Viza dəstəyi',
    hint: 'Viza / bank kartı',
  },
  {
    value: 'university',
    label: 'Universitet müraciəti',
    hint: 'Təhsil / universitet',
  },
  {
    value: 'housing',
    label: 'Yaşayış yeri seçimi',
    hint: 'Ev / yerləşmə',
  },
  {
    value: 'language',
    label: 'Dil kursları',
    hint: 'Dil / tərcümə',
  },
];

export function isServiceIconKey(value: string): value is ServiceIconKey {
  return SERVICE_ICON_OPTIONS.some((option) => option.value === value);
}

export function normalizeServiceIconForAdmin(
  icon: string | null | undefined,
  slug?: string,
): ServiceIconKey {
  if (icon && isServiceIconKey(icon)) return icon;

  const slugMap: Record<string, ServiceIconKey> = {
    'senedlerin-hazirlanmasi': 'documents',
    'vize-danismanligi': 'visa',
    'viza-desteyi': 'visa',
    'universite-basvurusu': 'university',
    'konaklama-destegi': 'housing',
    'yasayis-yeri-secimi': 'housing',
    'dil-kurslari': 'language',
  };

  if (slug && slugMap[slug]) return slugMap[slug];

  const emojiMap: Record<string, ServiceIconKey> = {
    '🛂': 'visa',
    '🎓': 'university',
    '🏠': 'housing',
    '📄': 'documents',
    '📋': 'documents',
    '🌐': 'language',
  };

  if (icon && emojiMap[icon]) return emojiMap[icon];

  return 'documents';
}
