import { ImagePlus, Loader2, Star, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { prepareImage } from '../imageUtils';
import type { ImageItem } from '../types';
import { cn } from '@/utils/cn';

interface ImageManagerProps {
  items: ImageItem[];
  onChange: (items: ImageItem[]) => void;
  onError: (message: string) => void;
  disabled?: boolean;
}

let keySeed = 0;
const nextKey = () => `img-${Date.now()}-${keySeed++}`;

/**
 * صور المنتج: الأولى هي الصورة الرئيسية (تظهر في البطاقة).
 * الصور الجديدة تُضغط فورًا عند اختيارها، وتُرفع فقط عند «حفظ المنتج».
 */
export function ImageManager({ items, onChange, onError, disabled }: ImageManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(0);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    setProcessing(files.length);

    const added: ImageItem[] = [];
    for (const file of files) {
      try {
        const blob = await prepareImage(file);
        added.push({ key: nextKey(), kind: 'new', blob, preview: URL.createObjectURL(blob) });
      } catch (error) {
        onError(error instanceof Error ? error.message : 'تعذّر تجهيز الصورة.');
      } finally {
        setProcessing((count) => count - 1);
      }
    }

    if (added.length > 0) onChange([...items, ...added]);
    // يسمح باختيار نفس الصورة مرة أخرى بعد حذفها
    if (inputRef.current) inputRef.current.value = '';
  }

  function remove(key: string) {
    const target = items.find((item) => item.key === key);
    if (target?.kind === 'new') URL.revokeObjectURL(target.preview);
    onChange(items.filter((item) => item.key !== key));
  }

  function makeMain(key: string) {
    const target = items.find((item) => item.key === key);
    if (!target) return;
    onChange([target, ...items.filter((item) => item.key !== key)]);
  }

  return (
    <div>
      {items.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item, index) => {
            const src = item.kind === 'new' ? item.preview : item.url;
            const isMain = index === 0;

            return (
              <li
                key={item.key}
                className={cn(
                  'overflow-hidden rounded-2xl border bg-white',
                  isMain ? 'border-mauve-400 ring-2 ring-mauve-200' : 'border-mauve-100',
                )}
              >
                <div className="relative aspect-square bg-cream">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  {isMain && (
                    <span className="absolute start-2 top-2 rounded-full bg-mauve-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-soft">
                      الصورة الرئيسية
                    </span>
                  )}
                  {item.kind === 'new' && (
                    <span className="absolute bottom-2 start-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] text-ink-soft">
                      لم تُرفع بعد
                    </span>
                  )}
                </div>

                <div className="flex divide-x divide-x-reverse divide-mauve-100 border-t border-mauve-100">
                  {!isMain && (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => makeMain(item.key)}
                      className="flex flex-1 items-center justify-center gap-1 py-2.5 text-xs text-ink-soft transition-colors hover:bg-mauve-50 hover:text-ink disabled:opacity-50"
                    >
                      <Star className="h-3.5 w-3.5" aria-hidden="true" />
                      رئيسية
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => remove(item.key)}
                    aria-label="حذف الصورة"
                    className="flex flex-1 items-center justify-center gap-1 py-2.5 text-xs text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    حذف
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        id="product-images-input"
        disabled={disabled || processing > 0}
        onChange={(event) => void handleFiles(event.target.files)}
      />
      <label
        htmlFor="product-images-input"
        className={cn(
          'mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-mauve-200 bg-white px-4 py-5 text-[15px] font-medium text-mauve-600 transition-colors hover:border-mauve-400 hover:bg-mauve-50',
          (disabled || processing > 0) && 'pointer-events-none opacity-60',
        )}
      >
        {processing > 0 ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            جارٍ تجهيز الصور…
          </>
        ) : (
          <>
            <ImagePlus className="h-5 w-5" aria-hidden="true" />
            {items.length === 0 ? 'إضافة صور' : 'إضافة صور أخرى'}
          </>
        )}
      </label>
      <p className="mt-2 text-xs text-ink-muted">
        يمكنك اختيار عدة صور مرة واحدة. الصورة الأولى تظهر في بطاقة المنتج.
      </p>
    </div>
  );
}
