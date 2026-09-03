import { Seo } from '@/components/Seo';
import { ButtonLink } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <>
      <Seo title="الصفحة غير موجودة" noIndex />

      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="num font-display text-7xl font-bold text-mauve-200 sm:text-8xl">404</span>

        <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
          عذرًا، الصفحة التي تبحثين عنها غير موجودة.
        </h1>

        <p className="mt-3 max-w-md text-sm leading-7 text-ink-soft">
          ربما تغيّر الرابط أو حُذفت الصفحة. يمكنك العودة إلى المتجر ومتابعة التسوّق.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/" size="lg">
            العودة إلى المتجر
          </ButtonLink>
          <ButtonLink to="/shop" size="lg" variant="outline">
            تصفّحي المنتجات
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
