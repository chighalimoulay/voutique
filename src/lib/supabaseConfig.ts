/**
 * إعدادات الاتصال بـ Supabase — بدون استيراد مكتبة Supabase نفسها.
 *
 * منفصلة عن src/lib/supabase.ts حتى يقرّر المتجر عند التحميل هل يجلب
 * البيانات الحية أم لا، دون أن تدخل المكتبة في الحزمة الأولى للصفحة
 * (تُحمَّل لاحقًا عند الحاجة فقط، فيبقى فتح الموقع سريعًا على الهاتف).
 */
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** هل أُعدّت بيانات الاتصال بـ Supabase؟ */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
