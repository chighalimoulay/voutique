import { ChevronLeft, ChevronRight, Loader2, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { storeConfig } from '@/config/store';
import { useToast } from '@/store/useToast';
import { cn } from '@/utils/cn';
import { formatNumber, formatPrice } from '@/utils/format';
import { parsePrice } from '../productFormUtils';
import {
  capitalOf,
  createSale,
  deleteSale,
  fetchSalesForMonth,
  monthKey,
  monthOf,
  parseMonthKey,
  sameMonth,
  shiftMonth,
  summarize,
  todayISO,
  updateSale,
  validateSaleDraft,
  type Sale,
  type SaleDraft,
  type SaleDraftErrors,
  type SalesMonth,
} from '../salesApi';

const monthLabelFormatter = new Intl.DateTimeFormat('ar-u-nu-latn', { month: 'long', year: 'numeric' });

function monthLabel({ year, month }: SalesMonth): string {
  return monthLabelFormatter.format(new Date(year, month - 1, 1));
}

/** «2026-10-27» → «27/10/2026». */
function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

/** يعزل نصًا لاتينيًا («500 MRU») داخل جملة عربية حتى لا ينقلب ترتيبه. */
function ltr(text: string): string {
  return `⁦${text}⁩`;
}

function emptyDraft(): SaleDraft {
  return { date: todayISO(), amount: '', profit: '' };
}

function errorMessage(error: unknown): string {
  return error instanceof Error && error.message ? error.message : 'حدث خطأ، أعيدي المحاولة.';
}

/**
 * «المبيعات والأرباح»: تسجيل عمليات البيع وملخص كل شهر على حدة.
 * رأس المال = سعر البيع − الربح، والإجماليات تُحسب من سجلات الشهر المعروض فقط.
 */
export function SalesPage() {
  const { notify } = useToast();
  const [month, setMonth] = useState<SalesMonth>(() => monthOf(todayISO()));
  const [sales, setSales] = useState<Sale[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [draft, setDraft] = useState<SaleDraft>(emptyDraft);
  const [errors, setErrors] = useState<SaleDraftErrors>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Sale | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  // يمنع ردًّا قديمًا (شهر سابق) من الكتابة فوق الشهر المعروض حاليًا
  const requestRef = useRef(0);

  const load = useCallback(async (target: SalesMonth) => {
    const request = ++requestRef.current;
    setLoadError(false);
    try {
      const rows = await fetchSalesForMonth(target);
      if (request === requestRef.current) setSales(rows);
    } catch {
      if (request === requestRef.current) setLoadError(true);
    }
  }, []);

  useEffect(() => {
    setSales(null);
    void load(month);
  }, [month, load]);

  const summary = useMemo(() => summarize(sales ?? []), [sales]);

  const draftCapital = useMemo(() => {
    const amount = parsePrice(draft.amount);
    const profit = parsePrice(draft.profit);
    if (amount === null || profit === null || Number.isNaN(amount) || Number.isNaN(profit)) return null;
    if (profit > amount) return null;
    return capitalOf({ amount, profit });
  }, [draft.amount, draft.profit]);

  const isCurrentMonth = sameMonth(month, monthOf(todayISO()));

  function update<K extends keyof SaleDraft>(key: K, value: SaleDraft[K]) {
    setDraft((previous) => ({ ...previous, [key]: value }));
    if (key in errors) setErrors((previous) => ({ ...previous, [key]: undefined }));
  }

  function resetForm() {
    setDraft(emptyDraft());
    setErrors({});
    setEditingId(null);
  }

  function startEdit(sale: Sale) {
    setEditingId(sale.id);
    setDraft({ date: sale.date, amount: String(sale.amount), profit: String(sale.profit) });
    setErrors({});
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = validateSaleDraft(draft);
    if (result.errors) {
      setErrors(result.errors);
      return;
    }

    setSaving(true);
    try {
      if (editingId) await updateSale(editingId, result.input);
      else await createSale(result.input);

      notify(editingId ? 'تم تعديل العملية.' : 'تم تسجيل العملية.');
      resetForm();

      // نعرض شهر العملية المحفوظة، ونعيد الجلب ليطابق الملخص قاعدة البيانات
      const savedMonth = monthOf(result.input.date);
      if (sameMonth(savedMonth, month)) await load(month);
      else setMonth(savedMonth);
    } catch (error) {
      notify(errorMessage(error), 'error');
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    const sale = pendingDelete;
    if (!sale) return;
    setPendingDelete(null);
    setDeletingId(sale.id);
    try {
      await deleteSale(sale.id);
      if (editingId === sale.id) resetForm();
      notify('تم حذف العملية.');
      await load(month);
    } catch (error) {
      notify(errorMessage(error), 'error');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold">المبيعات والأرباح</h1>
        <p className="mt-1 text-sm text-ink-muted">رأس المال = سعر البيع − الربح، ويُحسب تلقائيًا لكل عملية.</p>
      </div>

      {/* محدد الشهر */}
      <div className="card-surface flex items-center gap-2 p-2">
        <button
          type="button"
          onClick={() => setMonth((current) => shiftMonth(current, -1))}
          aria-label="الشهر السابق"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-mauve-50 hover:text-ink"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex min-w-0 flex-1 flex-col items-center">
          <span className="text-base font-semibold">{monthLabel(month)}</span>
          <input
            type="month"
            value={monthKey(month)}
            onChange={(event) => {
              const next = parseMonthKey(event.target.value);
              if (next) setMonth(next);
            }}
            aria-label="اختيار الشهر والسنة"
            className="num mt-0.5 bg-transparent text-xs text-ink-muted outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => setMonth((current) => shiftMonth(current, 1))}
          aria-label="الشهر التالي"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-mauve-50 hover:text-ink"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {!isCurrentMonth && (
        <div className="-mt-3 text-center">
          <button
            type="button"
            onClick={() => setMonth(monthOf(todayISO()))}
            className="text-sm font-medium text-mauve-600 hover:underline"
          >
            العودة إلى الشهر الحالي
          </button>
        </div>
      )}

      {/* الملخص */}
      <section aria-label={`ملخص ${monthLabel(month)}`} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard label="إجمالي المبيعات" value={sales ? formatPrice(summary.total) : null} testId="total" />
        <SummaryCard label="إجمالي رأس المال" value={sales ? formatPrice(summary.capital) : null} testId="capital" />
        <SummaryCard
          label="إجمالي الأرباح"
          value={sales ? formatPrice(summary.profit) : null}
          testId="profit"
          highlight
        />
        <SummaryCard label="عدد عمليات البيع" value={sales ? String(summary.count) : null} testId="count" />
      </section>

      {/* نموذج الإدخال / التعديل */}
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="card-surface scroll-mt-32 space-y-4 p-4">
        <h2 className="text-lg font-semibold">{editingId ? 'تعديل عملية بيع' : 'تسجيل عملية بيع'}</h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="تاريخ البيع" htmlFor="sale-date" error={errors.date}>
            <input
              id="sale-date"
              type="date"
              value={draft.date}
              onChange={(event) => update('date', event.target.value)}
              disabled={saving}
              className={cn('field-input num w-full', errors.date && 'border-red-400')}
            />
          </Field>
          <Field label="سعر البيع" htmlFor="sale-amount" error={errors.amount}>
            <AmountInput
              id="sale-amount"
              value={draft.amount}
              onChange={(value) => update('amount', value)}
              disabled={saving}
              invalid={Boolean(errors.amount)}
            />
          </Field>
          <Field label="الربح" htmlFor="sale-profit" error={errors.profit}>
            <AmountInput
              id="sale-profit"
              value={draft.profit}
              onChange={(value) => update('profit', value)}
              disabled={saving}
              invalid={Boolean(errors.profit)}
            />
          </Field>
        </div>

        <p className="rounded-xl bg-mauve-50 px-4 py-2.5 text-sm text-ink-soft" aria-live="polite">
          رأس المال:{' '}
          <span className="num font-semibold text-ink" data-testid="draft-capital">
            {draftCapital === null ? '—' : formatPrice(draftCapital)}
          </span>
        </p>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="flex-1 sm:flex-none">
            {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {editingId ? 'حفظ التعديل' : 'تسجيل العملية'}
          </Button>
          {editingId && (
            <Button variant="outline" onClick={resetForm} disabled={saving}>
              إلغاء
            </Button>
          )}
        </div>
      </form>

      {/* سجل العمليات */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold">عمليات {monthLabel(month)}</h2>
          <span className="text-xs text-ink-muted">المبالغ بـ {storeConfig.currency}</span>
        </div>

        {loadError ? (
          <div className="card-surface p-6 text-center text-sm text-ink-soft">
            تعذّر تحميل العمليات. تحققي من الاتصال.
            <div className="mt-3">
              <Button variant="outline" size="sm" onClick={() => void load(month)}>
                إعادة المحاولة
              </Button>
            </div>
          </div>
        ) : !sales ? (
          <div className="flex justify-center py-10" role="status">
            <Loader2 className="h-6 w-6 animate-spin text-mauve-500" aria-hidden="true" />
            <span className="sr-only">جارٍ التحميل…</span>
          </div>
        ) : sales.length === 0 ? (
          <p className="card-surface p-6 text-center text-sm text-ink-muted">لا توجد عمليات مسجلة في هذا الشهر.</p>
        ) : (
          <div className="card-surface overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-mauve-100 text-ink-muted">
                  <th className="px-2.5 py-2.5 text-start font-medium sm:px-3">التاريخ</th>
                  <th className="px-2.5 py-2.5 text-start font-medium sm:px-3">سعر البيع</th>
                  <th className="px-2.5 py-2.5 text-start font-medium sm:px-3">رأس المال</th>
                  <th className="px-2.5 py-2.5 text-start font-medium sm:px-3">الربح</th>
                  <th className="px-2.5 py-2.5 sm:px-3">
                    <span className="sr-only">إجراءات</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr
                    key={sale.id}
                    className={cn(
                      'border-b border-mauve-50 last:border-0',
                      editingId === sale.id && 'bg-mauve-50/60',
                    )}
                  >
                    <td className="whitespace-nowrap px-2.5 py-2.5 sm:px-3">
                      <span className="num">{formatDate(sale.date)}</span>
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-2.5 sm:px-3">
                      <span className="num">{formatNumber(sale.amount)}</span>
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-2.5 sm:px-3">
                      <span className="num">{formatNumber(capitalOf(sale))}</span>
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-2.5 sm:px-3 font-medium text-mauve-600">
                      <span className="num">{formatNumber(sale.profit)}</span>
                    </td>
                    <td className="whitespace-nowrap px-2 py-1.5">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(sale)}
                          disabled={deletingId === sale.id}
                          aria-label={`تعديل عملية ${formatDate(sale.date)}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-mauve-50 hover:text-ink disabled:opacity-50"
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(sale)}
                          disabled={deletingId === sale.id}
                          aria-label={`حذف عملية ${formatDate(sale.date)}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        >
                          {deletingId === sale.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          ) : (
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="حذف عملية البيع؟"
        description={
          pendingDelete
            ? `عملية ${ltr(formatDate(pendingDelete.date))} بسعر ${ltr(formatPrice(pendingDelete.amount))}. لا يمكن التراجع عن الحذف.`
            : undefined
        }
        confirmLabel="حذف"
        onConfirm={() => void confirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  testId,
  highlight,
}: {
  label: string;
  value: string | null;
  testId: string;
  highlight?: boolean;
}) {
  return (
    <div className="card-surface p-4">
      <p className="text-xs font-medium text-ink-muted">{label}</p>
      {value === null ? (
        <div className="skeleton mt-2 h-6 w-20" aria-hidden="true" />
      ) : (
        <p
          className={cn('num mt-1.5 text-lg font-bold', highlight ? 'text-mauve-600' : 'text-ink')}
          data-testid={`summary-${testId}`}
        >
          {value}
        </p>
      )}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label">
        {label}
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

function AmountInput({
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
