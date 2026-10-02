import { useContext } from 'react';
import { SiteImagesContext, type SiteImagesContextValue } from './site-images-context';

export function useSiteImages(): SiteImagesContextValue {
  const context = useContext(SiteImagesContext);

  if (!context) {
    throw new Error('useSiteImages يجب أن يُستخدم داخل SiteImagesProvider');
  }

  return context;
}

/** رابط الصورة الحالي: المخصّصة إن وُجدت، وإلا الأصلية. */
export function useSiteImage(key: string, fallback: string): { src: string; ready: boolean } {
  const { images, ready } = useSiteImages();
  return { src: images[key] ?? fallback, ready };
}
