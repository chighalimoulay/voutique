import { ImagePlus, Loader2, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useSiteImages } from '@/store/useSiteImages';
import { useToast } from '@/store/useToast';
import { cn } from '@/utils/cn';
import {
  deleteSiteImage,
  removeStoredImages,
  saveSiteImage,
  storagePathFromUrl,
  uploadSiteImage,
} from '../adminApi';
import { prepareImage } from '../imageUtils';

interface SiteImageEditorProps {
  /** مفتاح الصورة في site_images. */
  imageKey: string;
  title: string;
  /** الصورة الأصلية من public/images. */
  defaultSrc: string;
  /** نفس نسبة إطار الصورة في المتجر، لتكون المعاينة مطابقة. */
  aspectClass: string;
}

type Busy = 'preparing' | 'saving' | 'restoring' | null;

function errorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : '';
  if (/row-level security|permission|JWT|Unauthorized/i.test(message)) {
    return 'لا تملكين صلاحية التعديل. سجّلي الخروج ثم الدخول مجددًا.';
  }
  if (/fetch|network/i.test(message)) return 'تعذّر الاتصال. تحققي من الإنترنت ثم حاولي مجددًا.';
  return message || 'حدث خطأ غير متوقع.';
}

export function SiteImageEditor({ imageKey, title, defaultSrc, aspectClass }: SiteImageEditorProps) {
  const { images, refresh } = useSiteImages();
  const { notify } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const [pending, setPending] = useState<{ blob: Blob; preview: string } | null>(null);
  const [busy, setBusy] = useState<Busy>(null);
  const [confirmRestore, setConfirmRestore] = useState(false);

  const customUrl = images[imageKey];
  const isCustom = Boolean(customUrl);
  const shown = pending?.preview ?? customUrl ?? defaultSrc;
  const inputId = `site-image-${imageKey.replace(/[^a-z0-9-]/g, '-')}`;

  // إلغاء رابط المعاينة المؤقت عند استبداله أو مغادرة الصفحة
  useEffect(() => {
    if (!pending) return;
    return () => URL.revokeObjectURL(pending.preview);
  }, [pending]);

  async function handleFile(file: File | undefined) {
    if (inputRef.current) inputRef.current.value = '';
    if (!file) return;

    setBusy('preparing');
    try {
      const blob = await prepareImage(file);
      setPending({ blob, preview: URL.createObjectURL(blob) });
    } catch (error) {
      notify(errorMessage(error), 'error');
    } finally {
      setBusy(null);
    }
  }

  async function handleSave() {
    if (!pending) return;
    setBusy('saving');

    let uploadedPath: string | null = null;
    try {
      const uploaded = await uploadSiteImage(imageKey, pending.blob);
      uploadedPath = uploaded.path;
      await saveSiteImage(imageKey, uploaded.url);
    } catch (error) {
      // فشل الحفظ: نحذف الملف الذي رُفع للتو حتى لا يبقى ملف يتيم
      if (uploadedPath) await removeStoredImages([uploadedPath]).catch(() => undefined);
      notify(errorMessage(error), 'error');
      setBusy(null);
      return;
    }

    // نجح الاستبدال: نحذف الملف المخصّص السابق (الصور الأصلية في public/ لا تُمسّ)
    const previousPath = customUrl ? storagePathFromUrl(customUrl) : null;
    if (previousPath) removeStoredImages([previousPath]).catch(() => undefined);

    await refresh();
    setPending(null);
    setBusy(null);
    notify(`تم حفظ صورة «${title}».`);
  }

  async function handleRestore() {
    setConfirmRestore(false);
    setBusy('restoring');

    try {
      await deleteSiteImage(imageKey);
    } catch (error) {
      notify(errorMessage(error), 'error');
      setBusy(null);
      return;
    }

    const previousPath = customUrl ? storagePathFromUrl(customUrl) : null;
    if (previousPath) removeStoredImages([previousPath]).catch(() => undefined);

    await refresh();
    setBusy(null);
    notify(`عادت «${title}» إلى الصورة الأصلية.`);
  }

  return (
    <div className="card-surface overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <h3 className="text-[15px] font-semibold">{title}</h3>
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium',
            pending
              ? 'bg-gold/15 text-gold-dark'
              : isCustom
                ? 'bg-mauve-50 text-mauve-600'
                : 'bg-cream text-ink-muted',
          )}
        >
          {pending ? 'معاينة — لم تُحفظ بعد' : isCustom ? 'صورة مخصّصة' : 'الصورة الأصلية'}
        </span>
      </div>

      <div className={cn('relative bg-cream', aspectClass)}>
        <img src={shown} alt={title} className="h-full w-full object-cover" />
        {busy && busy !== 'preparing' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loader2 className="h-6 w-6 animate-spin text-mauve-500" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="space-y-2 p-4">
        {pending ? (
          <div className="flex gap-2">
            <Button fullWidth onClick={() => void handleSave()} disabled={busy !== null}>
              {busy === 'saving' ? 'جارٍ الحفظ…' : 'حفظ الصورة'}
            </Button>
            <Button variant="outline" onClick={() => setPending(null)} disabled={busy !== null}>
              إلغاء
            </Button>
          </div>
        ) : (
          <>
            <input
              ref={inputRef}
              id={inputId}
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={busy !== null}
              onChange={(event) => void handleFile(event.target.files?.[0])}
            />
            <label
              htmlFor={inputId}
              className={cn(
                'flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-mauve-300 text-[15px] font-medium text-ink transition-colors hover:border-mauve-500 hover:bg-mauve-50',
                busy !== null && 'pointer-events-none opacity-50',
              )}
            >
              {busy === 'preparing' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  جارٍ تجهيز الصورة…
                </>
              ) : (
                <>
                  <ImagePlus className="h-4 w-4" aria-hidden="true" />
                  تغيير الصورة
                </>
              )}
            </label>

            {isCustom && (
              <button
                type="button"
                onClick={() => setConfirmRestore(true)}
                disabled={busy !== null}
                className="flex w-full items-center justify-center gap-1.5 py-1.5 text-sm text-ink-soft transition-colors hover:text-ink disabled:opacity-50"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                {busy === 'restoring' ? 'جارٍ الاستعادة…' : 'استعادة الصورة الأصلية'}
              </button>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={confirmRestore}
        title={`استعادة الصورة الأصلية لـ «${title}»؟`}
        description="ستُحذف الصورة المخصّصة الحالية ويعود المتجر لعرض الصورة الأصلية."
        confirmLabel="نعم، استعيديها"
        onConfirm={() => void handleRestore()}
        onCancel={() => setConfirmRestore(false)}
      />
    </div>
  );
}
