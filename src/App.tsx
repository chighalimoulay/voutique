import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Layout } from '@/components/layout/Layout';
import { ToastViewport } from '@/components/ui/ToastViewport';
import { CartProvider } from '@/store/CartProvider';
import { ToastProvider } from '@/store/ToastProvider';
import { WishlistProvider } from '@/store/WishlistProvider';
import HomePage from '@/pages/HomePage';

/**
 * الصفحة الرئيسية تُحمَّل مباشرة (أول ما تراه الزائرة)،
 * وبقية الصفحات تُحمَّل عند الحاجة لتبقى الحزمة الأولى صغيرة.
 */
const ShopPage = lazy(() => import('@/pages/ShopPage'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const ProductPage = lazy(() => import('@/pages/ProductPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage'));
const ExternalOrderPage = lazy(() => import('@/pages/ExternalOrderPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const LegalPage = lazy(() => import('@/pages/LegalPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function PageFallback() {
  return (
    <div className="container-page py-20" role="status" aria-live="polite">
      <span className="sr-only">جارٍ التحميل…</span>

      <div className="mx-auto max-w-5xl space-y-6" aria-hidden="true">
        <div className="skeleton h-8 w-56" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="skeleton aspect-square w-full" />
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
              <Routes>
                <Route element={<Layout />}>
                  <Route
                    index
                    element={
                      <Suspense fallback={<PageFallback />}>
                        <HomePage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="shop"
                    element={
                      <Suspense fallback={<PageFallback />}>
                        <ShopPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="category/:slug"
                    element={
                      <Suspense fallback={<PageFallback />}>
                        <CategoryPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="product/:slug"
                    element={
                      <Suspense fallback={<PageFallback />}>
                        <ProductPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="cart"
                    element={
                      <Suspense fallback={<PageFallback />}>
                        <CartPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="wishlist"
                    element={
                      <Suspense fallback={<PageFallback />}>
                        <WishlistPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="external-order"
                    element={
                      <Suspense fallback={<PageFallback />}>
                        <ExternalOrderPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="contact"
                    element={
                      <Suspense fallback={<PageFallback />}>
                        <ContactPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="privacy"
                    element={
                      <Suspense fallback={<PageFallback />}>
                        <LegalPage kind="privacy" />
                      </Suspense>
                    }
                  />
                  <Route
                    path="terms"
                    element={
                      <Suspense fallback={<PageFallback />}>
                        <LegalPage kind="terms" />
                      </Suspense>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <Suspense fallback={<PageFallback />}>
                        <NotFoundPage />
                      </Suspense>
                    }
                  />
                </Route>
              </Routes>

              <ToastViewport />
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
