import { SearchX } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Product } from '@/types';
import { cn } from '@/utils/cn';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  className?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ProductGrid({
  products,
  className,
  emptyTitle = 'لم نجد منتجات مطابقة لبحثك.',
  emptyDescription = 'جرّبي تعديل الفلاتر أو البحث بكلمة أخرى.',
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel="تصفّحي كل المنتجات"
        actionTo="/shop"
      />
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 4} />
      ))}
    </div>
  );
}
