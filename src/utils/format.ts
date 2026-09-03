import { storeConfig } from '@/config/store';

/**
 * تنسيق المبالغ بالأوقية الموريتانية.
 * كل الأسعار في المتجر أعداد صحيحة، لذا لا نحتاج حسابات عشرية إطلاقًا.
 */
const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

/** «1,500» — الرقم وحده بلا وحدة. */
export function formatNumber(value: number): string {
  return numberFormatter.format(Math.round(value));
}

/** «1,500 أوقية» — الصيغة المعتمدة في كل الموقع. */
export function formatPrice(value: number): string {
  return `${formatNumber(value)} ${storeConfig.currencyNameAr}`;
}

/** «1,500 MRU» — تُستخدم في البيانات المهيكلة لمحركات البحث. */
export function formatPriceCode(value: number): string {
  return `${formatNumber(value)} ${storeConfig.currency}`;
}

/** نسبة الخصم كعدد صحيح موجب، أو null إن لم يوجد خصم. */
export function discountPercent(price: number, oldPrice?: number): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/** يقصّ نصًا طويلًا مع إضافة نقاط — تجميع أصناف CSS موجود في utils/cn.ts. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}
