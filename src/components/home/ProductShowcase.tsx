import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/types';
import { cn } from '@/utils/cn';

interface ProductShowcaseProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllTo?: string;
  /** شبكة عادية أو شريط أفقي قابل للسحب على الهاتف. */
  layout?: 'grid' | 'carousel';
  className?: string;
}

/**
 * قسم عرض منتجات قابل لإعادة الاستخدام في كل الصفحات.
 * كل بطاقة تمرّ عبر ProductCard → ProductVisual، فأي ترقية بصرية
 * (بما فيها 3D لاحقًا) تنطبق على كل الأقسام تلقائيًا.
 */
export function ProductShowcase({
  title,
  subtitle,
  products,
  viewAllTo,
  layout = 'grid',
  className,
}: ProductShowcaseProps) {
  if (products.length === 0) return null;

  return (
    <section className={cn('container-page py-12 sm:py-14', className)}>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="mt-3 text-sm text-ink-soft">{subtitle}</p>}
        </div>

        {viewAllTo && (
          <Link
            to={viewAllTo}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-mauve-600 transition-colors hover:text-mauve-700"
          >
            عرض الكل
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden="true"
            />
          </Link>
        )}
      </div>

      {layout === 'carousel' ? (
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="w-[62%] shrink-0 snap-start sm:w-[42%] md:w-[32%] lg:w-auto"
            >
              <ProductCard product={product} priority={index < 2} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      )}
    </section>
  );
}
