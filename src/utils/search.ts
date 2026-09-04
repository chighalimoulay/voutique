import { getCategoryName } from '@/data/categories';
import { hasRealPhoto } from '@/data/products';
import type { Product, ShopFilters, SortKey } from '@/types';

/**
 * تطبيع النص العربي قبل المقارنة:
 *  - إزالة التشكيل والتطويل.
 *  - توحيد الألف (أ إ آ → ا) والتاء المربوطة والياء.
 * بدون هذا، البحث عن «عطر» لا يجد «عِطر»، و«هدايا» لا تجد «هدايه».
 */
const DIACRITICS = /[ً-ْـ]/g;

export function normalizeArabic(text: string): string {
  return text
    .toLowerCase()
    .replace(DIACRITICS, '')
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim();
}

/** النص القابل للبحث داخل منتج واحد. */
function searchableText(product: Product): string {
  return normalizeArabic(
    [
      product.name,
      product.shortDescription,
      product.description,
      product.brand ?? '',
      getCategoryName(product.category),
      product.size ?? '',
    ].join(' '),
  );
}

/** بحث بكل الكلمات: كل كلمة في الاستعلام يجب أن ترد في نص المنتج. */
export function searchProducts(list: Product[], query: string): Product[] {
  const words = normalizeArabic(query).split(' ').filter(Boolean);
  if (words.length === 0) return list;

  return list.filter((product) => {
    const haystack = searchableText(product);
    return words.every((word) => haystack.includes(word));
  });
}

/**
 * الترتيب الافتراضي وترتيب «الأحدث» يقدّمان المنتجات المصوَّرة فعليًا،
 * لأن صدارة الواجهة بمنتجات ذات صور توضيحية تُضعف انطباع المتجر.
 * أما إذا اختارت العميلة ترتيبًا صريحًا (السعر أو الاسم) فنحترمه كاملًا
 * ولا نتدخّل فيه.
 */
function sortProducts(list: Product[], sort: SortKey): Product[] {
  const sorted = [...list];
  const photo = (product: Product) => Number(hasRealPhoto(product));

  switch (sort) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
    case 'newest':
      // «الجديد» أولًا، ثم المصوَّر فعليًا، ثم بقية المنتجات بترتيب الملف
      return sorted.sort(
        (a, b) =>
          Number(b.badge === 'new') - Number(a.badge === 'new') || photo(b) - photo(a),
      );
    case 'featured':
    default:
      return sorted.sort(
        (a, b) => photo(b) - photo(a) || Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
      );
  }
}

/** تطبيق كل المرشّحات ثم الترتيب — تُستخدم في صفحتَي المتجر والتصنيف. */
export function applyFilters(list: Product[], filters: ShopFilters): Product[] {
  let result = list;

  if (filters.search.trim()) {
    result = searchProducts(result, filters.search);
  }

  if (filters.category !== 'all') {
    result = result.filter((product) => product.category === filters.category);
  }

  if (filters.gender !== 'all') {
    result = result.filter((product) => product.gender === filters.gender);
  }

  if (filters.minPrice !== null) {
    const min = filters.minPrice;
    result = result.filter((product) => product.price >= min);
  }

  if (filters.maxPrice !== null) {
    const max = filters.maxPrice;
    result = result.filter((product) => product.price <= max);
  }

  if (filters.availableOnly) {
    result = result.filter((product) => product.available);
  }

  if (filters.onSaleOnly) {
    result = result.filter((product) => Boolean(product.oldPrice));
  }

  return sortProducts(result, filters.sort);
}

export const DEFAULT_FILTERS: ShopFilters = {
  search: '',
  category: 'all',
  gender: 'all',
  minPrice: null,
  maxPrice: null,
  availableOnly: false,
  onSaleOnly: false,
  sort: 'featured',
};

export const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'featured', label: 'المختارات أولًا' },
  { value: 'newest', label: 'الأحدث' },
  { value: 'price_asc', label: 'السعر: من الأقل للأعلى' },
  { value: 'price_desc', label: 'السعر: من الأعلى للأقل' },
  { value: 'name', label: 'الاسم (أبجديًا)' },
];

export const GENDER_OPTIONS: Array<{ value: ShopFilters['gender']; label: string }> = [
  { value: 'all', label: 'الكل' },
  { value: 'women', label: 'نسائي' },
  { value: 'men', label: 'رجالي' },
  { value: 'unisex', label: 'للجنسين' },
];
