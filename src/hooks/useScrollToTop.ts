import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * يعيد الصفحة إلى الأعلى عند كل تنقّل.
 * بدونه تفتح الصفحة الجديدة من منتصفها وتضطر المستخدمة للتمرير يدويًا.
 */
export function useScrollToTop(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
}
