import { Heart, Menu, Search, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useCart } from '@/store/useCart';
import { useWishlist } from '@/store/useWishlist';
import { cn } from '@/utils/cn';
import { Logo } from './Logo';
import { MobileDrawer } from './MobileDrawer';
import { mainNav } from './navigation';
import { SearchOverlay } from './SearchOverlay';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { totalQuantity } = useCart();
  const { count: wishlistCount } = useWishlist();
  const location = useLocation();

  // إغلاق الدرج تلقائيًا عند تغيير الصفحة
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* شريط علوي رفيع */}
      <div className="hidden bg-ink py-2 text-center text-[13px] text-cream sm:block">
        توصيل داخل موريتانيا • الطلب مباشرة عبر واتساب
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300 ease-silk',
          scrolled
            ? 'border-b border-mauve-100 bg-cream/90 shadow-soft backdrop-blur-md'
            : 'bg-cream',
        )}
      >
        <div className="container-page">
          <div className="flex h-16 items-center justify-between gap-3 sm:h-[70px]">
            {/* يمين (بداية السطر في RTL): زر القائمة على الهاتف + الشعار */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="فتح القائمة"
                aria-expanded={drawerOpen}
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-mauve-50 lg:hidden"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>

              <Logo />
            </div>

            {/* الوسط: التنقّل على الشاشات الكبيرة */}
            <nav className="hidden lg:block" aria-label="التنقّل الرئيسي">
              <ul className="flex items-center gap-1">
                {mainNav.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'relative rounded-full px-3.5 py-2 text-[15px] transition-colors duration-300',
                          isActive
                            ? 'font-semibold text-mauve-600'
                            : 'text-ink-soft hover:text-ink',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* يسار: البحث والمفضلة والسلة */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="البحث في المتجر"
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-mauve-50"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </button>

              <NavLink
                to="/wishlist"
                aria-label={`المفضلة، ${wishlistCount} منتج`}
                className="relative hidden h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-mauve-50 sm:flex"
              >
                <Heart className="h-5 w-5" aria-hidden="true" />
                {wishlistCount > 0 && <CountBubble value={wishlistCount} />}
              </NavLink>

              <NavLink
                to="/cart"
                aria-label={`السلة، ${totalQuantity} منتج`}
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-mauve-50"
              >
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                {totalQuantity > 0 && <CountBubble value={totalQuantity} />}
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function CountBubble({ value }: { value: number }) {
  return (
    <span
      className="num absolute -top-0.5 left-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-mauve-500 px-1 text-[10px] font-bold text-white"
      aria-hidden="true"
    >
      {value > 99 ? '99+' : value}
    </span>
  );
}
