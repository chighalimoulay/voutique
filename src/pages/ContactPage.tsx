import { Clock, Facebook, Ghost, Instagram, Mail, MapPin, MessageCircle, Music2, Phone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Seo } from '@/components/Seo';
import { Button } from '@/components/ui/Button';
import { storeConfig } from '@/config/store';
import { useToast } from '@/store/useToast';
import { cn } from '@/utils/cn';
import { createContactMessage, openWhatsApp } from '@/utils/whatsapp';

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Music2,
  snapchat: Ghost,
};

export default function ContactPage() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { notify } = useToast();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (message.trim().length < 5) {
      setError('يرجى كتابة رسالتك أولًا.');
      return;
    }

    setError('');

    const body = name.trim()
      ? `أنا ${name.trim()}.\n\n${message.trim()}`
      : message.trim();

    const result = openWhatsApp(createContactMessage(body));

    if (!result.ok) {
      notify(result.error, 'error');
      return;
    }

    notify('تم تجهيز رسالتك في واتساب.', 'success');
  }

  function quickWhatsapp() {
    const result = openWhatsApp(createContactMessage());
    if (!result.ok) notify(result.error, 'error');
  }

  return (
    <>
      <Seo
        title="تواصلي معنا"
        description={`تواصلي مع ${storeConfig.name} عبر واتساب أو الهاتف أو البريد الإلكتروني.`}
      />

      <div className="surface-blush border-b border-mauve-100">
        <div className="container-page py-12 text-center sm:py-14">
          <h1 className="text-3xl font-bold sm:text-4xl">تواصلي معنا</h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-8 text-ink-soft">
            نحن هنا للإجابة عن أسئلتك ومساعدتك في اختيار ما يناسبك. أسرع طريقة للتواصل هي واتساب.
          </p>
        </div>
      </div>

      <div className="container-page py-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* بيانات التواصل */}
          <div>
            <h2 className="section-title">بيانات المتجر</h2>

            <ul className="mt-6 space-y-4">
              <ContactRow icon={MapPin} label="العنوان" value={storeConfig.address} />
              <ContactRow icon={Phone} label="الهاتف" value={storeConfig.phone} ltr />
              <ContactRow
                icon={Mail}
                label="البريد الإلكتروني"
                value={storeConfig.email}
                href={`mailto:${storeConfig.email}`}
                ltr
              />
              <ContactRow icon={Clock} label="ساعات العمل" value={storeConfig.workingHours} />
            </ul>

            <Button variant="whatsapp" size="lg" className="mt-7" onClick={quickWhatsapp}>
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              محادثة سريعة على واتساب
            </Button>

            {storeConfig.social.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-ink">تابعينا</h3>
                <div className="mt-3 flex gap-2">
                  {storeConfig.social.map((link) => {
                    const Icon = SOCIAL_ICONS[link.key] ?? Instagram;
                    return (
                      <a
                        key={link.key}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-mauve-200 text-ink-soft transition-all duration-300 hover:border-mauve-500 hover:bg-mauve-50 hover:text-mauve-600"
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* نموذج سريع */}
          <div>
            <h2 className="section-title">أرسلي رسالة</h2>

            <form onSubmit={handleSubmit} noValidate className="card-surface mt-6 space-y-5 p-5 sm:p-6">
              <div>
                <label htmlFor="contact-name" className="field-label">
                  الاسم
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="اختياري"
                  className="field-input"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="field-label">
                  رسالتك <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={6}
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);
                    if (error) setError('');
                  }}
                  placeholder="كيف يمكننا مساعدتك؟"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'contact-error' : undefined}
                  className={cn('field-input resize-y', error && 'border-red-400')}
                />
                {error && (
                  <p id="contact-error" className="field-error" role="alert">
                    {error}
                  </p>
                )}
              </div>

              <Button type="submit" variant="whatsapp" size="lg" fullWidth>
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                إرسال عبر واتساب
              </Button>

              <p className="text-center text-xs leading-6 text-ink-muted">
                ستُفتح محادثة واتساب برسالتك جاهزة للإرسال.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  ltr,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  ltr?: boolean;
}) {
  const content = (
    <span className={cn('text-sm text-ink-soft', ltr && 'num')} dir={ltr ? 'ltr' : undefined}>
      {value}
    </span>
  );

  return (
    <li className="flex items-start gap-3.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mauve-50 text-mauve-600">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>

      <span className="min-w-0">
        <span className="block text-xs text-ink-muted">{label}</span>
        {href ? (
          <a href={href} className="transition-colors hover:text-mauve-600">
            {content}
          </a>
        ) : (
          content
        )}
      </span>
    </li>
  );
}
