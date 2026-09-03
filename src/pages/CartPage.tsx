import { MessageCircle, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductVisual } from '@/components/product/ProductVisual';
import { Seo } from '@/components/Seo';
import { Button, ButtonLink } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { QuantityInput } from '@/components/ui/QuantityInput';
import { storeConfig } from '@/config/store';
import { getCategoryName } from '@/data/categories';
import { useCart } from '@/store/useCart';
import { useToast } from '@/store/useToast';
import { formatPrice } from '@/utils/format';
import { createCartOrderMessage, openWhatsApp } from '@/utils/whatsapp';

export default function CartPage() {
  const { resolvedItems, totalPrice, totalQuantity, updateQuantity, removeItem, clearCart } =
    useCart();
  const { notify } = useToast();

  const [pendingRemoval, setPendingRemoval] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  function sendOrder() {
    if (resolvedItems.length === 0) return;

    const message = createCartOrderMessage(resolvedItems, totalPrice);
    const result = openWhatsApp(message);

    if (!result.ok) {
      notify(result.error, 'error');
      return;
    }

    notify('تم تجهيز طلبك في واتساب.', 'success');
  }

  if (resolvedItems.length === 0) {
    return (
      <div className="container-page py-16 sm:py-20">
        <Seo title="سلة التسوق" noIndex />
        <EmptyState
          icon={ShoppingBag}
          title="سلتك فارغة حاليًا 🌸"
          description="أضيفي منتجاتك المفضلة ثم أرسلي الطلب عبر واتساب بضغطة واحدة."
          actionLabel="تصفّحي المنتجات"
          actionTo="/shop"
        />
      </div>
    );
  }

  const freeShippingLeft =
    storeConfig.freeShippingFrom !== null && totalPrice < storeConfig.freeShippingFrom
      ? storeConfig.freeShippingFrom - totalPrice
      : 0;

  return (
    <>
      <Seo title="سلة التسوق" noIndex />

      <div className="container-page py-8 pb-28 lg:pb-8">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">سلة التسوق</h1>
            <p className="num mt-1.5 text-sm text-ink-soft">{totalQuantity} منتج في السلة</p>
          </div>

          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            إفراغ السلة
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {/* الأسطر */}
          <ul className="space-y-3 lg:col-span-2">
            {resolvedItems.map((item) => (
              <li
                key={item.key}
                className="flex gap-3 rounded-2xl border border-mauve-100 bg-white p-3 shadow-soft sm:gap-4 sm:p-4"
              >
                <Link
                  to={`/product/${item.product.slug}`}
                  className="shrink-0"
                  aria-label={`عرض ${item.product.name}`}
                >
                  <ProductVisual
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-24 w-24 rounded-xl sm:h-28 sm:w-28"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] text-mauve-500">
                        {getCategoryName(item.product.category)}
                      </p>
                      <h2 className="mt-0.5 line-clamp-2 text-[15px] font-semibold leading-6">
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="transition-colors hover:text-mauve-600"
                        >
                          {item.product.name}
                        </Link>
                      </h2>

                      {Object.entries(item.selectedOptions).length > 0 && (
                        <p className="mt-1 text-xs text-ink-muted">
                          {Object.entries(item.selectedOptions)
                            .map(([label, value]) => `${label}: ${value}`)
                            .join(' • ')}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setPendingRemoval(item.key)}
                      aria-label={`حذف ${item.product.name} من السلة`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                    <QuantityInput
                      value={item.quantity}
                      onChange={(value) => updateQuantity(item.key, value)}
                      size="sm"
                    />

                    <div className="text-left">
                      <span className="num block text-base font-bold text-mauve-600">
                        {formatPrice(item.lineTotal)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="num block text-[11px] text-ink-muted">
                          {formatPrice(item.product.price)} × {item.quantity}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* الملخّص */}
          <aside className="lg:col-span-1">
            <div className="card-surface sticky top-24 p-5">
              <h2 className="text-base font-semibold">ملخّص الطلب</h2>

              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">عدد المنتجات</dt>
                  <dd className="num font-medium">{totalQuantity}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">المجموع</dt>
                  <dd className="num font-medium">{formatPrice(totalPrice)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">الشحن</dt>
                  <dd className="text-xs text-ink-muted">يُحدَّد عند التأكيد</dd>
                </div>
              </dl>

              <div className="mt-4 flex items-baseline justify-between border-t border-mauve-100 pt-4">
                <span className="font-semibold">الإجمالي</span>
                <span className="num text-xl font-bold text-mauve-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {freeShippingLeft > 0 && (
                <p className="mt-3 rounded-xl bg-gold/10 px-3 py-2.5 text-xs leading-6 text-gold-dark">
                  أضيفي <span className="num font-semibold">{formatPrice(freeShippingLeft)}</span>{' '}
                  للحصول على شحن مجاني.
                </p>
              )}

              <Button variant="whatsapp" size="lg" fullWidth className="mt-5" onClick={sendOrder}>
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                إرسال الطلب عبر واتساب
              </Button>

              <ButtonLink to="/shop" variant="ghost" fullWidth className="mt-2">
                متابعة التسوّق
              </ButtonLink>

              <p className="mt-4 text-center text-xs leading-6 text-ink-muted">
                سيتم فتح واتساب برسالة جاهزة تحتوي على تفاصيل طلبك، وتُكمل تفاصيل التوصيل والدفع
                معنا مباشرة.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* شريط سفلي ثابت على الهاتف */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-mauve-100 bg-cream/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <span className="block text-[11px] text-ink-muted">الإجمالي</span>
            <span className="num block text-base font-bold text-mauve-600">
              {formatPrice(totalPrice)}
            </span>
          </div>

          <Button variant="whatsapp" fullWidth onClick={sendOrder}>
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            إرسال الطلب
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={pendingRemoval !== null}
        title="حذف المنتج من السلة؟"
        description="يمكنك إضافته مرة أخرى في أي وقت."
        confirmLabel="حذف"
        onCancel={() => setPendingRemoval(null)}
        onConfirm={() => {
          if (pendingRemoval) {
            removeItem(pendingRemoval);
            notify('تم حذف المنتج من السلة.', 'info');
          }
          setPendingRemoval(null);
        }}
      />

      <ConfirmDialog
        open={confirmClear}
        title="إفراغ السلة بالكامل؟"
        description="سيتم حذف جميع المنتجات من سلتك."
        confirmLabel="إفراغ السلة"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          clearCart();
          setConfirmClear(false);
          notify('تم إفراغ السلة.', 'info');
        }}
      />
    </>
  );
}
