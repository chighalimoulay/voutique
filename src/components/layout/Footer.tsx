import { Facebook, Instagram, Mail, MapPin, MessageCircle, Music2, Phone, Ghost } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storeConfig } from '@/config/store';
import { useToast } from '@/store/useToast';
import { createContactMessage, openWhatsApp } from '@/utils/whatsapp';
import { footerServiceLinks, footerShopLinks, mainNav } from './navigation';

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Music2,
  snapchat: Ghost,
};

export function Footer() {
  const { notify } = useToast();
  const year = new Date().getFullYear();

  function contactOnWhatsapp() {
    const result = openWhatsApp(createContactMessage());
    if (!result.ok) notify(result.error, 'error');
  }

  return (
    <footer className="mt-16 border-t border-mauve-100 bg-white">
      <div className="container-page py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* العلامة */}
          <div className="lg:col-span-1">
            <span className="font-display text-2xl font-bold tracking-[0.28em] text-ink">
              {storeConfig.name}
            </span>
            <p className="mt-3 text-sm text-mauve-600">{storeConfig.tagline}</p>
            <p className="mt-3 max-w-xs text-sm leading-7 text-ink-soft">
              {storeConfig.description}
            </p>

            <div className="mt-5 flex gap-2">
              {storeConfig.social.map((link) => {
                const Icon = SOCIAL_ICONS[link.key] ?? Instagram;
                return (
                  <a
                    key={link.key}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-mauve-200 text-ink-soft transition-all duration-300 hover:border-mauve-500 hover:bg-mauve-50 hover:text-mauve-600"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                );
              })}

              <button
                type="button"
                onClick={contactOnWhatsapp}
                aria-label="تواصلي معنا عبر واتساب"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1FA855]/30 text-[#1FA855] transition-all duration-300 hover:bg-[#1FA855] hover:text-white"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* روابط المتجر */}
          <nav aria-label="روابط المتجر">
            <h2 className="text-sm font-semibold text-ink">المتجر</h2>
            <ul className="mt-4 space-y-2.5">
              {footerShopLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-ink-soft transition-colors hover:text-mauve-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* خدمة العملاء */}
          <nav aria-label="خدمة العملاء">
            <h2 className="text-sm font-semibold text-ink">خدمة العملاء</h2>
            <ul className="mt-4 space-y-2.5">
              {footerServiceLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-ink-soft transition-colors hover:text-mauve-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* التواصل */}
          <div>
            <h2 className="text-sm font-semibold text-ink">تواصلي معنا</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mauve-500" aria-hidden="true" />
                <span>{storeConfig.address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-mauve-500" aria-hidden="true" />
                <span className="num" dir="ltr">
                  {storeConfig.phone}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-mauve-500" aria-hidden="true" />
                <a
                  href={`mailto:${storeConfig.email}`}
                  className="transition-colors hover:text-mauve-600"
                >
                  {storeConfig.email}
                </a>
              </li>
            </ul>

            <p className="mt-4 text-xs leading-6 text-ink-muted">{storeConfig.workingHours}</p>
          </div>
        </div>

        {/* شريط سفلي */}
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-mauve-100 pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-ink-muted">
            © <span className="num">{year}</span> {storeConfig.name} — جميع الحقوق محفوظة.
          </p>

          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {mainNav.slice(0, 4).map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-xs text-ink-muted transition-colors hover:text-mauve-600"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
