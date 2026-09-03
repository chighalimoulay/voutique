import { Globe2, Info, MessageCircle } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Seo } from '@/components/Seo';
import { Button } from '@/components/ui/Button';
import { QuantityInput } from '@/components/ui/QuantityInput';
import { storeConfig } from '@/config/store';
import { useToast } from '@/store/useToast';
import type { ExternalOrderForm } from '@/types';
import { cn } from '@/utils/cn';
import { createExternalOrderMessage, openWhatsApp } from '@/utils/whatsapp';

const EMPTY_FORM: ExternalOrderForm = {
  productName: '',
  productUrl: '',
  site: storeConfig.externalSites[0] ?? 'SHEIN',
  quantity: 1,
  color: '',
  size: '',
  notes: '',
};

type FieldErrors = Partial<Record<keyof ExternalOrderForm, string>>;

/** يقبل http/https فقط — يمنع الروابط غير الصالحة أو الخطيرة. */
function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function validate(form: ExternalOrderForm): FieldErrors {
  const errors: FieldErrors = {};

  if (form.productName.trim().length < 2) {
    errors.productName = 'يرجى كتابة اسم المنتج.';
  }
  if (!form.productUrl.trim()) {
    errors.productUrl = 'رابط المنتج مطلوب.';
  } else if (!isValidHttpUrl(form.productUrl)) {
    errors.productUrl = 'الرابط غير صالح. يجب أن يبدأ بـ http أو https';
  }
  if (!form.site.trim()) {
    errors.site = 'يرجى اختيار الموقع.';
  }

  return errors;
}

export default function ExternalOrderPage() {
  const [form, setForm] = useState<ExternalOrderForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const { notify } = useToast();

  function setField<K extends keyof ExternalOrderForm>(key: K, value: ExternalOrderForm[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const found = validate(form);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      notify('يرجى تصحيح الحقول المميّزة.', 'error');
      return;
    }

    const result = openWhatsApp(createExternalOrderMessage(form));

    if (!result.ok) {
      notify(result.error, 'error');
      return;
    }

    notify('تم تجهيز طلبك في واتساب.', 'success');
  }

  return (
    <>
      <Seo
        title="اطلبي من الخارج"
        description="أرسلي لنا رابط المنتج من SHEIN أو Noon أو Temu أو Amazon أو AliExpress وسنتولى مساعدتك في طلبه."
      />

      {/* الرأس */}
      <div className="surface-blush border-b border-mauve-100">
        <div className="container-page py-12 text-center sm:py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/70 px-4 py-1.5 text-xs font-medium text-gold-dark backdrop-blur">
            <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
            خدمة الشراء من الخارج
          </span>

          <h1 className="mt-5 text-3xl font-bold sm:text-4xl">اطلبي من الخارج</h1>

          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-ink-soft">
            لم تجدي ما تبحثين عنه؟ أرسلي لنا رابط المنتج من{' '}
            {storeConfig.externalSites.slice(0, 5).join(' أو ')} وسنتولى مساعدتك في طلبه.
          </p>

          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {storeConfig.externalSites.slice(0, 5).map((site) => (
              <li
                key={site}
                className="rounded-full border border-mauve-200 bg-white px-4 py-1.5 text-xs font-medium text-ink-soft"
              >
                {site}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-page py-10">
        <div className="mx-auto max-w-2xl">
          {/* تنبيه صريح: السعر ليس نهائيًا */}
          <div className="mb-6 flex gap-3 rounded-2xl border border-gold/30 bg-gold/5 p-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" aria-hidden="true" />
            <p className="text-sm leading-7 text-ink-soft">
              السعر الظاهر في الموقع الخارجي ليس السعر النهائي. بعد استلام طلبك سنراجعه ونحسب
              التكلفة النهائية شاملة الشحن والرسوم، ونرسلها إليك عبر واتساب قبل الشراء.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="card-surface space-y-5 p-5 sm:p-7"
            aria-label="نموذج طلب منتج من الخارج"
          >
            {/* اسم المنتج */}
            <div>
              <label htmlFor="productName" className="field-label">
                اسم المنتج <span className="text-red-500">*</span>
              </label>
              <input
                id="productName"
                type="text"
                value={form.productName}
                onChange={(event) => setField('productName', event.target.value)}
                placeholder="مثال: فستان صيفي وردي"
                aria-invalid={Boolean(errors.productName)}
                aria-describedby={errors.productName ? 'productName-error' : undefined}
                className={cn('field-input', errors.productName && 'border-red-400')}
              />
              {errors.productName && (
                <p id="productName-error" className="field-error" role="alert">
                  {errors.productName}
                </p>
              )}
            </div>

            {/* رابط المنتج */}
            <div>
              <label htmlFor="productUrl" className="field-label">
                رابط المنتج <span className="text-red-500">*</span>
              </label>
              <input
                id="productUrl"
                type="url"
                dir="ltr"
                value={form.productUrl}
                onChange={(event) => setField('productUrl', event.target.value)}
                placeholder="https://..."
                aria-invalid={Boolean(errors.productUrl)}
                aria-describedby={errors.productUrl ? 'productUrl-error' : 'productUrl-hint'}
                className={cn('field-input text-left', errors.productUrl && 'border-red-400')}
              />
              {errors.productUrl ? (
                <p id="productUrl-error" className="field-error" role="alert">
                  {errors.productUrl}
                </p>
              ) : (
                <p id="productUrl-hint" className="mt-1.5 text-xs text-ink-muted">
                  انسخي رابط المنتج من التطبيق أو الموقع والصقيه هنا.
                </p>
              )}
            </div>

            {/* الموقع والكمية */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="site" className="field-label">
                  الموقع <span className="text-red-500">*</span>
                </label>
                <select
                  id="site"
                  value={form.site}
                  onChange={(event) => setField('site', event.target.value)}
                  className="field-input"
                >
                  {storeConfig.externalSites.map((site) => (
                    <option key={site} value={site}>
                      {site}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="field-label">الكمية</span>
                <QuantityInput
                  value={form.quantity}
                  onChange={(value) => setField('quantity', value)}
                  className="mt-0.5"
                />
              </div>
            </div>

            {/* اللون والمقاس */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="color" className="field-label">
                  اللون
                </label>
                <input
                  id="color"
                  type="text"
                  value={form.color}
                  onChange={(event) => setField('color', event.target.value)}
                  placeholder="اختياري"
                  className="field-input"
                />
              </div>

              <div>
                <label htmlFor="size" className="field-label">
                  المقاس
                </label>
                <input
                  id="size"
                  type="text"
                  value={form.size}
                  onChange={(event) => setField('size', event.target.value)}
                  placeholder="اختياري"
                  className="field-input"
                />
              </div>
            </div>

            {/* الملاحظات */}
            <div>
              <label htmlFor="notes" className="field-label">
                ملاحظات
              </label>
              <textarea
                id="notes"
                rows={4}
                value={form.notes}
                onChange={(event) => setField('notes', event.target.value)}
                placeholder="أي تفاصيل إضافية تودّين إخبارنا بها…"
                className="field-input resize-y"
              />
            </div>

            <Button type="submit" variant="whatsapp" size="lg" fullWidth>
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              إرسال الطلب عبر واتساب
            </Button>

            <p className="text-center text-xs leading-6 text-ink-muted">
              سيتم فتح واتساب برسالة جاهزة تحتوي على تفاصيل طلبك.
            </p>
          </form>

          {/* كيف تعمل الخدمة */}
          <section className="mt-10" aria-labelledby="how-it-works">
            <h2 id="how-it-works" className="section-title">
              كيف تعمل الخدمة؟
            </h2>

            <ol className="mt-6 space-y-4">
              {[
                'أرسلي لنا رابط المنتج مع التفاصيل عبر النموذج أعلاه.',
                'نراجع الطلب ونحسب التكلفة النهائية شاملة الشحن والرسوم.',
                'نرسل لك السعر النهائي عبر واتساب لتوافقي عليه.',
                'نشتري المنتج ونتابع شحنه حتى يصل إلى موريتانيا.',
                'نتواصل معك لتسليم الطلب.',
              ].map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="num flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mauve-500 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-sm leading-7 text-ink-soft">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </>
  );
}
