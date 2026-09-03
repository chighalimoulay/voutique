import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** حوار تأكيد قبل أي إجراء لا يمكن التراجع عنه (حذف عنصر، إفراغ السلة). */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onCancel}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-lift"
          >
            <h2 id="confirm-dialog-title" className="text-lg font-semibold">
              {title}
            </h2>

            {description && (
              <p className="mt-2 text-sm leading-7 text-ink-soft">{description}</p>
            )}

            <div className="mt-6 flex gap-3">
              <Button variant="outline" fullWidth onClick={onCancel}>
                {cancelLabel}
              </Button>
              <Button fullWidth onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
