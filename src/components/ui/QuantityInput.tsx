import { Minus, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  label?: string;
  className?: string;
}

export function QuantityInput({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  label = 'الكمية',
  className,
}: QuantityInputProps) {
  const buttonSize = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const textSize = size === 'sm' ? 'text-sm min-w-[2rem]' : 'text-base min-w-[2.5rem]';

  const clamp = (next: number) => Math.min(Math.max(next, min), max);

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-mauve-200 bg-white p-1',
        className,
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        className={cn(
          buttonSize,
          'flex items-center justify-center rounded-full text-ink-soft transition-colors',
          'hover:bg-mauve-50 hover:text-ink disabled:opacity-40 disabled:hover:bg-transparent',
        )}
        aria-label="إنقاص الكمية"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>

      <span className={cn('num text-center font-semibold tabular-nums', textSize)} aria-live="polite">
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        className={cn(
          buttonSize,
          'flex items-center justify-center rounded-full text-ink-soft transition-colors',
          'hover:bg-mauve-50 hover:text-ink disabled:opacity-40 disabled:hover:bg-transparent',
        )}
        aria-label="زيادة الكمية"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
