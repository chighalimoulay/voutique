import { Droplet, Gift, Palette, ShieldCheck, Sparkles, Wind } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * سجلّ أيقونات التصنيفات.
 *
 * ⚠ مقصود أن يكون الاستيراد صريحًا لكل أيقونة على حدة.
 * استخدام `import * as Icons from 'lucide-react'` يُدخل مكتبة الأيقونات كاملة
 * في الحزمة (أكثر من 700 كيلوبايت) ويُبطئ الموقع على الهاتف.
 *
 * ➕ لإضافة تصنيف بأيقونة جديدة: استوردي الأيقونة أعلاه وأضيفيها هنا،
 *    ثم استخدمي اسمها في حقل icon داخل src/data/categories.ts
 */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Sparkles,
  Wind,
  Droplet,
  Palette,
  ShieldCheck,
  Gift,
};

export function resolveCategoryIcon(name: string): LucideIcon {
  return CATEGORY_ICONS[name] ?? Sparkles;
}
