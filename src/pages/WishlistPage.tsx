import { Heart, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { Seo } from '@/components/Seo';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/store/useToast';
import { useWishlist } from '@/store/useWishlist';

export default function WishlistPage() {
  const { products, count, clear } = useWishlist();
  const { notify } = useToast();
  const [confirmClear, setConfirmClear] = useState(false);

  if (count === 0) {
    return (
      <div className="container-page py-16 sm:py-20">
        <Seo title="المفضلة" noIndex />
        <EmptyState
          icon={Heart}
          title="لا توجد منتجات في المفضلة بعد 🌸"
          description="اضغطي على أيقونة القلب في أي منتج لحفظه هنا والعودة إليه لاحقًا."
          actionLabel="تصفّحي المنتجات"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <>
      <Seo title="المفضلة" noIndex />

      <div className="container-page py-8">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">المفضلة</h1>
            <p className="num mt-1.5 text-sm text-ink-soft">{count} منتج محفوظ</p>
          </div>

          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            إفراغ المفضلة
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={confirmClear}
        title="إفراغ المفضلة؟"
        description="سيتم حذف جميع المنتجات المحفوظة."
        confirmLabel="إفراغ"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          clear();
          setConfirmClear(false);
          notify('تم إفراغ المفضلة.', 'info');
        }}
      />
    </>
  );
}
