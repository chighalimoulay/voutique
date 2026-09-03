import { Heart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, DiscountBadge } from '@/components/ui/Badge';
import { getCategoryName } from '@/data/categories';
import { useCart } from '@/store/useCart';
import { useToast } from '@/store/useToast';
import { useWishlist } from '@/store/useWishlist';
import type { Product } from '@/types';
import { cn } from '@/utils/cn';
import { discountPercent, formatPrice } from '@/utils/format';
import { createProductOrderMessage, openWhatsApp } from '@/utils/whatsapp';
import { ProductVisual } from './ProductVisual';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart();
  const { isFavorite, toggle } = useWishlist();
  const { notify } = useToast();

  const discount = discountPercent(product.price, product.oldPrice);
  const favorite = isFavorite(product.id);

  /**
   * الطلب السريع من البطاقة: كمية 1 وبلا خيارات.
   * المنتجات ذات الخيارات تُفتح صفحتها ليختار العميل قبل الطلب.
   */
  function handleWhatsappOrder() {
    if (!product.available) return;

    if (product.options && product.options.length > 0) {
      notify('يرجى اختيار الخيارات من صفحة المنتج أولًا.', 'info');
      return;
    }

    const result = openWhatsApp(createProductOrderMessage(product, 1));
    if (!result.ok) notify(result.error, 'error');
  }

  function handleAddToCart() {
    if (!product.available) return;

    if (product.options && product.options.length > 0) {
      notify('هذا المنتج يحتاج اختيار الخيارات من صفحته.', 'info');
      return;
    }

    addItem(product, 1);
    notify(`تمت إضافة «${product.name}» إلى السلة.`);
  }

  function handleToggleFavorite() {
    toggle(product.id);
    notify(favorite ? 'أُزيل المنتج من المفضلة.' : 'أُضيف المنتج إلى المفضلة.', 'info');
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-mauve-100 bg-white shadow-soft transition-all duration-500 ease-silk hover:-translate-y-1 hover:shadow-lift">
      <div className="relative">
        <Link
          to={`/product/${product.slug}`}
          aria-label={`عرض تفاصيل ${product.name}`}
          className="block"
        >
          <ProductVisual
            src={product.image}
            alt={product.name}
            ratio="square"
            hoverZoom
            priority={priority}
            overlay={
              !product.available ? (
                <div className="absolute inset-0 flex items-center justify-center bg-cream/75 backdrop-blur-[2px]">
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink-soft shadow-soft">
                    غير متوفر حاليًا
                  </span>
                </div>
              ) : null
            }
          />
        </Link>

        {/* الشارات */}
        <div className="pointer-events-none absolute right-3 top-3 flex flex-col items-start gap-1.5">
          {product.badge && <Badge kind={product.badge} />}
          {discount !== null && <DiscountBadge percent={discount} />}
        </div>

        {/* المفضلة */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={favorite ? `إزالة ${product.name} من المفضلة` : `إضافة ${product.name} إلى المفضلة`}
          aria-pressed={favorite}
          className={cn(
            'absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full',
            'bg-white/90 shadow-soft backdrop-blur transition-all duration-300',
            'hover:scale-110 hover:bg-white',
            favorite ? 'text-red-500' : 'text-ink-muted',
          )}
        >
          <Heart className={cn('h-4 w-4', favorite && 'fill-current')} aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-mauve-500">
          {getCategoryName(product.category)}
        </p>

        <h3 className="mt-1.5 line-clamp-2 text-[15px] font-semibold leading-6 text-ink">
          <Link to={`/product/${product.slug}`} className="hover:text-mauve-600">
            {product.name}
          </Link>
        </h3>

        {product.brand && <p className="mt-1 text-xs text-ink-muted">{product.brand}</p>}

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="num text-lg font-bold text-mauve-600">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="num text-sm text-ink-muted line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2 pt-1 sm:mt-auto">
          <Link
            to={`/product/${product.slug}`}
            className="inline-flex h-10 items-center justify-center rounded-full border border-mauve-300 text-sm font-medium text-ink transition-colors hover:border-mauve-500 hover:bg-mauve-50"
          >
            عرض المنتج
          </Link>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.available}
              className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-mauve-500 text-sm font-medium text-white transition-colors hover:bg-mauve-600 disabled:cursor-not-allowed disabled:opacity-45"
            >
              أضيفي للسلة
            </button>

            <button
              type="button"
              onClick={handleWhatsappOrder}
              disabled={!product.available}
              aria-label={`اطلبي ${product.name} عبر واتساب`}
              title="اطلبي عبر واتساب"
              className="inline-flex h-10 w-11 items-center justify-center rounded-full bg-[#1FA855] text-white transition-colors hover:bg-[#178F47] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
