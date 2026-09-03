import { Gift, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import { storeConfig } from '@/config/store';
import { formatPrice } from '@/utils/format';

const FEATURES = [
  {
    icon: MessageCircle,
    title: 'طلب عبر واتساب',
    description: 'اختاري منتجك وأرسلي الطلب بضغطة واحدة.',
  },
  {
    icon: Truck,
    title: 'توصيل داخل موريتانيا',
    description: storeConfig.freeShippingFrom
      ? `شحن مجاني للطلبات فوق ${formatPrice(storeConfig.freeShippingFrom)}.`
      : 'نوصل طلبك إلى باب المنزل.',
  },
  {
    icon: ShieldCheck,
    title: 'منتجات مختارة',
    description: 'نختار كل منتج بعناية قبل عرضه.',
  },
  {
    icon: Gift,
    title: 'تغليف هدايا',
    description: 'خدمة تغليف أنيقة لكل المناسبات.',
  },
];

export function FeatureStrip() {
  return (
    <section className="border-y border-mauve-100 bg-white" aria-label="مزايا المتجر">
      <div className="container-page grid grid-cols-2 gap-x-4 gap-y-6 py-8 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mauve-50 text-mauve-600">
              <feature.icon className="h-5 w-5" aria-hidden="true" />
            </span>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-ink">{feature.title}</h3>
              <p className="mt-0.5 text-xs leading-5 text-ink-soft">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
