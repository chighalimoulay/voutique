import type { AdminProduct, BadgeKind, Gender } from '@/types';

/**
 * أدوات نموذج المنتج: المعرّفات، الروابط (slug)، الأسعار، والتحقق.
 * كلها دوال نقية بلا اتصال بالشبكة.
 */

// ─── المعرّفات والروابط ──────────────────────────────────────────────

/** معرّف دائم للمنتج الجديد. لا يتغيّر بعد الإنشاء أبدًا. */
export function newProductId(): string {
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
      : Math.random().toString(36).slice(2, 12);
  return `p-${random}`;
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** يحوّل النص إلى رابط لاتيني: «Aqua Kiss — بخاخ» → «aqua-kiss». */
export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '');
}

/**
 * رابط مقترح لمنتج جديد. الأسماء العربية لا تتحوّل إلى حروف لاتينية،
 * فنستخدم الكلمات اللاتينية في الاسم أو الماركة إن وُجدت، وإلا رابطًا عامًا.
 */
export function suggestSlug(name: string, brand: string): string {
  const fromName = slugify(name);
  if (fromName.length >= 3) return fromName;

  const fromBrand = slugify(brand);
  const suffix = Math.random().toString(36).slice(2, 6);
  return fromBrand.length >= 3 ? `${fromBrand}-${suffix}` : `product-${suffix}`;
}

// ─── الأسعار ─────────────────────────────────────────────────────────

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

/**
 * يقرأ سعرًا كما تكتبه المالكة على الهاتف: «12500» أو «12,500» أو «١٢٥٠٠».
 * يعيد null إن كان الحقل فارغًا، و NaN إن لم يكن رقمًا صحيحًا.
 */
export function parsePrice(raw: string): number | null {
  const normalized = raw
    .trim()
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[\s,،٬]/g, '');

  if (normalized === '') return null;
  if (!/^\d+$/.test(normalized)) return Number.NaN;
  return Number(normalized);
}

// ─── النموذج ─────────────────────────────────────────────────────────

export interface OptionDraft {
  label: string;
  /** القيم مفصولة بفاصلة: «50 مل، 100 مل». */
  values: string;
}

export interface ProductDraft {
  name: string;
  price: string;
  oldPrice: string;
  description: string;
  shortDescription: string;
  category: string;
  gender: Gender;
  brand: string;
  size: string;
  ingredients: string;
  badge: BadgeKind | '';
  featured: boolean;
  bestSeller: boolean;
  available: boolean;
  published: boolean;
  options: OptionDraft[];
  slug: string;
}

export function draftFromProduct(product: AdminProduct): ProductDraft {
  return {
    name: product.name,
    price: String(product.price),
    oldPrice: product.oldPrice ? String(product.oldPrice) : '',
    description: product.description,
    shortDescription: product.shortDescription,
    category: product.category,
    gender: product.gender,
    brand: product.brand ?? '',
    size: product.size ?? '',
    ingredients: product.ingredients ?? '',
    badge: product.badge ?? '',
    featured: Boolean(product.featured),
    bestSeller: Boolean(product.bestSeller),
    available: product.available,
    published: product.published,
    options: (product.options ?? []).map((option) => ({
      label: option.label,
      values: option.values.join('، '),
    })),
    slug: product.slug,
  };
}

export function emptyDraft(defaultCategory: string): ProductDraft {
  return {
    name: '',
    price: '',
    oldPrice: '',
    description: '',
    shortDescription: '',
    category: defaultCategory,
    gender: 'women',
    brand: '',
    size: '',
    ingredients: '',
    badge: '',
    featured: false,
    bestSeller: false,
    available: true,
    published: true,
    options: [],
    slug: '',
  };
}

export type DraftErrors = Partial<Record<'name' | 'price' | 'oldPrice' | 'description' | 'slug', string>>;

export function validateDraft(draft: ProductDraft): DraftErrors {
  const errors: DraftErrors = {};

  if (!draft.name.trim()) errors.name = 'اكتبي اسم المنتج.';

  const price = parsePrice(draft.price);
  if (price === null) errors.price = 'اكتبي السعر.';
  else if (Number.isNaN(price)) errors.price = 'السعر يجب أن يكون رقمًا صحيحًا (مثل 12500).';
  else if (price === 0 && draft.published) {
    errors.price = 'لا يمكن نشر منتج بسعر صفر. أدخلي السعر أو أخفي المنتج.';
  }

  const oldPrice = parsePrice(draft.oldPrice);
  if (oldPrice !== null) {
    if (Number.isNaN(oldPrice)) errors.oldPrice = 'السعر القديم يجب أن يكون رقمًا صحيحًا.';
    else if (price !== null && !Number.isNaN(price) && oldPrice <= price) {
      errors.oldPrice = 'السعر القديم يجب أن يكون أكبر من السعر الحالي.';
    }
  }

  if (!draft.description.trim()) errors.description = 'اكتبي وصفًا للمنتج.';

  if (!SLUG_PATTERN.test(draft.slug)) {
    errors.slug = 'الرابط بحروف إنجليزية صغيرة وأرقام وشرطات فقط (مثل rose-perfume).';
  }

  return errors;
}

/** سطر قصير للبطاقة: إن تُرك فارغًا نأخذ أول جملة من الوصف. */
function deriveShortDescription(description: string): string {
  // بلا lookbehind عمدًا: غير مدعوم في Safari أقدم من 16.4 (هواتف iPhone قديمة)
  const text = description.trim();
  const firstSentence = text.match(/^[\s\S]*?[.!؟?](?=\s|$)/)?.[0] ?? text;
  return firstSentence.length <= 90 ? firstSentence : `${firstSentence.slice(0, 88).trimEnd()}…`;
}

function parseOptionValues(values: string): string[] {
  return values
    .split(/[,،]/)
    .map((value) => value.trim())
    .filter(Boolean);
}

/** يبني المنتج النهائي من النموذج (بعد نجاح التحقق). */
export function productFromDraft(
  draft: ProductDraft,
  base: { id: string; sortOrder: number; imageUrls: string[] },
): AdminProduct {
  const options = draft.options
    .map((option) => ({ label: option.label.trim(), values: parseOptionValues(option.values) }))
    .filter((option) => option.label && option.values.length > 0);

  const price = parsePrice(draft.price) ?? 0;
  const oldPrice = parsePrice(draft.oldPrice);

  return {
    id: base.id,
    slug: draft.slug,
    name: draft.name.trim(),
    description: draft.description.trim(),
    shortDescription: draft.shortDescription.trim() || deriveShortDescription(draft.description),
    price,
    oldPrice: oldPrice && !Number.isNaN(oldPrice) ? oldPrice : undefined,
    category: draft.category,
    brand: draft.brand.trim() || undefined,
    gender: draft.gender,
    image: base.imageUrls[0] ?? '',
    images: base.imageUrls.length > 0 ? base.imageUrls : undefined,
    badge: draft.badge || undefined,
    featured: draft.featured,
    bestSeller: draft.bestSeller,
    available: draft.available,
    size: draft.size.trim() || undefined,
    ingredients: draft.ingredients.trim() || undefined,
    options: options.length > 0 ? options : undefined,
    published: draft.published,
    sortOrder: base.sortOrder,
  };
}
