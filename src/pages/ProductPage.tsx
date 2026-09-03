import { ChevronLeft, Heart, MessageCircle, Share2, ShoppingBag } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductShowcase } from '@/components/home/ProductShowcase';
import { Seo } from '@/components/Seo';
import { Badge, DiscountBadge, StockBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { QuantityInput } from '@/components/ui/QuantityInput';
import { storeConfig } from '@/config/store';
import { getCategoryName } from '@/data/categories';
import { getProductBySlug, getRelatedProducts } from '@/data/products';
import { useCart } from '@/store/useCart';
import { useToast } from '@/store/useToast';
import { useWishlist } from '@/store/useWishlist';
import { cn } from '@/utils/cn';
import { discountPercent, formatPrice } from '@/utils/format';
import { createProductOrderMessage, openWhatsApp } from '@/utils/whatsapp';

export default function ProductPage() {
  const { slug = '' } = useParams();
  const product = getProductBySlug(slug);

  const { addItem } = useCart();
  const { isFavorite, toggle } = useWishlist();
  const { notify } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const option of product?.options ?? []) {
      if (option.values[0]) initial[option.label] = option.values[0];
    }
    return initial;
  });

  const related = useMemo(
    () => (product ? getRelatedProducts(product, 4) : []),
    [product],
  );

  if (!product) {
    return (
      <div className="container-page py-20">
        <Seo title="المنتج غير موجود" noIndex />
        <EmptyState
          title="هذا المنتج غير موجود."
          description="ربما تغيّر الرابط أو لم يعد المنتج متاحًا في المتجر."
          actionLabel="تصفّحي كل المنتجات"
          actionTo="/shop"
        />
      </div>
    );
  }

  const discount = discountPercent(product.price, product.oldPrice);
  const favorite = isFavorite(product.id);
  const total = product.price * quantity;
  const gallery = product.images && product.images.length > 0 ? product.images : [product.image];

  function selectOption(label: string, value: string) {
    setSelectedOptions((previous) => ({ ...previous, [label]: value }));
  }

  function handleAddToCart() {
    if (!product || !product.available) return;

    addItem(product, quantity, selectedOptions);
    notify(`تمت إضافة «${product.name}» إلى السلة.`);
  }

  function handleWhatsappOrder() {
    if (!product || !product.available) return;

    const message = createProductOrderMessage(product, quantity, selectedOptions);
    const result = openWhatsApp(message);
    if (!result.ok) notify(result.error, 'error');
  }

  async function handleShare() {
    if (!product) return;

    const url = window.location.href;

    // مشاركة نظام التشغيل إن كانت متاحة، وإلا ننسخ الرابط
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: product.shortDescription, url });
        return;
      } catch {
        // ألغت المستخدمة المشاركة — لا حاجة لرسالة
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      notify('تم نسخ رابط المنتج.', 'info');
    } catch {
      notify('تعذّر نسخ الرابط. يمكنك نسخه من شريط العنوان.', 'error');
    }
  }

  return (
    <>
      <Seo
        title={product.name}
        description={product.shortDescription}
        image={product.image}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.image,
          brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
          category: getCategoryName(product.category),
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: storeConfig.currency,
            availability: product.available
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          },
        }}
      />

      <div className="container-page py-6 sm:py-8">
        {/* مسار التصفّح */}
        <nav aria-label="مسار التصفّح" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
            <li>
              <Link to="/" className="transition-colors hover:text-mauve-600">
                الرئيسية
              </Link>
            </li>
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <li>
              <Link
                to={`/category/${product.category}`}
                className="transition-colors hover:text-mauve-600"
              >
                {getCategoryName(product.category)}
              </Link>
            </li>
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <li className="font-medium text-ink" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* المرئي */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={gallery} alt={product.name} />
          </div>

          {/* التفاصيل */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {product.badge && <Badge kind={product.badge} />}
              {discount !== null && <DiscountBadge percent={discount} />}
              <StockBadge available={product.available} />
            </div>

            <h1 className="mt-4 text-2xl font-bold leading-relaxed sm:text-3xl">{product.name}</h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
              {product.brand && <span>{product.brand}</span>}
              <Link
                to={`/category/${product.category}`}
                className="transition-colors hover:text-mauve-600"
              >
                {getCategoryName(product.category)}
              </Link>
              {product.size && <span>{product.size}</span>}
            </div>

            <p className="mt-4 text-[15px] leading-8 text-ink-soft">{product.shortDescription}</p>

            {/* السعر */}
            <div className="mt-6 flex flex-wrap items-baseline gap-3 rounded-2xl bg-mauve-50 px-5 py-4">
              <span className="num text-3xl font-bold text-mauve-600">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="num text-base text-ink-muted line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            {/* الخيارات */}
            {product.options?.map((option) => (
              <fieldset key={option.label} className="mt-6">
                <legend className="field-label">
                  {option.label}:{' '}
                  <span className="font-semibold text-ink">{selectedOptions[option.label]}</span>
                </legend>

                <div className="mt-2 flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const active = selectedOptions[option.label] === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => selectOption(option.label, value)}
                        aria-pressed={active}
                        className={cn(
                          'rounded-full border px-4 py-2 text-sm transition-all duration-300',
                          active
                            ? 'border-mauve-500 bg-mauve-500 text-white shadow-soft'
                            : 'border-mauve-200 bg-white text-ink-soft hover:border-mauve-400 hover:text-ink',
                        )}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            {/* الكمية والإجمالي */}
            {product.available && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-mauve-100 bg-white px-5 py-4">
                <div>
                  <span className="field-label mb-2">الكمية</span>
                  <QuantityInput value={quantity} onChange={setQuantity} />
                </div>

                <div className="text-left">
                  <span className="block text-xs text-ink-muted">الإجمالي</span>
                  <span className="num block text-xl font-bold text-mauve-600">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            )}

            {/* الإجراءات */}
            <div className="mt-6 space-y-3">
              <Button
                variant="whatsapp"
                size="lg"
                fullWidth
                onClick={handleWhatsappOrder}
                disabled={!product.available}
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                اطلبي عبر واتساب
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  disabled={!product.available}
                >
                  <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                  أضيفي إلى السلة
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    toggle(product.id);
                    notify(
                      favorite ? 'أُزيل المنتج من المفضلة.' : 'أُضيف المنتج إلى المفضلة.',
                      'info',
                    );
                  }}
                  aria-label={favorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                  aria-pressed={favorite}
                  className={cn('px-5', favorite && 'border-red-200 text-red-500')}
                >
                  <Heart className={cn('h-5 w-5', favorite && 'fill-current')} aria-hidden="true" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShare}
                  aria-label="مشاركة المنتج"
                  className="px-5"
                >
                  <Share2 className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>
            </div>

            {!product.available && (
              <p className="mt-4 rounded-xl bg-cream-dark px-4 py-3 text-sm text-ink-soft">
                هذا المنتج غير متوفر حاليًا. يمكنك التواصل معنا عبر واتساب للسؤال عن موعد توفره.
              </p>
            )}

            {/* الوصف والمكونات */}
            <div className="mt-8 space-y-6 border-t border-mauve-100 pt-6">
              <section>
                <h2 className="text-base font-semibold">الوصف</h2>
                <p className="mt-2 text-[15px] leading-8 text-ink-soft">{product.description}</p>
              </section>

              {product.ingredients && (
                <section>
                  <h2 className="text-base font-semibold">المكونات</h2>
                  <p className="mt-2 text-[15px] leading-8 text-ink-soft">{product.ingredients}</p>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="border-t border-mauve-100 bg-white">
          <ProductShowcase title="قد يعجبك أيضًا" products={related} />
        </div>
      )}
    </>
  );
}
