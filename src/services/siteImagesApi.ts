import { supabaseAnonKey, supabaseUrl } from '@/lib/supabaseConfig';

/** مفتاح الصورة ← رابطها المخصّص. المفاتيح الغائبة تعني «الصورة الأصلية». */
export type SiteImageMap = Record<string, string>;

/**
 * قراءة صور واجهة المتجر.
 *
 * طلب HTTP مباشر بدل مكتبة Supabase عمدًا: الصورة الكبيرة في أعلى الصفحة
 * الرئيسية لا يجب أن تنتظر تحميل المكتبة (حوالي 60 كيلوبايت).
 * القراءة عامة بحكم سياسات RLS، والكتابة تتم فقط من لوحة الإدارة.
 */
export async function fetchSiteImages(signal?: AbortSignal): Promise<SiteImageMap> {
  const response = await fetch(`${supabaseUrl}/rest/v1/site_images?select=key,image_url`, {
    headers: { apikey: supabaseAnonKey as string },
    signal,
  });
  if (!response.ok) throw new Error(`site_images: HTTP ${response.status}`);

  const rows = (await response.json()) as Array<{ key: string; image_url: string }>;
  return Object.fromEntries(rows.map((row) => [row.key, row.image_url]));
}
