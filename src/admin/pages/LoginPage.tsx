import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Logo } from '@/components/layout/Logo';
import { Seo } from '@/components/Seo';
import { Button } from '@/components/ui/Button';
import { signIn } from '../adminApi';

function loginErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : '';
  if (/invalid login credentials/i.test(message)) {
    return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
  }
  if (/email not confirmed/i.test(message)) return 'لم يتم تأكيد هذا البريد بعد.';
  if (/rate limit|too many/i.test(message)) return 'محاولات كثيرة. انتظري قليلًا ثم حاولي مجددًا.';
  if (/fetch|network/i.test(message)) return 'تعذّر الاتصال. تحققي من الإنترنت ثم حاولي مجددًا.';
  return 'تعذّر تسجيل الدخول. حاولي مجددًا.';
}

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      await signIn(email, password);
      // التوجيه إلى اللوحة يتم تلقائيًا بعد التحقق من الصلاحيات
    } catch (err) {
      setError(loginErrorMessage(err));
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-cream px-4 py-10">
      <Seo title="دخول لوحة الإدارة" noIndex />

      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <form onSubmit={handleSubmit} className="card-surface space-y-4 p-6" noValidate>
          <div className="text-center">
            <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-mauve-50 text-mauve-600">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </span>
            <h1 className="text-xl font-bold">لوحة إدارة المتجر</h1>
            <p className="mt-1 text-sm text-ink-muted">سجّلي الدخول لإدارة المنتجات.</p>
          </div>

          <div>
            <label htmlFor="admin-email" className="field-label">
              البريد الإلكتروني
            </label>
            <input
              id="admin-email"
              type="email"
              inputMode="email"
              autoComplete="username"
              dir="ltr"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field-input text-left"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="field-label">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                dir="ltr"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="field-input pe-12 text-left"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                className="absolute inset-y-0 end-0 flex w-12 items-center justify-center text-ink-muted hover:text-ink"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" fullWidth disabled={busy || !email || !password}>
            {busy ? 'جارٍ الدخول…' : 'دخول'}
          </Button>
        </form>
      </div>
    </div>
  );
}
