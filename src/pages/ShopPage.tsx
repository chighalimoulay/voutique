import { SlidersHorizontal, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Seo } from '@/components/Seo';
import { FilterPanel } from '@/components/shop/FilterPanel';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { products } from '@/data/products';
import type { ShopFilters, SortKey } from '@/types';
import { applyFilters, DEFAULT_FILTERS, SORT_OPTIONS } from '@/utils/search';

const SORT_VALUES = SORT_OPTIONS.map((option) => option.value);

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useBodyScrollLock(mobileFiltersOpen);

  // الحالة الأولية تأتي من عنوان الصفحة حتى تعمل الروابط المشتركة
  const [filters, setFilters] = useState<ShopFilters>(() => {
    const sortParam = searchParams.get('sort');
    return {
      ...DEFAULT_FILTERS,
      search: searchParams.get('search') ?? '',
      category: searchParams.get('category') ?? 'all',
      sort:
        sortParam && SORT_VALUES.includes(sortParam as SortKey)
          ? (sortParam as SortKey)
          : DEFAULT_FILTERS.sort,
    };
  });

  // مزامنة البحث القادم من شريط البحث في الهيدر
  useEffect(() => {
    const search = searchParams.get('search') ?? '';
    setFilters((previous) => (previous.search === search ? previous : { ...previous, search }));
  }, [searchParams]);

  const update = useCallback(
    (patch: Partial<ShopFilters>) => {
      setFilters((previous) => {
        const next = { ...previous, ...patch };

        const params = new URLSearchParams();
        if (next.search) params.set('search', next.search);
        if (next.category !== 'all') params.set('category', next.category);
        if (next.sort !== 'featured') params.set('sort', next.sort);
        setSearchParams(params, { replace: true });

        return next;
      });
    },
    [setSearchParams],
  );

  const reset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const results = useMemo(() => applyFilters(products, filters), [filters]);

  const activeCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.gender !== 'all' ? 1 : 0) +
    (filters.maxPrice !== null ? 1 : 0) +
    (filters.availableOnly ? 1 : 0) +
    (filters.onSaleOnly ? 1 : 0);

  return (
    <>
      <Seo
        title="المتجر"
        description="تصفّحي كل منتجات VOUTIQUE من العطور ومستحضرات التجميل ومنتجات العناية والهدايا."
      />

      <div className="surface-blush border-b border-mauve-100">
        <div className="container-page py-10 text-center sm:py-12">
          <h1 className="text-3xl font-bold sm:text-4xl">المتجر</h1>
          <p className="mt-3 text-sm text-ink-soft">
            {filters.search
              ? `نتائج البحث عن «${filters.search}»`
              : 'كل مختارات VOUTIQUE في مكان واحد.'}
          </p>
        </div>
      </div>

      <div className="container-page py-8">
        <div className="flex gap-8">
          {/* المرشّحات — عمود ثابت على الشاشات الكبيرة */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 card-surface p-5">
              <FilterPanel filters={filters} onChange={update} onReset={reset} />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {/* شريط الأدوات */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-soft">
                <span className="num font-semibold text-ink">{results.length}</span> منتج
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-mauve-200 px-4 py-2 text-sm text-ink transition-colors hover:border-mauve-400 lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                  تصفية
                  {activeCount > 0 && (
                    <span className="num flex h-5 min-w-5 items-center justify-center rounded-full bg-mauve-500 px-1.5 text-[11px] text-white">
                      {activeCount}
                    </span>
                  )}
                </button>

                <label className="sr-only" htmlFor="sort-select">
                  ترتيب المنتجات
                </label>
                <select
                  id="sort-select"
                  value={filters.sort}
                  onChange={(event) => update({ sort: event.target.value as SortKey })}
                  className="h-10 rounded-full border border-mauve-200 bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-mauve-400"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <ProductGrid products={results} />
          </div>
        </div>
      </div>

      {/* لوحة المرشّحات على الهاتف */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[75] lg:hidden" role="dialog" aria-modal="true" aria-label="تصفية النتائج">
          <div
            className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />

          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-cream p-5 shadow-lift">
            <div className="mb-4 flex items-center justify-between">
              <span className="h-1 w-12 rounded-full bg-mauve-200" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="إغلاق التصفية"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-mauve-50 hover:text-ink"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <FilterPanel filters={filters} onChange={update} onReset={reset} />

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full rounded-full bg-mauve-500 py-3 text-[15px] font-medium text-white transition-colors hover:bg-mauve-600"
            >
              عرض <span className="num">{results.length}</span> منتج
            </button>
          </div>
        </div>
      )}
    </>
  );
}

