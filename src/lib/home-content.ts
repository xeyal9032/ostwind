import { getSiteContent, resolveHomeTextKey, resolveLocaleText } from '@/lib/site-content';

/** @deprecated getSiteContent istifadə edin */
export async function getHomeContentOverrides() {
  const site = await getSiteContent();
  return site.texts;
}

export async function resolveHomeText(
  key: string,
  locale: string,
  fallback: string,
): Promise<string> {
  const site = await getSiteContent();
  return resolveHomeTextKey(site, key, locale, fallback);
}

/** @deprecated resolveHomeTextKey istifadə edin */
export function resolveHomeTextFromSite(
  texts: Record<string, Record<string, string>>,
  key: string,
  locale: string,
  fallback: string,
): string {
  return resolveLocaleText(texts[key], locale, fallback);
}
