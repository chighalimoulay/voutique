import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useToast } from '@/store/useToast';
import { cn } from '@/utils/cn';

const STYLES = {
  success: {
    box: 'bg-white border-mauve-200 text-ink',
    icon: 'text-mauve-600',
    Icon: CheckCircle2,
  },
  error: {
    box: 'bg-white border-red-200 text-ink',
    icon: 'text-red-500',
    Icon: XCircle,
  },
  info: {
    box: 'bg-white border-gold-light text-ink',
    icon: 'text-gold-dark',
    Icon: Info,
  },
} as const;

export function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-3 z-[100] flex flex-col items-center gap-2 px-4 sm:top-5"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const style = STYLES[toast.kind];
          const Icon = style.Icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border px-4 py-3 shadow-card',
                style.box,
              )}
            >
              <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', style.icon)} aria-hidden="true" />
              <p className="flex-1 text-sm leading-6">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="rounded-lg p-1 text-ink-muted transition-colors hover:bg-cream hover:text-ink"
                aria-label="إغلاق التنبيه"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
