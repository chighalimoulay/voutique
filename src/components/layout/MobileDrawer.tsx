import { AnimatePresence, motion } from 'framer-motion';
import { Heart, MessageCircle, ShoppingBag, X } from 'lucide-react';
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { storeConfig } from '@/config/store';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useToast } from '@/store/useToast';
import { cn } from '@/utils/cn';
import { createContactMessage, openWhatsApp } from '@/utils/whatsapp';
import { Logo } from './Logo';
import { mainNav } from './navigation';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const { notify } = useToast();
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  function contactOnWhatsapp() {
    const result = openWhatsApp(createContactMessage());
    if (!result.ok) notify(result.error, 'error');
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="قائمة التنقّل">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* الدرج يفتح من اليمين لأن الواجهة RTL */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col bg-cream shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-mauve-100 px-5 py-4">
              <Logo />
              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق القائمة"
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-mauve-50"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="روابط المتجر">
              <ul className="space-y-1">
                {mainNav.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'block rounded-xl px-4 py-3 text-[15px] transition-colors',
                          isActive
                            ? 'bg-mauve-100 font-semibold text-mauve-700'
                            : 'text-ink-soft hover:bg-mauve-50 hover:text-ink',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <div className="my-4 h-px bg-mauve-100" />

              <ul className="space-y-1">
                <li>
                  <NavLink
                    to="/wishlist"
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] text-ink-soft transition-colors hover:bg-mauve-50 hover:text-ink"
                  >
                    <Heart className="h-5 w-5" aria-hidden="true" />
                    المفضلة
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/cart"
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] text-ink-soft transition-colors hover:bg-mauve-50 hover:text-ink"
                  >
                    <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                    السلة
                  </NavLink>
                </li>
              </ul>
            </nav>

            <div className="border-t border-mauve-100 p-4">
              <button
                type="button"
                onClick={contactOnWhatsapp}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1FA855] px-5 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#178F47]"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                تواصلي معنا عبر واتساب
              </button>

              <p className="mt-3 text-center text-xs text-ink-muted">{storeConfig.workingHours}</p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
