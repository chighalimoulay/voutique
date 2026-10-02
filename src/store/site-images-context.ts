import { createContext } from 'react';
import type { SiteImageMap } from '@/services/siteImagesApi';

export interface SiteImagesContextValue {
  /** الصور المخصّصة فقط — المفتاح الغائب يعني «الصورة الأصلية». */
  images: SiteImageMap;
  /**
   * false فقط في أول زيارة قبل وصول الرد (لا نسخة محفوظة على الجهاز)،
   * حتى لا تظهر الصورة الأصلية ثم تُستبدل أمام الزائرة.
   */
  ready: boolean;
  /** يعيد الجلب — تستدعيه لوحة الإدارة بعد كل تغيير. */
  refresh: () => Promise<void>;
}

export const SiteImagesContext = createContext<SiteImagesContextValue | null>(null);
