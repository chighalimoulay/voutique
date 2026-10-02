import { ChevronDown, ChevronRight, ExternalLink, Loader2, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { storeConfig } from '@/config/store';
import { categories } from '@/data/categories';
import { useCatalog } from '@/store/useCatalog';
import { useToast } from '@/store/useToast';
import type { AdminProduct, BadgeKind, Gender } from '@/types';
import { cn } from '@/utils/cn';
import {
  createProduct,
  deleteProduct,
  fetchAdminProduct,
  isSlugTaken,
  nextSortOrder,
  removeStoredImages,
  storagePathFromUrl,
  updateProduct,
  uploadProductImage,
} from '../adminApi';
import { ImageManager } from '../components/ImageManager';
import { OptionsEditor } from '../components/OptionsEditor';
import { Toggle } from '../components/Toggle';
import {
  draftFromProduct,
  emptyDraft,
  newProductId,
  productFromDraft,
  slugify,
  suggestSlug,
  validateDraft,
  type DraftErrors,
  type ProductDraft,
} from '../productFormUtils';
import type { ImageItem } from '../types';

const GENDERS: Array<{ value: Gender; label: string }> = [
  { value: 'women', label: 'نسائي' },
  { value: 'men', label: 'رجالي' },
  { value: 'unisex', label: 'للجنسين' },
];

const BADGES: Array<{ value: BadgeKind | ''; label: string }> = [
  { value: '', label: 'بدون شارة' },
  { value: 'new', label: 'جديد' },
  { value: 'sale', label: 'خصم' },
  { value: 'bestseller', label: 'الأكثر مبيعًا' },
  { value: 'limited', label: 'كمية محدودة' },
];

function imagesFromProduct(product: AdminProduct): ImageItem[] {
  const urls = product.images && product.images.length > 0 ? product.images : product.image ? [product.image] : [];
  return urls.map((url, index) => ({ key: `existing-${index}`, kind: 'existing', url }));
}

function existingUrls(items: ImageItem[]): string[] {
  return items.flatMap((item) => (item.kind === 'existing' ? [item.url] : []));
}

function errorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : '';
  if (/duplicate key|products_slug_key/i.test(message)) return 'رابط المنتج مستخدم لمنتج آخر.';
  if (/row-level security|permission|JWT/i.test(message)) {
    return 'لا تملكين صلاحية الحفظ. سجّلي الخروج ثم الدخول مجددًا.';
  }
  if (/fetch|network/i.test(message)) return 'تعذّر الاتصال. تحققي من الإنترنت ثم حاولي مجددًا.';
  return message || 'حدث خطأ غير متوقع.';
}

export function ProductFormPage() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { refresh: refreshStore } = useCatalog();
  const { notify } = useToast();

  const [original, setOriginal] = useState<AdminProduct | null>(null);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'missing' | 'error'>(
    isNew ? 'ready' : 'loading',
  );
  const [draft, setDraft] = useState<ProductDraft>(() => emptyDraft(categories[0]?.slug ?? ''));
  const [images, setImages] = useState<ImageItem[]>([]);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [saving, setSaving] = useState(false);
  const [saveStep, setSaveStep] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // إلغاء روابط المعاينة المؤقتة عند مغادرة الصفحة
  const imagesRef = useRef(images);
  imagesRef.current = images;
  useEffect(
    () => () => {
      for (const item of imagesRef.current) {
        if (item.kind === 'new') URL.revokeObjectURL(item.preview);
      }
    },
    [],
  );

  useEffect(() => {
    if (isNew || !id) return;
    let cancelled = false;

    fetchAdminProduct(id)
      .then((product) => {
        if (cancelled) return;
        if (!product) {
          setLoadState('missing');
          return;
        }
        setOriginal(product);
        setDraft(draftFromProduct(product));
        setImages(imagesFromProduct(product));
        setLoadState('ready');
      })
      .catch(() => {
        if (!cancelled) setLoadState('error');
      });

    return () => {
      cancelled = true;
    };
  }, [id, isNew]);

  function set<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setDraft((previous) => ({ ...previous, [key]: value }));
    if (key in errors) setErrors((previous) => ({ ...previous, [key]: undefined }));
  }

  async function uniqueSlug(base: string, exceptId?: string): Promise<string> {
    let candidate = base;
    for (let attempt = 2; await isSlugTaken(candidate, exceptId); attempt++) {
      candidate = `${base}-${attempt}`;
    }
    return candidate;
  }

  async function handleSave() {
    // منتج جديد بلا رابط مكتوب يدويًا: نقترح رابطًا من الاسم
    const working: ProductDraft =
      isNew && !slugTouched ? { ...draft, slug: suggestSlug(draft.name, draft.brand) } : draft;

    const found = validateDraft(working);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      if (found.slug) setShowMore(true);
      notify('راجعي الحقول المظللة باللون الأحمر.', 'error');
      return;
    }

    setSaving(true);
    const productId = original?.id ?? newProductId();
    const uploadedPaths: string[] = [];

    try {
      setSaveStep('التحقق من الرابط…');
      const slug = await uniqueSlug(working.slug, original?.id);

      const urls: string[] = [];
      const newCount = images.filter((item) => item.kind === 'new').length;
      let uploaded = 0;

      for (const item of images) {
        if (item.kind === 'existing') {
          urls.push(item.url);
          continue;
        }
        uploaded += 1;
        setSaveStep(`رفع الصور (${uploaded} من ${newCount})…`);
        const result = await uploadProductImage(productId, item.blob);
        uploadedPaths.push(result.path);
        urls.push(result.url);
      }

      setSaveStep('حفظ المنتج…');
      const sortOrder = original?.sortOrder ?? (await nextSortOrder());
      const product = productFromDraft({ ...working, slug }, { id: productId, sortOrder, imageUrls: urls });
      const saved = isNew ? await createProduct(product) : await updateProduct(product);

      // الصور التي حذفتها المالكة من منتج محفوظ: نزيلها من المخزن بعد نجاح الحفظ
      // (الصور الثابتة في /images/products لا تُمسّ أبدًا)
      const previousUrls = original ? existingUrls(imagesFromProduct(original)) : [];
      const removedPaths = previousUrls
        .filter((url) => !urls.includes(url))
        .map(storagePathFromUrl)
        .filter((path): path is string => Boolean(path));
      if (removedPaths.length > 0) {
        removeStoredImages(removedPaths).catch(() => {
          // تبقى الصور اليتيمة في المخزن دون أثر على المتجر — لا نزعج المالكة
        });
      }

      for (const item of images) {
        if (item.kind === 'new') URL.revokeObjectURL(item.preview);
      }
      imagesRef.current = [];

      await refreshStore();
      notify(isNew ? `تمت إضافة «${saved.name}».` : `تم حفظ «${saved.name}».`);
      navigate('/admin', { replace: true });
    } catch (error) {
      // فشل الحفظ: نحذف الصور التي رُفعت في هذه المحاولة حتى لا تبقى ملفات يتيمة
      if (uploadedPaths.length > 0) {
        await removeStoredImages(uploadedPaths).catch(() => undefined);
      }
      notify(errorMessage(error), 'error');
      setSaving(false);
      setSaveStep('');
    }
  }

  async function handleDelete() {
    if (!original) return;
    setConfirmDelete(false);
    setDeleting(true);

    try {
      await deleteProduct(original.id);

      const paths = existingUrls(imagesFromProduct(original))
        .map(storagePathFromUrl)
        .filter((path): path is string => Boolean(path));
      if (paths.length > 0) removeStoredImages(paths).catch(() => undefined);

      await refreshStore();
      notify(`تم حذف «${original.name}».`);
      navigate('/admin', { replace: true });
    } catch (error) {
      notify(errorMessage(error), 'error');
      setDeleting(false);
    }
  }

  if (loadState === 'loading') {
    return (
      <div className="flex justify-center py-20" role="status">
        <Loader2 className="h-6 w-6 animate-spin text-mauve-500" aria-hidden="true" />
        <span className="sr-only">جارٍ التحميل…</span>
      </div>
    );
  }

  if (loadState === 'missing' || loadState === 'error') {
    return (
      <div className="card-surface p-6 text-center">
        <p className="text-sm text-ink-soft">
          {loadState === 'missing' ? 'هذا المنتج غير موجود. ربما حُذف.' : 'تعذّر تحميل المنتج.'}
        </p>
        <Link to="/admin" className="mt-3 inline-block text-sm font-medium text-mauve-600">
          العودة إلى المنتجات
        </Link>
      </div>
    );
  }

  const busy = saving || deleting;

  return (
    <div className="pb-28">
      <Link
        to="/admin"
        className="mb-3 inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
        المنتجات
      </Link>

      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{isNew ? 'إضافة منتج' : 'تعديل المنتج'}</h1>
        {original?.published && (
          <a
            href={`/product/${original.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-mauve-600"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            عرض في المتجر
          </a>
        )}
      </div>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void handleSave();
        }}
        className="space-y-4"
      >
        <Section title="المعلومات الأساسية">
          <Field label="اسم المنتج" htmlFor="name" error={errors.name}>
            <input
              id="name"
              value={draft.name}
              onChange={(event) => set('name', event.target.value)}
              disabled={busy}
              className={cn('field-input', errors.name && 'border-red-400')}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="السعر" htmlFor="price" error={errors.price}>
              <PriceInput
                id="price"
                value={draft.price}
                onChange={(value) => set('price', value)}
                disabled={busy}
                invalid={Boolean(errors.price)}
              />
            </Field>
            <Field label="السعر القديم" hint="اختياري" htmlFor="oldPrice" error={errors.oldPrice}>
              <PriceInput
                id="oldPrice"
                value={draft.oldPrice}
                onChange={(value) => set('oldPrice', value)}
                disabled={busy}
                invalid={Boolean(errors.oldPrice)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="التصنيف" htmlFor="category">
              <select
                id="category"
                value={draft.category}
                onChange={(event) => set('category', event.target.value)}
                disabled={busy}
                className="field-input"
              >
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="الجنس" htmlFor="gender">
              <select
                id="gender"
                value={draft.gender}
                onChange={(event) => set('gender', event.target.value as Gender)}
                disabled={busy}
                className="field-input"
              >
                {GENDERS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="الوصف" htmlFor="description" error={errors.description}>
            <textarea
              id="description"
              rows={4}
              value={draft.description}
              onChange={(event) => set('description', event.target.value)}
              disabled={busy}
              className={cn('field-input resize-y leading-7', errors.description && 'border-red-400')}
            />
          </Field>
        </Section>

        <Section title="صور المنتج">
          <ImageManager
            items={images}
            onChange={setImages}
            onError={(message) => notify(message, 'error')}
            disabled={busy}
          />
        </Section>

        <Section title="الظهور في المتجر">
          <div className="divide-y divide-mauve-100">
            <Toggle
              label="ظاهر في المتجر"
              hint="أوقفيه لإخفاء المنتج تمامًا دون حذفه."
              checked={draft.published}
              onChange={(value) => set('published', value)}
              disabled={busy}
            />
            <Toggle
              label="متوفر للطلب"
              hint="عند الإيقاف يبقى ظاهرًا مع «غير متوفر حاليًا»."
              checked={draft.available}
              onChange={(value) => set('available', value)}
              disabled={busy}
            />
            <Toggle
              label="منتج مختار"
              hint="يظهر في «منتجات مختارة لكِ» على الصفحة الرئيسية."
              checked={draft.featured}
              onChange={(value) => set('featured', value)}
              disabled={busy}
            />
            <Toggle
              label="الأكثر مبيعًا"
              hint="يظهر في قسم «الأكثر مبيعًا»."
              checked={draft.bestSeller}
              onChange={(value) => set('bestSeller', value)}
              disabled={busy}
            />
          </div>

          <Field label="شارة على الصورة" htmlFor="badge">
            <select
              id="badge"
              value={draft.badge}
              onChange={(event) => set('badge', event.target.value as BadgeKind | '')}
              disabled={busy}
              className="field-input"
            >
              {BADGES.map((option) => (
                <option key={option.value || 'none'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        </Section>

        <Section title="المقاسات والألوان" hint="اختياري — تختار منها العميلة قبل الطلب.">
          <OptionsEditor options={draft.options} onChange={(value) => set('options', value)} disabled={busy} />
        </Section>

        <div className="card-surface">
          <button
            type="button"
            onClick={() => setShowMore((value) => !value)}
            aria-expanded={showMore}
            className="flex w-full items-center justify-between px-5 py-4 text-[15px] font-semibold"
          >
            تفاصيل إضافية
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', showMore && 'rotate-180')}
              aria-hidden="true"
            />
          </button>

          {showMore && (
            <div className="space-y-4 border-t border-mauve-100 px-5 pb-5 pt-4">
              <Field label="سطر قصير للبطاقة" hint="اختياري — يُؤخذ من الوصف إن تُرك فارغًا" htmlFor="short">
                <input
                  id="short"
                  value={draft.shortDescription}
                  onChange={(event) => set('shortDescription', event.target.value)}
                  disabled={busy}
                  className="field-input"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="الماركة" htmlFor="brand">
                  <input
                    id="brand"
                    value={draft.brand}
                    onChange={(event) => set('brand', event.target.value)}
                    disabled={busy}
                    className="field-input"
                  />
                </Field>
                <Field label="الحجم / السعة" hint="مثل: 100 مل" htmlFor="size">
                  <input
                    id="size"
                    value={draft.size}
                    onChange={(event) => set('size', event.target.value)}
                    disabled={busy}
                    className="field-input"
                  />
                </Field>
              </div>

              <Field label="المكونات" htmlFor="ingredients">
                <textarea
                  id="ingredients"
                  rows={2}
                  value={draft.ingredients}
                  onChange={(event) => set('ingredients', event.target.value)}
                  disabled={busy}
                  className="field-input resize-y"
                />
              </Field>

              <Field
                label="رابط المنتج"
                hint={
                  isNew
                    ? 'يُنشأ تلقائيًا من الاسم. غيّريه فقط إن أردتِ رابطًا محددًا.'
                    : '⚠ تغييره يكسر أي رابط قديم شاركتِه لهذا المنتج.'
                }
                htmlFor="slug"
                error={errors.slug}
              >
                <div className="flex items-center overflow-hidden rounded-xl border border-mauve-200 bg-white" dir="ltr">
                  <span className="shrink-0 bg-cream px-3 py-2.5 text-sm text-ink-muted">/product/</span>
                  <input
                    id="slug"
                    value={isNew && !slugTouched ? '' : draft.slug}
                    placeholder={isNew ? slugify(draft.name) || 'يُنشأ تلقائيًا عند الحفظ' : ''}
                    onChange={(event) => {
                      setSlugTouched(true);
                      set('slug', event.target.value.toLowerCase().trim());
                    }}
                    disabled={busy}
                    className="min-w-0 flex-1 px-3 py-2.5 text-[15px] outline-none"
                  />
                </div>
              </Field>
            </div>
          )}
        </div>

        {!isNew && original && (
          <div className="card-surface border-red-100 p-5">
            <h2 className="text-[15px] font-semibold text-red-700">حذف المنتج</h2>
            <p className="mt-1 text-sm leading-7 text-ink-soft">
              الحذف نهائي ولا يمكن التراجع عنه. لإيقاف المنتج مؤقتًا، أوقفي «ظاهر في المتجر» بدلًا من حذفه.
            </p>
            <Button
              variant="outline"
              className="mt-3 border-red-200 text-red-600 hover:border-red-400 hover:bg-red-50"
              onClick={() => setConfirmDelete(true)}
              disabled={busy}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              حذف المنتج نهائيًا
            </Button>
          </div>
        )}

        {/* شريط الحفظ ثابت أسفل الشاشة */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-mauve-100 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center gap-3 p-3">
            <Button type="submit" size="lg" fullWidth disabled={busy}>
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  {saveStep || 'جارٍ الحفظ…'}
                </>
              ) : (
                'حفظ المنتج'
              )}
            </Button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={confirmDelete}
        title={`حذف «${original?.name ?? ''}»؟`}
        description="سيُحذف المنتج وصوره المرفوعة نهائيًا، ولن يظهر في المتجر بعد الآن."
        confirmLabel="نعم، احذفيه"
        onConfirm={() => void handleDelete()}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="card-surface space-y-4 p-5">
      <div>
        <h2 className="text-[15px] font-semibold">{title}</h2>
        {hint && <p className="mt-0.5 text-xs text-ink-muted">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  htmlFor,
  error,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label">
        {label}
        {hint && <span className="ms-1.5 text-xs font-normal text-ink-muted">({hint})</span>}
      </label>
      {children}
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function PriceInput({
  id,
  value,
  onChange,
  disabled,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center overflow-hidden rounded-xl border bg-white',
        invalid ? 'border-red-400' : 'border-mauve-200',
      )}
    >
      <input
        id={id}
        inputMode="numeric"
        autoComplete="off"
        dir="ltr"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="num min-w-0 flex-1 px-3 py-2.5 text-[15px] outline-none"
      />
      <span className="shrink-0 px-3 text-sm text-ink-muted">{storeConfig.currency}</span>
    </div>
  );
}
