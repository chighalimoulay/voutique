import { cn } from '@/utils/cn';

interface ToggleProps {
  label: string;
  /** سطر توضيحي صغير تحت العنوان. */
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/** مفتاح تشغيل/إيقاف كبير يسهل لمسه على الهاتف. */
export function Toggle({ label, hint, checked, onChange, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl px-1 py-2.5 text-start disabled:opacity-60"
    >
      <span>
        <span className="block text-[15px] font-medium text-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-ink-muted">{hint}</span>}
      </span>

      <span
        aria-hidden="true"
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300',
          checked ? 'bg-mauve-500' : 'bg-mauve-100',
        )}
      >
        <span
          className={cn(
            'absolute top-1 h-5 w-5 rounded-full bg-white shadow-soft transition-all duration-300',
            checked ? 'start-6' : 'start-1',
          )}
        />
      </span>
    </button>
  );
}
