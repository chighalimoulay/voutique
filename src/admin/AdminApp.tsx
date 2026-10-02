import { Loader2, ShieldAlert } from 'lucide-react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { Seo } from '@/components/Seo';
import { Button } from '@/components/ui/Button';
import { isSupabaseConfigured } from '@/lib/supabaseConfig';
import { signOut } from './adminApi';
import { AdminLayout } from './AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { ProductFormPage } from './pages/ProductFormPage';
import { ProductsPage } from './pages/ProductsPage';
import { SiteImagesPage } from './pages/SiteImagesPage';
import { useAdminSession } from './useAdminSession';

/**
 * ══════════════════════════════════════════════════════════════════
 *  لوحة الإدارة — /admin
 *
 *  تُحمَّل في حزمة منفصلة فقط عند زيارة /admin، فلا تثقل المتجر.
 *  الحماية الحقيقية في Supabase (RLS)؛ هذه البوابة لتجربة الاستخدام فقط.
 * ══════════════════════════════════════════════════════════════════
 */
export default function AdminApp() {
  const { auth, recheck } = useAdminSession();

  if (!isSupabaseConfigured) {
    return (
      <Notice title="لوحة الإدارة غير مفعّلة">
        لم تُضبط بيانات Supabase (VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY).
      </Notice>
    );
  }

  if (auth.status === 'loading') {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-cream" role="status">
        <Seo title="لوحة الإدارة" noIndex />
        <Loader2 className="h-6 w-6 animate-spin text-mauve-500" aria-hidden="true" />
        <span className="sr-only">جارٍ التحقق…</span>
      </div>
    );
  }

  if (auth.status === 'notAdmin' || auth.status === 'error') {
    return (
      <Notice title={auth.status === 'notAdmin' ? 'لا توجد صلاحية' : 'تعذّر التحقق من الصلاحيات'}>
        {auth.status === 'notAdmin'
          ? `الحساب ${auth.email} لا يملك صلاحية إدارة المتجر.`
          : 'تحققي من اتصال الإنترنت ثم أعيدي المحاولة.'}
        <div className="mt-5 flex gap-3">
          {auth.status === 'error' && (
            <Button fullWidth onClick={recheck}>
              إعادة المحاولة
            </Button>
          )}
          <Button variant="outline" fullWidth onClick={() => void signOut()}>
            تسجيل الخروج
          </Button>
        </div>
      </Notice>
    );
  }

  const signedIn = auth.status === 'admin';

  return (
    <Routes>
      <Route path="login" element={signedIn ? <Navigate to="/admin" replace /> : <LoginPage />} />
      <Route
        element={signedIn ? <AdminLayout email={auth.email} /> : <Navigate to="/admin/login" replace />}
      >
        <Route index element={<ProductsPage />} />
        <Route path="products/new" element={<ProductFormPage key="new" />} />
        <Route path="products/:id" element={<EditProductRoute />} />
        <Route path="site-images" element={<SiteImagesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

/** المفتاح يضمن نموذجًا نظيفًا عند الانتقال من منتج إلى آخر. */
function EditProductRoute() {
  const { id } = useParams();
  return <ProductFormPage key={id} />;
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-cream px-4">
      <Seo title={title} noIndex />
      <div className="card-surface w-full max-w-sm p-6 text-center">
        <ShieldAlert className="mx-auto h-8 w-8 text-mauve-500" aria-hidden="true" />
        <h1 className="mt-3 text-lg font-bold">{title}</h1>
        <div className="mt-2 text-sm leading-7 text-ink-soft">{children}</div>
      </div>
    </div>
  );
}
