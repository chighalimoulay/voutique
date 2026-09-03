import { useEffect } from 'react';
import { storeConfig } from '@/config/store';

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  /** بيانات مهيكلة (JSON-LD) لصفحة المنتج مثلًا. */
  jsonLd?: Record<string, unknown>;
  noIndex?: boolean;
}

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

/**
 * إدارة وسوم الرأس بلا مكتبة خارجية.
 * كافٍ تمامًا لموقع ثابت، ويبقي الحزمة خفيفة.
 */
export function Seo({ title, description, image, jsonLd, noIndex }: SeoProps) {
  const fullTitle = title.includes(storeConfig.name)
    ? title
    : `${title} | ${storeConfig.name}`;
  const desc = description ?? storeConfig.description;
  const cover = image ?? '/images/og-cover.svg';

  useEffect(() => {
    document.title = fullTitle;

    setMeta('meta[name="description"]', 'name', 'description', desc);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', desc);
    setMeta('meta[property="og:image"]', 'property', 'og:image', cover);
    setMeta('meta[property="og:url"]', 'property', 'og:url', window.location.href);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', cover);
    setMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noIndex ? 'noindex, nofollow' : 'index, follow',
    );

    // رابط قانوني للصفحة يمنع تكرار المحتوى في نتائج البحث
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + window.location.pathname;
  }, [fullTitle, desc, cover, noIndex]);

  useEffect(() => {
    const SCRIPT_ID = 'voutique-jsonld';
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) existing.remove();

    if (!jsonLd) return;

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [jsonLd]);

  return null;
}
