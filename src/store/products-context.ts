import { createContext } from 'react';
import type { Catalog } from '@/data/catalog';

/**
 * مصدر قائمة المنتجات المعروضة حاليًا:
 *  - live:   من Supabase (الحالة الطبيعية).
 *  - cache:  آخر نسخة حية محفوظة على الجهاز (ريثما تصل الجديدة، أو عند انقطاع الاتصال).
 *  - static: النسخة الاحتياطية من src/data/products.ts.
 */
export type CatalogSource = 'live' | 'cache' | 'static';

export interface ProductsContextValue extends Catalog {
  source: CatalogSource;
  /** true أثناء جلب المنتجات من Supabase. */
  loading: boolean;
  /** يعيد جلب المنتجات — تستدعيه لوحة الإدارة بعد كل حفظ. */
  refresh: () => Promise<void>;
}

export const ProductsContext = createContext<ProductsContextValue | null>(null);
