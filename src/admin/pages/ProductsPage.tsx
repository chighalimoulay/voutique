import { Eye, EyeOff, Pencil, Plus, RefreshCw, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductVisual } from '@/components/product/ProductVisual';
import { ButtonLink } from '@/components/ui/Button';
import { getCategoryName } from '@/data/categories';
import { useCatalog } from '@/store/useCatalog';
import { useToast } from '@/store/useToast';
import type { AdminProduct } from '@/types';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/format';
import { normalizeArabic } from '@/utils/search';
import { fetchAllProductsForAdmin, setProductPublished } from '../adminApi';

type Filter = 'all' | 'visible' | 'hidden' | 'unavailable';

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: 'all', label: 'الكل' },
  { value: 'visible', label: 'ظاهر' },
  { value: 'hidden', label: 'مخفي' },
  { value: 'unavailable', label: 'غير متوفر' },
];

function matchesFilter(product: AdminProduct, filter: Filter): boolean {
  switch (filter) {
    case 'visible':
      return product.published;
    case 'hidden':
      return !product.published;
    case 'unavailable':
      return !product.available;
    default:
      return true;
  }
}

export function ProductsPage() {
  const { refresh: refreshStore } = useCatalog();
  const { notify } = useToast();

  const [products, setProducts] = useState<AdminProduct[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(false);
    try {
      setProducts(await fetchAllProductsForAdmin());
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    if (!products) return [];
    const words = normalizeArabic(query).split(' ').filter(Boolean);

    return products.filter((product) => {
      if (!matchesFilter(product, filter)) return false;
      if (words.length === 0) return true;
      const haystack = normalizeArabic(
        `${product.name} ${product.brand ?? ''} ${product.slug} ${getCategoryName(product.category)}`,
      );
      return words.every((word) => haystack.includes(word));
    });
  }, [products, query, filter]);

  async function togglePublished(product: AdminProduct) {
    const next = !product.published;
    if (next && product.price <= 0) {
      notify('أدخلي سعر المنتج أولًا قبل إظهاره في المتجر.', 'error');
      return;
    }

    setBusyId(product.id);
    try {
      await setProductPublished(product.id, next);
      setProducts((list) =>
        list ? list.map((item) => (item.id === product.id ? { ...item, published: next } : item)) : list,
      );
      notify(next ? `«${product.name}» ظاهر الآن في المتجر.` : `تم إخفاء «${product.name}» من المتجر.`);
      void refreshStore();
    } catch (error) {
      notify(error instanceof Error ? error.message : 'تعذّر تعديل المنتج.', 'error');
    } finally {
      setBusyId(null);
    }
  }

  const hiddenCount = products?.filter((product) => !product.published).length ?? 0;

  return (
    <div className="pb-24">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">المنتجات</h1>
          {products && (
            <p className="mt-1 text-sm text-ink-muted">
              <span className="num">{products.length}</span> منتج
              {hiddenCount > 0 && (
                <>
                  {' '}
                  · <span className="num">{hiddenCount}</span> مخفي
                </>
              )}
            </p>
          )}
        </div>

        <ButtonLink to="/admin/products/new" className="hidden sm:inline-flex">
          <Plus className="h-4 w-4" aria-hidden="true" />
          إضافة منتج
        </ButtonLink>
      </div>

      <div className="relative">
        <Search
          className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ابحثي عن منتج…"
          aria-label="البحث في المنتجات"
          className="field-input ps-10"
        />
      </div>

      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {FILTERS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            aria-pressed={filter === option.value}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors',
              filter === option.value
                ? 'bg-mauve-500 text-white'
                : 'border border-mauve-200 bg-white text-ink-soft hover:border-mauve-400',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {loadError && (
          <div className="card-surface p-6 text-center">
            <p className="text-sm text-ink-soft">تعذّر تحميل المنتجات.</p>
            <button
              type="button"
              onClick={() => void load()}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-mauve-600"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              إعادة المحاولة
            </button>
          </div>
        )}

        {!loadError && !products && (
          <ul className="space-y-3" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className="skeleton h-24 w-full" />
            ))}
          </ul>
        )}

        {products && visible.length === 0 && (
          <p className="card-surface p-6 text-center text-sm text-ink-soft">لا توجد منتجات مطابقة.</p>
        )}

        {products && visible.length > 0 && (
          <ul className="space-y-3">
            {visible.map((product) => (
              <li
                key={product.id}
                className={cn('card-surface flex items-center gap-3 p-3', !product.published && 'opacity-75')}
              >
                <Link to={`/admin/products/${product.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <ProductVisual
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 shrink-0 rounded-xl"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-medium text-ink">{product.name}</span>
                    <span className="num mt-0.5 block text-sm font-semibold text-mauve-600">
                      {formatPrice(product.price)}
                    </span>
                    <span className="mt-1 flex flex-wrap gap-1.5">
                      {!product.published && (
                        <span className="rounded-full bg-ink/80 px-2 py-0.5 text-[11px] text-white">مخفي</span>
                      )}
                      {!product.available && (
                        <span className="rounded-full bg-mauve-100 px-2 py-0.5 text-[11px] text-ink-soft">
                          غير متوفر
                        </span>
                      )}
                      <span className="text-[11px] text-ink-muted">{getCategoryName(product.category)}</span>
                    </span>
                  </span>
                </Link>

                <div className="flex shrink-0 flex-col gap-1.5">
                  <Link
                    to={`/admin/products/${product.id}`}
                    aria-label={`تعديل ${product.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-mauve-200 text-ink-soft transition-colors hover:border-mauve-400 hover:text-ink"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => void togglePublished(product)}
                    disabled={busyId === product.id}
                    aria-label={product.published ? `إخفاء ${product.name}` : `إظهار ${product.name}`}
                    title={product.published ? 'إخفاء من المتجر' : 'إظهار في المتجر'}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-mauve-200 text-ink-soft transition-colors hover:border-mauve-400 hover:text-ink disabled:opacity-50"
                  >
                    {product.published ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* زر الإضافة ثابت أسفل الشاشة على الهاتف */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-mauve-100 bg-white/95 p-3 backdrop-blur sm:hidden">
        <ButtonLink to="/admin/products/new" size="lg" fullWidth>
          <Plus className="h-5 w-5" aria-hidden="true" />
          إضافة منتج
        </ButtonLink>
      </div>
    </div>
  );
}
