import { useState, type ImgHTMLAttributes } from 'react';
import { useSiteImage } from '@/store/useSiteImages';
import { cn } from '@/utils/cn';

interface SiteImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /** مفتاح الصورة في site_images (مثل hero أو category:care). */
  imageKey: string;
  /** الصورة الأصلية من public/images — تُعرض إن لم توجد صورة مخصّصة. */
  fallback: string;
  /** للصورة الأولى في الصفحة: تحميل بأولوية عالية. */
  priority?: boolean;
}

/**
 * صورة من «صور المتجر»: نفس وسم <img> بنفس الأصناف تمامًا،
 * فلا يتغيّر الإطار ولا التصميم — فقط مصدر الصورة.
 */
export function SiteImage({ imageKey, fallback, priority, className, onError, ...rest }: SiteImageProps) {
  const { src, ready } = useSiteImage(imageKey, fallback);
  // رابط مخصّص تعذّر تحميله (حُذف مثلًا) ← نعود إلى الصورة الأصلية
  const [brokenSrc, setBrokenSrc] = useState<string | null>(null);

  if (!ready) {
    // أول زيارة فقط: إطار بنفس المقاس ريثما يصل الرد (حد أقصى 5 ثوانٍ)
    return <div className={cn('skeleton', className)} aria-hidden="true" />;
  }

  const finalSrc = brokenSrc === src ? fallback : src;

  return (
    <img
      {...rest}
      src={finalSrc}
      className={className}
      // React 18 لا يعرف الخاصية بصيغة camelCase، لذا نمرّرها بالاسم الفعلي في HTML
      {...(priority ? { fetchpriority: 'high' } : {})}
      onError={(event) => {
        if (src !== fallback) setBrokenSrc(src);
        onError?.(event);
      }}
    />
  );
}
