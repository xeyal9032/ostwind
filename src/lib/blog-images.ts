/** Köhnə/bozuk Unsplash URL-ləri üçün ehtiyat şəkil */
export const BLOG_IMAGE_FALLBACK = '/images/hero/slide-01.jpg';

const BROKEN_UNSPLASH_IDS = [
  'photo-1523050854058-8df90110c9f1',
  'photo-1434030214721-40b81132893c',
];

export function resolveBlogImageUrl(image: string | null | undefined): string | null {
  if (!image?.trim()) return null;
  if (BROKEN_UNSPLASH_IDS.some((id) => image.includes(id))) {
    return BLOG_IMAGE_FALLBACK;
  }
  return image;
}
