import type { Product } from '@/types';
import { hasRealPhoto, photosFirst } from './products';

/**
 * ══════════════════════════════════════════════════════════════════
 *  الكتالوج — كل استعلامات المنتجات في مكان واحد.
 *
 *  دوال نقية تعمل على أي قائمة منتجات: الحية من Supabase، أو الاحتياطية
 *  من src/data/products.ts. المكوّنات لا تستدعيها مباشرة، بل عبر
 *  useCatalog() التي تربطها بالقائمة الحالية.
 * ══════════════════════════════════════════════════════════════════
 */
export interface Catalog {
  products: Product[];
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  getByCategory: (categorySlug: string) => Product[];
  getFeaturedProducts: (limit?: number) => Product[];
  getBestSellers: (limit?: number) => Product[];
  getNewArrivals: (limit?: number) => Product[];
  getRelatedProducts: (product: Product, limit?: number) => Product[];
  /** أعلى سعر في الكتالوج — يُستخدم لضبط مرشّح السعر. */
  maxPrice: number;
  brands: string[];
}

export function createCatalog(list: Product[]): Catalog {
  const bySlug = new Map(list.map((product) => [product.slug, product]));
  const byId = new Map(list.map((product) => [product.id, product]));

  /**
   * الأقسام المُنسَّقة على الصفحة الرئيسية (مختارة لكِ، الأكثر مبيعًا، وصلنا حديثًا)
   * تستبعد صور placeholder التوضيحية تمامًا بدل تأخيرها في الترتيب، حتى لا يظهر
   * أي رسم SVG بينما توجد صور حقيقية كافية للملء.
   */
  const pick = (predicate: (product: Product) => boolean, limit: number) =>
    list.filter((product) => predicate(product) && hasRealPhoto(product)).slice(0, limit);

  return {
    products: list,
    getProductBySlug: (slug) => bySlug.get(slug),
    getProductById: (id) => byId.get(id),
    getByCategory: (categorySlug) =>
      photosFirst(list.filter((product) => product.category === categorySlug)),
    getFeaturedProducts: (limit = 8) => pick((product) => Boolean(product.featured), limit),
    getBestSellers: (limit = 8) => pick((product) => Boolean(product.bestSeller), limit),
    getNewArrivals: (limit = 8) => pick((product) => product.badge === 'new', limit),
    getRelatedProducts: (product, limit = 4) =>
      photosFirst(
        list.filter((item) => item.category === product.category && item.id !== product.id),
      ).slice(0, limit),
    maxPrice: list.reduce((max, product) => Math.max(max, product.price), 0),
    brands: [...new Set(list.map((product) => product.brand).filter(Boolean))] as string[],
  };
}
