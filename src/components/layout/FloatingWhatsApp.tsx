import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/store/useToast';
import { cn } from '@/utils/cn';
import { createContactMessage, openWhatsApp } from '@/utils/whatsapp';

/**
 * زر واتساب عائم.
 *
 * موضعه مدروس حتى لا يغطي عناصر أخرى:
 *  - على الهاتف يرتفع فوق الشريط السفلي الثابت في صفحتَي المنتج والسلة
 *    (يقرأ الصنف has-sticky-bar الذي تضعه تلك الصفحات على <body>).
 *  - يختفي تمامًا في صفحة السلة حيث زر «إرسال الطلب» هو الإجراء الرئيسي.
 */
export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const { notify } = useToast();
  const { pathname } = useLocation();

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 260);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (pathname === '/cart') return null;

  function handleClick() {
    const result = openWhatsApp(createContactMessage());
    if (!result.ok) notify(result.error, 'error');
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="تواصلي معنا عبر واتساب"
      title="تواصلي معنا عبر واتساب"
      className={cn(
        'fixed left-4 z-40 flex h-14 w-14 items-center justify-center rounded-full',
        'bg-[#1FA855] text-white shadow-lift transition-all duration-300 ease-silk',
        'hover:scale-105 hover:bg-[#178F47] focus-visible:scale-105',
        // يرتفع فوق الشريط السفلي على الهاتف، ويعود لأسفل على الشاشات الكبيرة
        'bottom-24 sm:bottom-6',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
    </button>
  );
}
