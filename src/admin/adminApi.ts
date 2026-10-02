import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import {
  PRODUCTS_TABLE,
  ROW_COLUMNS,
  productToRow,
  rowToAdminProduct,
  type ProductRow,
} from '@/services/productsApi';
import type { AdminProduct } from '@/types';

/**
 * ══════════════════════════════════════════════════════════════════
 *  عمليات لوحة الإدارة: الدخول، المنتجات، الصور.
 *
 *  الصلاحيات لا تُفرض هنا بل في Supabase (RLS + is_admin()). حتى لو
 *  استُدعيت هذه الدوال من مستخدم غير مصرّح، سيرفض الخادم العملية.
 * ══════════════════════════════════════════════════════════════════
 */

export const IMAGES_BUCKET = 'product-images';

export { fetchAllProductsForAdmin } from '@/services/productsApi';

function client(): SupabaseClient {
  if (!supabase) throw new Error('Supabase غير مضبوط');
  return supabase;
}

// ─── الدخول ───────────────────────────────────────────────────────────

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await client().auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  await client().auth.signOut();
}

/** هل المستخدم الحالي ضمن قائمة المديرين (public.admins)؟ */
export async function checkIsAdmin(): Promise<boolean> {
  const { data, error } = await client().rpc('is_admin');
  if (error) throw error;
  return data === true;
}

// ─── المنتجات ─────────────────────────────────────────────────────────

export async function fetchAdminProduct(id: string): Promise<AdminProduct | null> {
  const { data, error } = await client()
    .from(PRODUCTS_TABLE)
    .select(ROW_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToAdminProduct(data as unknown as ProductRow) : null;
}

/** ترتيب المنتج الجديد: بعد آخر منتج (كإضافته في آخر الملف سابقًا). */
export async function nextSortOrder(): Promise<number> {
  const { data, error } = await client()
    .from(PRODUCTS_TABLE)
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ? (data as { sort_order: number }).sort_order + 1 : 0;
}

export async function isSlugTaken(slug: string, exceptId?: string): Promise<boolean> {
  let query = client().from(PRODUCTS_TABLE).select('id').eq('slug', slug);
  if (exceptId) query = query.neq('id', exceptId);

  const { data, error } = await query.limit(1);
  if (error) throw error;
  return (data ?? []).length > 0;
}

export async function createProduct(product: AdminProduct): Promise<AdminProduct> {
  const { data, error } = await client()
    .from(PRODUCTS_TABLE)
    .insert(productToRow(product))
    .select(ROW_COLUMNS)
    .single();

  if (error) throw error;
  return rowToAdminProduct(data as unknown as ProductRow);
}

export async function updateProduct(product: AdminProduct): Promise<AdminProduct> {
  // المعرّف لا يتغيّر أبدًا: السلة والمفضلة على أجهزة العميلات تشير إليه
  const { id, ...changes } = productToRow(product);

  const { data, error } = await client()
    .from(PRODUCTS_TABLE)
    .update(changes)
    .eq('id', id)
    .select(ROW_COLUMNS)
    .single();

  if (error) throw error;
  return rowToAdminProduct(data as unknown as ProductRow);
}

export async function setProductPublished(id: string, published: boolean): Promise<void> {
  const { data, error } = await client()
    .from(PRODUCTS_TABLE)
    .update({ published })
    .eq('id', id)
    .select('id');

  if (error) throw error;
  // RLS يرفض بصمت (0 صفوف) بدل رسالة خطأ — نحوّل ذلك إلى خطأ واضح
  if (!data || data.length === 0) throw new Error('لم يتم التعديل — تحققي من صلاحيات الحساب.');
}

export async function deleteProduct(id: string): Promise<void> {
  const { data, error } = await client().from(PRODUCTS_TABLE).delete().eq('id', id).select('id');

  if (error) throw error;
  if (!data || data.length === 0) throw new Error('لم يتم الحذف — تحققي من صلاحيات الحساب.');
}

// ─── الصور ────────────────────────────────────────────────────────────

function randomToken(): string {
  return Math.random().toString(36).slice(2, 8);
}

/** يرفع صورة (مضغوطة مسبقًا) ويعيد مسارها في المخزن ورابطها العام. */
export async function uploadProductImage(
  productId: string,
  image: Blob,
): Promise<{ path: string; url: string }> {
  return uploadImage(`products/${productId}/${Date.now()}-${randomToken()}.jpg`, image);
}

/** صور واجهة المتجر في مجلد site/ منفصل: «hero» أو «category:care» ← site/category-care/… */
export async function uploadSiteImage(
  key: string,
  image: Blob,
): Promise<{ path: string; url: string }> {
  const folder = key.replace(/[^a-z0-9-]/g, '-');
  return uploadImage(`site/${folder}/${Date.now()}-${randomToken()}.jpg`, image);
}

async function uploadImage(path: string, image: Blob): Promise<{ path: string; url: string }> {
  const { error } = await client().storage.from(IMAGES_BUCKET).upload(path, image, {
    contentType: 'image/jpeg',
    // اسم كل ملف فريد، فيمكن للمتصفح الاحتفاظ به طويلًا
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) throw error;

  const { data } = client().storage.from(IMAGES_BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

/**
 * مسار الصورة داخل المخزن انطلاقًا من رابطها العام.
 * يعيد null للصور الثابتة (/images/products/...) — تلك لا تُحذف أبدًا.
 */
export function storagePathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${IMAGES_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length).split('?')[0]);
}

export async function removeStoredImages(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const { error } = await client().storage.from(IMAGES_BUCKET).remove(paths);
  if (error) throw error;
}

// ─── صور واجهة المتجر (site_images) ──────────────────────────────────

const SITE_IMAGES_TABLE = 'site_images';

/** يحفظ الصورة المخصّصة لمفتاحٍ ما (إضافة أو استبدال). */
export async function saveSiteImage(key: string, imageUrl: string): Promise<void> {
  const { data, error } = await client()
    .from(SITE_IMAGES_TABLE)
    .upsert({ key, image_url: imageUrl }, { onConflict: 'key' })
    .select('key');

  if (error) throw error;
  if (!data || data.length === 0) throw new Error('لم يتم الحفظ — تحققي من صلاحيات الحساب.');
}

/** يحذف الصورة المخصّصة، فيعود الموقع إلى الصورة الأصلية. */
export async function deleteSiteImage(key: string): Promise<void> {
  const { data, error } = await client()
    .from(SITE_IMAGES_TABLE)
    .delete()
    .eq('key', key)
    .select('key');

  if (error) throw error;
  // RLS يرفض بصمت (0 صفوف) — نحوّل ذلك إلى خطأ واضح بدل «نجاح» وهمي
  if (!data || data.length === 0) {
    throw new Error('لم تتم الاستعادة — حدّثي الصفحة ثم حاولي مجددًا.');
  }
}
