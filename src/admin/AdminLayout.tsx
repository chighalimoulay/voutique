import { ExternalLink, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Seo } from '@/components/Seo';
import { cn } from '@/utils/cn';
import { signOut } from './adminApi';

const SITE_IMAGES_PATH = '/admin/site-images';
const SALES_PATH = '/admin/sales';

const SECTIONS = [
  // «المنتجات» نشطة أيضًا داخل صفحات إضافة/تعديل منتج
  {
    to: '/admin',
    label: 'المنتجات',
    isActive: (path: string) => !path.startsWith(SITE_IMAGES_PATH) && !path.startsWith(SALES_PATH),
  },
  { to: SITE_IMAGES_PATH, label: 'صور المتجر', isActive: (path: string) => path.startsWith(SITE_IMAGES_PATH) },
  { to: SALES_PATH, label: 'المبيعات والأرباح', isActive: (path: string) => path.startsWith(SALES_PATH) },
];

export function AdminLayout({ email }: { email: string }) {
  const [signingOut, setSigningOut] = useState(false);
  const { pathname } = useLocation();

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-cream">
      <Seo title="لوحة الإدارة" noIndex />

      <header className="sticky top-0 z-40 border-b border-mauve-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4">
          <Link to="/admin" className="flex items-center gap-2">
            <img src="/logo-icon.png" alt="" className="h-8 w-8" />
            <span className="text-[15px] font-bold">لوحة الإدارة</span>
          </Link>

          <div className="flex items-center gap-1">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-ink-soft transition-colors hover:bg-mauve-50 hover:text-ink"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">عرض المتجر</span>
            </a>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              title={email}
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-ink-soft transition-colors hover:bg-mauve-50 hover:text-ink disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              خروج
            </button>
          </div>
        </div>

        <nav aria-label="أقسام لوحة الإدارة" className="mx-auto flex max-w-3xl gap-1 px-4">
          {SECTIONS.map((section) => {
            const active = section.isActive(pathname);
            return (
              <Link
                key={section.to}
                to={section.to}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'border-b-2 px-3 pb-2.5 pt-1 text-sm font-medium transition-colors',
                  active
                    ? 'border-mauve-500 text-mauve-600'
                    : 'border-transparent text-ink-muted hover:text-ink',
                )}
              >
                {section.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
