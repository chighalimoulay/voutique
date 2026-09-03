import type { BadgeKind } from '@/types';
import { cn } from '@/utils/cn';

const BADGE_LABELS: Record<BadgeKind, string> = {
  new: 'جديد',
  sale: 'خصم',
  bestseller: 'الأكثر مبيعًا',
  limited: 'كمية محدودة',
};

const BADGE_STYLES: Record<BadgeKind, string> = {
  new: 'bg-mauve-500 text-white',
  sale: 'bg-gold text-white',
  bestseller: 'bg-ink text-cream',
  limited: 'bg-softpink-dark text-ink',
};

export function Badge({ kind, className }: { kind: BadgeKind; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none shadow-soft',
        BADGE_STYLES[kind],
        className,
      )}
    >
      {BADGE_LABELS[kind]}
    </span>
  );
}

export function DiscountBadge({ percent, className }: { percent: number; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-semibold leading-none text-white shadow-soft',
        className,
      )}
    >
      <span className="num">−{percent}%</span>
    </span>
  );
}

export function StockBadge({ available }: { available: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        available ? 'bg-emerald-50 text-emerald-700' : 'bg-mauve-100 text-ink-soft',
      )}
    >
      <span
        className={cn('h-1.5 w-1.5 rounded-full', available ? 'bg-emerald-500' : 'bg-ink-muted')}
        aria-hidden="true"
      />
      {available ? 'متوفر' : 'غير متوفر حاليًا'}
    </span>
  );
}

