import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { FloatingWhatsApp } from './FloatingWhatsApp';
import { Footer } from './Footer';
import { Header } from './Header';

export function Layout() {
  useScrollToTop();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-mauve-500 focus:px-5 focus:py-2 focus:text-white"
      >
        تخطّي إلى المحتوى
      </a>

      <Header />

      <main id="main" className="flex-1">
        {/*
          حدود الخطأ حول المحتوى فقط:
          إن فشل مكوّن داخل الصفحة يبقى الهيدر والفوتر يعملان
          بدل أن تتحوّل الصفحة إلى شاشة بيضاء.
        */}
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
