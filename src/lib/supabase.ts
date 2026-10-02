import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from './supabaseConfig';

/**
 * ══════════════════════════════════════════════════════════════════
 *  عميل Supabase — نقطة الاتصال الوحيدة بقاعدة البيانات والتخزين.
 *
 *  نستخدم المفتاح العام (publishable / anon) فقط. هذا المفتاح آمن في
 *  الواجهة لأن الحماية تعتمد على Row Level Security داخل Supabase،
 *  وليس على إخفاء المفتاح. لا يوجد أي service-role / secret key هنا.
 *
 *  إذا لم تُضبط متغيّرات البيئة، يبقى العميل = null، وتعود طبقة البيانات
 *  تلقائيًا إلى المنتجات الثابتة في src/data/products.ts دون أن ينكسر
 *  المتجر.
 *
 *  ⚠ لا تستوردي هذا الملف استيرادًا ثابتًا من مكوّنات المتجر العامة —
 *  استخدمي import() الديناميكي حتى تبقى المكتبة خارج الحزمة الأولى.
 * ══════════════════════════════════════════════════════════════════
 */

export { isSupabaseConfigured };

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // الجلسة مطلوبة فقط داخل /admin، لكن حفظها يُبقي المالكة مسجّلة
        // بين الجلسات على الهاتف.
        storageKey: 'voutique:auth',
      },
    })
  : null;
