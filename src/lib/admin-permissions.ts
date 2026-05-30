/** CMS modul icazələri — null/boş = tam icazə (köhnə adminlər) */
export const PERMISSION_KEYS = [
  'universities',
  'services',
  'pricing',
  'faq',
  'blog',
  'applications',
  'messages',
  'contact',
  'team',
  'about',
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  universities: 'Üniversiteler',
  services: 'Hizmetler',
  pricing: 'Fiyatlandırma',
  faq: 'SSS',
  blog: 'Blog',
  applications: 'Başvurular',
  messages: 'Mesajlar',
  contact: 'Əlaqə',
  team: 'Ekip',
  about: 'Hakkımızda',
};

export function parsePermissions(raw: unknown): PermissionKey[] | null {
  if (raw == null) return null;
  if (!Array.isArray(raw)) return null;
  const valid = raw.filter((k): k is PermissionKey =>
    PERMISSION_KEYS.includes(k as PermissionKey),
  );
  return valid.length > 0 ? valid : null;
}

export function hasPermission(
  role: string | undefined,
  permissions: unknown,
  key: PermissionKey,
): boolean {
  if (role === 'SUPER_ADMIN') return true;
  const list = parsePermissions(permissions);
  if (!list) return true;
  return list.includes(key);
}
