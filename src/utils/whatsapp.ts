import {
  isWhatsappConfigured,
  storeConfig,
  WHATSAPP_NOT_CONFIGURED_MESSAGE,
} from '@/config/store';
import type { ExternalOrderForm, Product, ResolvedCartItem } from '@/types';
import { formatPrice } from './format';

/**
 * ══════════════════════════════════════════════════════════════
 *  بناء روابط ورسائل واتساب — المكان الوحيد الذي يعرف رقم المتجر
 *  لا تبني رابط wa.me يدويًا في أي مكوّن.
 * ══════════════════════════════════════════════════════════════
 */

const GREETING = `مرحبًا ${storeConfig.name} 🌸`;

/**
 * ينشئ رابط واتساب من نص عربي.
 * encodeURIComponent ضروري: الأحرف العربية والأسطر الجديدة والرموز
 * يجب ترميزها وإلا وصلت الرسالة مبتورة أو مشوّهة.
 */
export function createWhatsAppLink(message: string): string | null {
  if (!isWhatsappConfigured()) return null;
  return `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** يفتح واتساب في تبويب جديد، أو يُرجع رسالة الخطأ إن لم يُضبط الرقم. */
export function openWhatsApp(message: string): { ok: true } | { ok: false; error: string } {
  const url = createWhatsAppLink(message);

  if (!url) {
    return { ok: false, error: WHATSAPP_NOT_CONFIGURED_MESSAGE };
  }

  // noopener/noreferrer يمنع الصفحة الجديدة من الوصول إلى نافذتنا
  window.open(url, '_blank', 'noopener,noreferrer');
  return { ok: true };
}

/** أسطر الخيارات المختارة: «اللون: وردي». */
function optionLines(selectedOptions: Record<string, string>): string[] {
  return Object.entries(selectedOptions)
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => `${label}: ${value}`);
}

/** رسالة طلب منتج واحد من صفحة المنتج أو من بطاقته. */
export function createProductOrderMessage(
  product: Product,
  quantity: number,
  selectedOptions: Record<string, string> = {},
): string {
  const safeQuantity = Math.max(1, Math.round(quantity));
  const total = product.price * safeQuantity;

  const lines: string[] = [
    GREETING,
    '',
    'أرغب في طلب المنتج التالي:',
    '',
    `المنتج: ${product.name}`,
    `السعر: ${formatPrice(product.price)}`,
    `الكمية: ${safeQuantity}`,
    `الإجمالي: ${formatPrice(total)}`,
  ];

  const details = optionLines(selectedOptions);

  // الحجم يُذكر مرة واحدة فقط: نتخطّاه إن كان أصلًا ضمن الخيارات المختارة
  const sizeAlreadyListed = Object.keys(selectedOptions).some(
    (label) => label.trim() === 'الحجم',
  );
  if (product.size && !sizeAlreadyListed) {
    details.push(`الحجم: ${product.size}`);
  }

  if (details.length > 0) {
    lines.push('', ...details);
  }

  lines.push('', 'شكرًا 🌷');

  return lines.join('\n');
}

/** رسالة طلب السلة كاملة. */
export function createCartOrderMessage(items: ResolvedCartItem[], total: number): string {
  const lines: string[] = [GREETING, '', 'أرغب في طلب:', ''];

  items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.product.name}`);
    lines.push(`   الكمية: ${item.quantity}`);
    lines.push(`   السعر: ${formatPrice(item.product.price)}`);
    lines.push(`   الإجمالي: ${formatPrice(item.lineTotal)}`);

    for (const optionLine of optionLines(item.selectedOptions)) {
      lines.push(`   ${optionLine}`);
    }

    lines.push('');
  });

  lines.push('إجمالي الطلب:');
  lines.push(formatPrice(total));
  lines.push('');
  lines.push('سأتواصل معكم لإكمال تفاصيل التوصيل والدفع.');

  return lines.join('\n');
}

/** رسالة طلب منتج من موقع خارجي. */
export function createExternalOrderMessage(form: ExternalOrderForm): string {
  const lines: string[] = [
    GREETING,
    '',
    'أريد طلب منتج من الخارج.',
    '',
    'اسم المنتج:',
    form.productName.trim(),
    '',
    'الموقع:',
    form.site.trim(),
    '',
    'الرابط:',
    form.productUrl.trim(),
    '',
    'الكمية:',
    String(Math.max(1, Math.round(form.quantity))),
  ];

  if (form.color.trim()) {
    lines.push('', 'اللون:', form.color.trim());
  }
  if (form.size.trim()) {
    lines.push('', 'المقاس:', form.size.trim());
  }
  if (form.notes.trim()) {
    lines.push('', 'الملاحظات:', form.notes.trim());
  }

  lines.push('', 'يرجى تزويدي بالسعر النهائي والتفاصيل.');

  return lines.join('\n');
}

/** رسالة تواصل عامة من صفحة «تواصلي معنا» أو الزر العائم. */
export function createContactMessage(customMessage?: string): string {
  if (customMessage && customMessage.trim()) {
    return [GREETING, '', customMessage.trim()].join('\n');
  }
  return [GREETING, '', 'أرغب في الاستفسار عن منتجاتكم.'].join('\n');
}
