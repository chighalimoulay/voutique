import type { Category } from '@/types';

/**
 * تصنيفات المتجر.
 * لإضافة تصنيف جديد: انسخي عنصرًا وغيّري slug و name والصورة،
 * ثم استخدمي نفس الـ slug في حقل category داخل src/data/products.ts
 */
export const categories: Category[] = [
  {
    slug: 'perfumes',
    name: 'العطور',
    description: 'عطور نسائية فاخرة بلمسات زهرية وشرقية تدوم طويلًا.',
    image: '/images/categories/perfumes.svg',
    icon: 'Sparkles',
    order: 1,
  },
  {
    slug: 'perfumes-men',
    name: 'العطور الرجالية',
    description: 'عطور رجالية كلاسيكية وعصرية بثبات عالٍ وحضور مميز.',
    image: '/images/products/dior-homme-fragrance-for-man.jpeg',
    icon: 'Wind',
    order: 2,
  },
  {
    slug: 'care',
    name: 'العناية',
    description: 'روتين متكامل للعناية بالبشرة والشعر والجسم.',
    image: '/images/categories/care.svg',
    icon: 'Droplet',
    order: 3,
  },
  {
    slug: 'makeup',
    name: 'مستحضرات التجميل',
    description: 'مكياج بألوان ودرجات تناسب كل الإطلالات.',
    image: '/images/categories/makeup.svg',
    icon: 'Palette',
    order: 4,
  },
  {
    slug: 'hygiene',
    name: 'النظافة والجمال',
    description: 'أساسيات النظافة والعناية الشخصية اليومية.',
    image: '/images/categories/hygiene.svg',
    icon: 'ShieldCheck',
    order: 5,
  },
  {
    slug: 'gifts',
    name: 'الهدايا',
    description: 'مجموعات هدايا جاهزة ومغلّفة بعناية لكل المناسبات.',
    image: '/images/categories/gifts.svg',
    icon: 'Gift',
    order: 6,
  },
];

export const categoriesBySlug = new Map(categories.map((category) => [category.slug, category]));

export function getCategory(slug: string): Category | undefined {
  return categoriesBySlug.get(slug);
}

export function getCategoryName(slug: string): string {
  return categoriesBySlug.get(slug)?.name ?? slug;
}
