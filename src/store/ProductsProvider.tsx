import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createCatalog } from '@/data/catalog';
import { products as fallbackProducts } from '@/data/products';
import { isSupabaseConfigured } from '@/lib/supabaseConfig';
import type { Product } from '@/types';
import { ProductsContext, type CatalogSource, type ProductsContextValue } from './products-context';

const CACHE_KEY = 'voutique:catalog:v1';
/** عند عودة الزائرة إلى التبويب بعد هذه المدة نجلب أحدث المنتجات. */
const REFRESH_ON_FOCUS_AFTER_MS = 60_000;

/** يتحقق من شكل النسخة المحفوظة قبل الوثوق بها. */
function isProductArray(value: unknown): value is Product[] {
  return (
    Array.isArray(value) &&
    value.every((entry) => {
      if (typeof entry !== 'object' || entry === null) return false;
      const product = entry as Record<string, unknown>;
      return (
        typeof product.id === 'string' &&
        typeof product.slug === 'string' &&
        typeof product.name === 'string' &&
        typeof product.price === 'number' &&
        typeof product.image === 'string'
      );
    })
  );
}

function readCache(): Product[] | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isProductArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(list: Product[]) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(list));
  } catch {
    // التخزين ممتلئ أو معطّل — النسخة الحية تبقى في الذاكرة
  }
}

interface CatalogState {
  products: Product[];
  source: CatalogSource;
}

function initialState(): CatalogState {
  if (isSupabaseConfigured) {
    const cached = readCache();
    if (cached) return { products: cached, source: 'cache' };
  }
  return { products: fallbackProducts, source: 'static' };
}

/**
 * يوفّر قائمة المنتجات لكل المتجر.
 *
 * يعرض فورًا آخر نسخة معروفة (المحفوظة على الجهاز، أو products.ts)
 * حتى لا تنتظر الصفحة الشبكة، ثم يستبدلها بالنسخة الحية من Supabase.
 * إن فشل الاتصال تبقى النسخة المعروضة كما هي — المتجر لا ينكسر أبدًا.
 */
export function ProductsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CatalogState>(initialState);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const lastFetchedAt = useRef(0);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) return;

    setLoading(true);
    try {
      // تحميل ديناميكي: مكتبة Supabase لا تدخل الحزمة الأولى للصفحة
      const { fetchPublishedProducts } = await import('@/services/productsApi');
      const live = await fetchPublishedProducts();

      lastFetchedAt.current = Date.now();
      setState({ products: live, source: 'live' });
      writeCache(live);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('[catalog] تعذّر جلب المنتجات من Supabase — نعرض النسخة الاحتياطية.', error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();

    function onVisibilityChange() {
      if (
        document.visibilityState === 'visible' &&
        Date.now() - lastFetchedAt.current > REFRESH_ON_FOCUS_AFTER_MS
      ) {
        void refresh();
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [refresh]);

  const catalog = useMemo(() => createCatalog(state.products), [state.products]);

  const value = useMemo<ProductsContextValue>(
    () => ({ ...catalog, source: state.source, loading, refresh }),
    [catalog, state.source, loading, refresh],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}
