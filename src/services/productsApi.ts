import { supabase } from '@/lib/supabase';
import type { AdminProduct, BadgeKind, Gender, Product, ProductOption } from '@/types';

/**
 * ══════════════════════════════════════════════════════════════════
 *  طبقة الوصول إلى جدول products في Supabase.
 *
 *  أسماء الأعمدة في قاعدة البيانات بصيغة snake_case (old_price)،
 *  وفي التطبيق بصيغة camelCase (oldPrice). التحويل يحدث هنا فقط،
 *  فلا يعرف أي مكوّن شيئًا عن شكل الجدول.
 * ══════════════════════════════════════════════════════════════════
 */

export const PRODUCTS_TABLE = 'products';

/** صف كما يُخزَّن في جدول products (انظري supabase/migrations/0001_init.sql). */
export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  price: number;
  old_price: number | null;
  category: string;
  brand: string | null;
  gender: Gender;
  image: string;
  images: string[];
  badge: BadgeKind | null;
  featured: boolean;
  best_seller: boolean;
  available: boolean;
  published: boolean;
  size: string | null;
  ingredients: string | null;
  options: ProductOption[];
  sort_order: number;
  updated_at?: string;
}

export const ROW_COLUMNS =
  'id, slug, name, short_description, description, price, old_price, category, brand, gender, ' +
  'image, images, badge, featured, best_seller, available, published, size, ingredients, options, ' +
  'sort_order, updated_at';

/** null في قاعدة البيانات = حقل غير موجود في المنتج (كما في products.ts). */
function optional<T>(value: T | null | undefined): T | undefined {
  return value === null || value === undefined ? undefined : value;
}

export function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description,
    description: row.description,
    price: row.price,
    oldPrice: optional(row.old_price),
    category: row.category,
    brand: optional(row.brand),
    gender: row.gender,
    image: row.image,
    images: row.images && row.images.length > 0 ? row.images : undefined,
    badge: optional(row.badge),
    featured: row.featured,
    bestSeller: row.best_seller,
    available: row.available,
    size: optional(row.size),
    ingredients: optional(row.ingredients),
    options: Array.isArray(row.options) && row.options.length > 0 ? row.options : undefined,
  };
}

export function rowToAdminProduct(row: ProductRow): AdminProduct {
  return {
    ...rowToProduct(row),
    published: row.published,
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
  };
}

export function productToRow(product: AdminProduct): Omit<ProductRow, 'updated_at'> {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    short_description: product.shortDescription,
    description: product.description,
    price: product.price,
    old_price: product.oldPrice ?? null,
    category: product.category,
    brand: product.brand ?? null,
    gender: product.gender,
    image: product.image,
    images: product.images ?? [],
    badge: product.badge ?? null,
    featured: Boolean(product.featured),
    best_seller: Boolean(product.bestSeller),
    available: product.available,
    published: product.published,
    size: product.size ?? null,
    ingredients: product.ingredients ?? null,
    options: product.options ?? [],
    sort_order: product.sortOrder,
  };
}

/**
 * المنتجات المنشورة للمتجر، بترتيب الكتالوج.
 *
 * نُصفّي published صراحةً: سياسات RLS تفعل ذلك للزوار، لكن المالكة
 * المسجّلة دخولها ترى كل المنتجات، ولا نريد أن تظهر لها المنتجات
 * المخفية داخل واجهة المتجر نفسها.
 */
export async function fetchPublishedProducts(): Promise<Product[]> {
  if (!supabase) throw new Error('Supabase غير مضبوط');

  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .select(ROW_COLUMNS)
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data as unknown as ProductRow[]).map(rowToProduct);
}

/** كل المنتجات (بما فيها المخفية) — للوحة الإدارة فقط، وتتطلب تسجيل الدخول. */
export async function fetchAllProductsForAdmin(): Promise<AdminProduct[]> {
  if (!supabase) throw new Error('Supabase غير مضبوط');

  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .select(ROW_COLUMNS)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data as unknown as ProductRow[]).map(rowToAdminProduct);
}
