import { ChevronLeft } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Seo } from '@/components/Seo';
import { FilterPanel } from '@/components/shop/FilterPanel';
import { EmptyState } from '@/components/ui/EmptyState';
import { getCategory } from '@/data/categories';
import { getByCategory } from '@/data/products';
import type { ShopFilters, SortKey } from '@/types';
import { applyFilters, DEFAULT_FILTERS, SORT_OPTIONS } from '@/utils/search';

export default function CategoryPage() {
  const { slug = '' } = useParams();
  const category = getCategory(slug);

  const [filters, setFilters] = useState<ShopFilters>({
    ...DEFAULT_FILTERS,
    category: slug,
  });

  const update = useCallback((patch: Partial<ShopFilters>) => {
    setFilters((previous) => ({ ...previous, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS, category: slug });
  }, [slug]);

  const categoryProducts = useMemo(() => getByCategory(slug), [slug]);
  const results = useMemo(
    () => applyFilters(categoryProducts, { ...filters, category: 'all' }),
    [categoryProducts, filters],
  );

  if (!category) {
    return (
      <div className="container-page py-20">
        <Seo title="التصنيف غير موجود" noIndex />
        <EmptyState
          title="هذا التصنيف غير موجود."
          description="ربما تغيّر الرابط أو حُذف التصنيف."
          actionLabel="العودة إلى المتجر"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <>
      <Seo
        title={category.name}
        description={category.description}
        image={category.image}
      />

      {/* رأس التصنيف */}
      <div className="surface-blush border-b border-mauve-100">
        <div className="container-page py-10 sm:py-12">
          <nav aria-label="مسار التصفّح" className="mb-4">
            <ol className="flex items-center gap-1.5 text-xs text-ink-muted">
              <li>
                <Link to="/" className="transition-colors hover:text-mauve-600">
                  الرئيسية
                </Link>
              </li>
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <li>
                <Link to="/shop" className="transition-colors hover:text-mauve-600">
                  المتجر
                </Link>
              </li>
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <li className="font-medium text-ink" aria-current="page">
                {category.name}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <img
              src={category.image}
              alt={category.name}
              loading="eager"
              className="h-24 w-24 rounded-2xl object-cover shadow-soft sm:h-28 sm:w-28"
            />

            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">{category.name}</h1>
              <p className="mt-2.5 max-w-xl text-sm leading-7 text-ink-soft">
                {category.description}
              </p>
              <p className="num mt-2 text-xs text-ink-muted">
                {categoryProducts.length} منتج في هذا القسم
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-8">
        <div className="flex gap-8">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 card-surface p-5">
              <FilterPanel filters={filters} onChange={update} onReset={reset} hideCategory />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-soft">
                <span className="num font-semibold text-ink">{results.length}</span> منتج
              </p>

              <div>
                <label className="sr-only" htmlFor="category-sort">
                  ترتيب المنتجات
                </label>
                <select
                  id="category-sort"
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

            <ProductGrid
              products={results}
              emptyTitle="لا توجد منتجات في هذا التصنيف حاليًا."
              emptyDescription="جرّبي تعديل الفلاتر أو تصفّحي بقية الأقسام."
            />
          </div>
        </div>
      </div>
    </>
  );
}
