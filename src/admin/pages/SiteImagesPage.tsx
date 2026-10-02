import { useEffect } from 'react';
import { DEFAULT_HERO_IMAGE, HERO_IMAGE_KEY, categoryImageKey } from '@/config/siteImages';
import { categories } from '@/data/categories';
import { useSiteImages } from '@/store/useSiteImages';
import { SiteImageEditor } from '../components/SiteImageEditor';

/**
 * «صور المتجر»: الصورة الرئيسية وصور الفئات.
 * كل إطار معاينة بنفس نسبة الإطار في المتجر، فما ترينه هنا هو ما سيظهر.
 */
export function SiteImagesPage() {
  const { refresh } = useSiteImages();

  // أحدث حالة عند فتح الصفحة (قد تكون الصور تغيّرت من جهاز آخر)
  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold">صور المتجر</h1>
        <p className="mt-1 text-sm text-ink-muted">
          غيّري صورة الصفحة الرئيسية وصور الفئات. يمكنك دائمًا العودة إلى الصورة الأصلية.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">الصورة الرئيسية</h2>
        <div className="max-w-sm">
          <SiteImageEditor
            imageKey={HERO_IMAGE_KEY}
            title="الصورة الرئيسية"
            defaultSrc={DEFAULT_HERO_IMAGE}
            aspectClass="aspect-square"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">صور الفئات</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <SiteImageEditor
              key={category.slug}
              imageKey={categoryImageKey(category.slug)}
              title={category.name}
              defaultSrc={category.image}
              aspectClass="aspect-[4/3]"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
