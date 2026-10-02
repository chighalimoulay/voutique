/**
 * صور واجهة المتجر القابلة للتغيير من لوحة الإدارة («صور المتجر»).
 *
 * لكل صورة مفتاح ثابت في جدول site_images. إن لم يوجد صف لمفتاحٍ ما،
 * تُعرض الصورة الأصلية من public/images — فالموقع لا يتعطّل أبدًا.
 */

export const HERO_IMAGE_KEY = 'hero';

/** الصورة الأصلية للـ Hero (الافتراضية). */
export const DEFAULT_HERO_IMAGE = '/images/voutique-hero-gift.jpg';

/** مفتاح صورة الفئة — الصورة الأصلية تبقى في src/data/categories.ts. */
export function categoryImageKey(slug: string): string {
  return `category:${slug}`;
}
