/**
 * ══════════════════════════════════════════════════════════════════
 *  إعدادات متجر VOUTIQUE — المصدر الوحيد لبيانات المتجر
 *
 *  ⚠ غيّري رقم واتساب من هنا فقط. لا تكرّريه في أي مكان آخر.
 *
 *  صيغة الرقم: رمز الدولة + الرقم، بلا + وبلا فراغات وبلا أصفار بادئة.
 *  مثال لموريتانيا (رمز الدولة 222):  22222081656
 * ══════════════════════════════════════════════════════════════════
 */

export interface SocialLink {
  /** المفتاح الداخلي — يُستخدم لاختيار الأيقونة. */
  key: 'instagram' | 'facebook' | 'tiktok' | 'snapchat';
  label: string;
  url: string;
}

export interface StoreConfig {
  name: string;
  tagline: string;
  description: string;
  /** رقم واتساب المتجر — أرقام فقط. اتركيه 222XXXXXXXX حتى تضبطي الرقم الحقيقي. */
  whatsappNumber: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  currency: string;
  currencyNameAr: string;
  social: SocialLink[];
  /** يظهر في صفحة «اطلبي من المواقع». */
  externalSites: string[];
  freeShippingFrom: number | null;
}

export const storeConfig: StoreConfig = {
  name: 'VOUTIQUE',
  tagline: 'جمالك… بطريقتك',
  description:
    'اكتشفي مختارات VOUTIQUE من العطور والجمال والعناية، واختاري ما يناسبك.',

  // ⬇⬇⬇  غيّري هذا الرقم إلى رقم واتساب متجرك الحقيقي  ⬇⬇⬇
  whatsappNumber: '22222081656',
  // ⬆⬆⬆  ─────────────────────────────────────────────  ⬆⬆⬆

  phone: '+222 22 08 16 56',
  email: 'voutique1@gmail.com',
  address: 'نواكشوط — موريتانيا',
  workingHours: 'السبت — الخميس، من 9 صباحًا إلى 8 مساءً',

  currency: 'MRU',
  currencyNameAr: 'أوقية',

  social: [
    { key: 'instagram', label: 'إنستغرام', url: 'https://instagram.com/' },
    { key: 'facebook', label: 'فيسبوك', url: 'https://facebook.com/' },
  ],

  externalSites: ['SHEIN', 'Noon', 'Temu', 'Amazon', 'AliExpress', 'موقع آخر'],

  /** الشحن مجاني ابتداءً من هذا المبلغ (أوقية). ضعي null لتعطيل الرسالة. */
  freeShippingFrom: 15000,
};

/** رقم واتساب لم يُضبط بعد؟ نمنع فتح رابط خاطئ ونعرض رسالة واضحة. */
export function isWhatsappConfigured(): boolean {
  return /^[0-9]{8,15}$/.test(storeConfig.whatsappNumber);
}

export const WHATSAPP_NOT_CONFIGURED_MESSAGE =
  'يرجى إعداد رقم WhatsApp الخاص بالمتجر أولًا من الملف src/config/store.ts';
