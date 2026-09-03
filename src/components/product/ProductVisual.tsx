import { useState } from 'react';
import { PLACEHOLDER_IMAGE } from '@/data/products';
import { cn } from '@/utils/cn';

interface ProductVisualProps {
  src: string;
  alt: string;
  /** نسبة العرض إلى الارتفاع للإطار. */
  ratio?: 'square' | 'portrait';
  /** حركة تقريب خفيفة عند مرور المؤشر. */
  hoverZoom?: boolean;
  /** الصورة الأولى في الصفحة تُحمَّل فورًا، والباقي كسولًا. */
  priority?: boolean;
  className?: string;
  /**
   * طبقة إضافية تُرسم فوق الصورة.
   * نقطة التوسعة المستقبلية: يمكن تمرير <Canvas> من React Three Fiber هنا
   * أو استبدال <img> بها دون تغيير أي صفحة تستخدم هذا المكوّن.
   */
  overlay?: React.ReactNode;
}

/**
 * الطبقة الوحيدة المسؤولة عن عرض «مرئي المنتج».
 *
 * كل الصفحات تستدعي هذا المكوّن ولا تستدعي <img> مباشرة، حتى نستطيع لاحقًا
 * إضافة عارض ثلاثي الأبعاد أو 360° بتعديل هذا الملف وحده.
 */
export function ProductVisual({
  src,
  alt,
  ratio = 'square',
  hoverZoom = false,
  priority = false,
  className,
  overlay,
}: ProductVisualProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const source = failed || !src ? PLACEHOLDER_IMAGE : src;

  return (
    <div
      className={cn(
        'group/visual relative overflow-hidden bg-gradient-to-br from-cream to-mauve-50',
        ratio === 'square' ? 'aspect-square' : 'aspect-[4/5]',
        className,
      )}
    >
      {/* هيكل تحميل يمنع «قفزة» التخطيط ريثما تصل الصورة */}
      {!loaded && <div className="skeleton absolute inset-0" aria-hidden="true" />}

      <img
        src={source}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        // React 18 لا يعرف الخاصية بصيغة camelCase، لذا نمرّرها بالاسم الفعلي في HTML
        {...(priority ? { fetchpriority: 'high' } : {})}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setFailed(true);
          setLoaded(true);
        }}
        className={cn(
          'h-full w-full object-cover transition-all duration-700 ease-silk',
          loaded ? 'opacity-100' : 'opacity-0',
          hoverZoom && 'group-hover:scale-[1.06]',
        )}
      />

      {overlay}
    </div>
  );
}
