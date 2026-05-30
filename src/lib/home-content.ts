import { prisma } from '@/prisma';

type HomeOverrides = Record<string, Record<string, string>>;

export async function getHomeContentOverrides(): Promise<HomeOverrides> {
  try {
    const row = await prisma.homePageContent.findUnique({ where: { id: 1 } });
    return (row?.content as HomeOverrides) ?? {};
  } catch {
    return {};
  }
}

/** DB override varsa istifadə et, yoxsa next-intl tərcüməsi */
export function resolveHomeText(
  overrides: HomeOverrides,
  key: string,
  locale: string,
  fallback: string,
): string {
  const entry = overrides[key];
  if (!entry) return fallback;
  return (
    entry[locale] ||
    entry.tr ||
    entry.az ||
    entry.en ||
    Object.values(entry).find((v) => v?.trim()) ||
    fallback
  );
}
