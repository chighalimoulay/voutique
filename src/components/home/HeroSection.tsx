import { motion } from 'framer-motion';
import { ArrowLeft, Globe2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ButtonLink } from '@/components/ui/Button';
import { storeConfig } from '@/config/store';

/**
 * قسم البطل.
 *
 * البنية مقسّمة إلى «نص» و«مرئي» متجاورين، والمرئي معزول في عنصر مستقل
 * حتى يمكن لاحقًا استبدال الصورة بـ <Canvas> من React Three Fiber
 * دون المساس بتخطيط الصفحة أو النصوص.
 */
export function HeroSection() {
  return (
    <section className="surface-blush relative overflow-hidden">
      {/* عناصر زخرفية عائمة تعطي إحساس العمق دون تكلفة أداء */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-softpink/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-mauve-200/45 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative py-14 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* النص */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center lg:text-right"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/70 px-4 py-1.5 text-xs font-medium text-gold-dark backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              مختارات {storeConfig.name}
            </span>

            <h1 className="mt-5 text-4xl font-bold leading-[1.25] text-ink sm:text-5xl lg:text-6xl">
              جمالك…
              <span className="block text-mauve-600">بطريقتك</span>
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-[15px] leading-8 text-ink-soft sm:text-base lg:mx-0">
              اكتشفي مختارات {storeConfig.name} من العطور والجمال والعناية، واختاري ما يناسبك.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <ButtonLink to="/shop" size="lg" className="group">
                تسوقي الآن
                <ArrowLeft
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                  aria-hidden="true"
                />
              </ButtonLink>

              <ButtonLink to="/external-order" size="lg" variant="outline">
                <Globe2 className="h-4 w-4" aria-hidden="true" />
                اطلبي من الخارج
              </ButtonLink>
            </div>

            {/* مؤشرات ثقة */}
            <ul className="mt-9 grid grid-cols-3 gap-3 text-center lg:max-w-md lg:text-right">
              <li>
                <p className="num text-xl font-bold text-mauve-600">100%</p>
                <p className="mt-0.5 text-xs text-ink-soft">منتجات مختارة</p>
              </li>
              <li>
                <p className="text-xl font-bold text-mauve-600">واتساب</p>
                <p className="mt-0.5 text-xs text-ink-soft">طلب مباشر وسريع</p>
              </li>
              <li>
                <p className="text-xl font-bold text-mauve-600">موريتانيا</p>
                <p className="mt-0.5 text-xs text-ink-soft">توصيل داخل البلاد</p>
              </li>
            </ul>
          </motion.div>

          {/* المرئي — نقطة الاستبدال المستقبلية بـ 3D */}
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-md lg:max-w-none"
    >
      <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 shadow-lift backdrop-blur-sm">
        <img
          src="/images/products/rose-perfume.svg"
          alt="عطر ورد فاخر من مختارات VOUTIQUE"
          className="h-full w-full object-cover"
          loading="eager"
          decoding="async"
          // React 18 لا يعرف الخاصية بصيغة camelCase، لذا نمرّرها بالاسم الفعلي في HTML
          {...{ fetchpriority: 'high' }}
        />
      </div>

      {/* بطاقة عائمة صغيرة */}
      <Link
        to="/category/gifts"
        className="absolute -bottom-4 right-4 flex animate-float items-center gap-3 rounded-2xl border border-mauve-100 bg-white px-4 py-3 shadow-card transition-transform duration-300 hover:-translate-y-1 sm:right-6"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mauve-50 text-mauve-600">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-sm font-semibold text-ink">هدايا مغلّفة</span>
          <span className="block text-xs text-ink-muted">جاهزة لكل مناسبة</span>
        </span>
      </Link>
    </motion.div>
  );
}
