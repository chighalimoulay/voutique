import { ArrowLeft, Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storeConfig } from '@/config/store';

export function ExternalOrderBanner() {
  return (
    <section className="container-page py-12 sm:py-14">
      <div className="relative overflow-hidden rounded-3xl border border-mauve-100 bg-ink px-6 py-12 text-center sm:px-12 sm:py-14 sm:text-right">
        <div
          className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-mauve-500/25 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-gold/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-1.5 text-xs font-medium text-gold-light">
              <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
              خدمة الشراء من الخارج
            </span>

            <h2 className="mt-4 text-2xl font-bold text-cream sm:text-3xl">
              لم تجدي ما تبحثين عنه؟
            </h2>

            <p className="mt-3 text-[15px] leading-8 text-cream/75">
              أرسلي لنا رابط المنتج من {storeConfig.externalSites.slice(0, 5).join(' أو ')} وسنتولى
              مساعدتك في طلبه.
            </p>

            <ul className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
              {storeConfig.externalSites.slice(0, 5).map((site) => (
                <li
                  key={site}
                  className="rounded-full border border-cream/20 px-3 py-1 text-xs text-cream/70"
                >
                  {site}
                </li>
              ))}
            </ul>
          </div>

          <Link
            to="/external-order"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-[15px] font-semibold text-ink transition-all duration-300 hover:bg-white hover:shadow-lift"
          >
            ابدئي الطلب
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
