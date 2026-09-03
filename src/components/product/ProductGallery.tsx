import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { ProductVisual } from './ProductVisual';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

/**
 * معرض صور المنتج.
 * يستخدم ProductVisual لكل صورة، لذا سيرث تلقائيًا أي دعم ثلاثي الأبعاد نضيفه لاحقًا.
 */
export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const gallery = images.length > 0 ? images : [''];
  const [active, setActive] = useState(0);

  // إعادة الضبط عند الانتقال إلى منتج آخر
  useEffect(() => {
    setActive(0);
  }, [images]);

  const current = gallery[Math.min(active, gallery.length - 1)];

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-3xl border border-mauve-100 bg-white shadow-soft">
        <ProductVisual src={current} alt={alt} ratio="square" priority />
      </div>

      {gallery.length > 1 && (
        <div
          className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1"
          role="tablist"
          aria-label="صور المنتج"
        >
          {gallery.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`${alt} — صورة ${index + 1}`}
              onClick={() => setActive(index)}
              className={cn(
                'h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300',
                index === active
                  ? 'border-mauve-500 shadow-soft'
                  : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <ProductVisual src={image} alt="" ratio="square" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
