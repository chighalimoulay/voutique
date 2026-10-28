import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { parsePrice } from './productFormUtils';

/**
 * ══════════════════════════════════════════════════════════════════
 *  سجل المبيعات: الحسابات (دوال نقية) + عمليات جدول public.sales.
 *
 *  رأس المال = سعر البيع − الربح، ويُحسب دائمًا من السجل ولا يُخزَّن.
 *  الصلاحيات تُفرض في Supabase (RLS + is_admin()) كبقية لوحة الإدارة.
 * ══════════════════════════════════════════════════════════════════
 */

export const SALES_TABLE = 'sales';

export interface Sale {
  id: string;
  /** تاريخ البيع «YYYY-MM-DD». */
  date: string;
  /** سعر البيع: المبلغ الإجمالي الذي دفعه العميل. */
  amount: number;
  profit: number;
}

export type SaleInput = Omit<Sale, 'id'>;

/** شهر محدد؛ month من 1 إلى 12. */
export interface SalesMonth {
  year: number;
  month: number;
}

// ─── التواريخ والأشهر ────────────────────────────────────────────────

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function toISODate(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

/** تاريخ اليوم بالتوقيت المحلي (toISOString يعطي تاريخ UTC وقد يختلف). */
export function todayISO(now: Date = new Date()): string {
  return toISODate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function isValidISODate(value: string): boolean {
  const match = DATE_PATTERN.exec(value);
  if (!match) return false;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function monthOf(isoDate: string): SalesMonth {
  const [year, month] = isoDate.split('-').map(Number);
  return { year, month };
}

export function shiftMonth({ year, month }: SalesMonth, delta: number): SalesMonth {
  const index = year * 12 + (month - 1) + delta;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

export function sameMonth(a: SalesMonth, b: SalesMonth): boolean {
  return a.year === b.year && a.month === b.month;
}

/** نطاق الشهر: من أول يوم فيه، حتى أول يوم في الشهر التالي (غير مشمول). */
export function monthRange(month: SalesMonth): { from: string; to: string } {
  const next = shiftMonth(month, 1);
  return { from: toISODate(month.year, month.month, 1), to: toISODate(next.year, next.month, 1) };
}

/** «2026-10» — صيغة حقل input[type=month]. */
export function monthKey({ year, month }: SalesMonth): string {
  return `${year}-${pad(month)}`;
}

export function parseMonthKey(value: string): SalesMonth | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return null;
  const month = { year: Number(match[1]), month: Number(match[2]) };
  return month.month >= 1 && month.month <= 12 ? month : null;
}

// ─── الحسابات ────────────────────────────────────────────────────────

export function capitalOf(sale: Pick<Sale, 'amount' | 'profit'>): number {
  return sale.amount - sale.profit;
}

export interface SalesSummary {
  total: number;
  capital: number;
  profit: number;
  count: number;
}

/** الإجماليات من السجلات نفسها — لا أرقام مخزّنة قد تتعارض معها. */
export function summarize(sales: Sale[]): SalesSummary {
  return sales.reduce<SalesSummary>(
    (sum, sale) => ({
      total: sum.total + sale.amount,
      capital: sum.capital + capitalOf(sale),
      profit: sum.profit + sale.profit,
      count: sum.count + 1,
    }),
    { total: 0, capital: 0, profit: 0, count: 0 },
  );
}

// ─── التحقق من النموذج ───────────────────────────────────────────────

export interface SaleDraft {
  date: string;
  amount: string;
  profit: string;
}

export type SaleDraftErrors = Partial<Record<keyof SaleDraft, string>>;

/** يعيد العملية الجاهزة للحفظ، أو أخطاء الحقول. */
export function validateSaleDraft(
  draft: SaleDraft,
): { input: SaleInput; errors?: undefined } | { input?: undefined; errors: SaleDraftErrors } {
  const errors: SaleDraftErrors = {};

  if (!isValidISODate(draft.date)) errors.date = 'اختاري تاريخ البيع.';

  const amount = parsePrice(draft.amount);
  if (amount === null) errors.amount = 'اكتبي سعر البيع.';
  else if (Number.isNaN(amount)) errors.amount = 'سعر البيع يجب أن يكون رقمًا صحيحًا (مثل 1000).';
  else if (amount <= 0) errors.amount = 'سعر البيع يجب أن يكون أكبر من صفر.';

  const profit = parsePrice(draft.profit);
  if (profit === null) errors.profit = 'اكتبي الربح (أو 0 إن لم يكن هناك ربح).';
  else if (Number.isNaN(profit)) errors.profit = 'الربح يجب أن يكون رقمًا صحيحًا موجبًا (مثل 200).';
  else if (amount !== null && !Number.isNaN(amount) && profit > amount) {
    errors.profit = 'الربح لا يمكن أن يتجاوز سعر البيع.';
  }

  if (Object.keys(errors).length > 0) return { errors };
  return { input: { date: draft.date, amount: amount as number, profit: profit as number } };
}

// ─── قاعدة البيانات ──────────────────────────────────────────────────

interface SaleRow {
  id: string;
  sale_date: string;
  amount: number;
  profit: number;
}

const ROW_COLUMNS = 'id, sale_date, amount, profit';

function client(): SupabaseClient {
  if (!supabase) throw new Error('Supabase غير مضبوط');
  return supabase;
}

function rowToSale(row: SaleRow): Sale {
  return { id: row.id, date: row.sale_date, amount: row.amount, profit: row.profit };
}

function saleToRow(input: SaleInput): Omit<SaleRow, 'id'> {
  return { sale_date: input.date, amount: input.amount, profit: input.profit };
}

/** عمليات شهر واحد فقط، حسب تاريخ البيع، الأحدث أولًا. */
export async function fetchSalesForMonth(month: SalesMonth): Promise<Sale[]> {
  const { from, to } = monthRange(month);
  const { data, error } = await client()
    .from(SALES_TABLE)
    .select(ROW_COLUMNS)
    .gte('sale_date', from)
    .lt('sale_date', to)
    .order('sale_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return ((data ?? []) as SaleRow[]).map(rowToSale);
}

export async function createSale(input: SaleInput): Promise<Sale> {
  const { data, error } = await client().from(SALES_TABLE).insert(saleToRow(input)).select(ROW_COLUMNS).single();

  if (error) throw error;
  return rowToSale(data as SaleRow);
}

export async function updateSale(id: string, input: SaleInput): Promise<void> {
  const { data, error } = await client().from(SALES_TABLE).update(saleToRow(input)).eq('id', id).select('id');

  if (error) throw error;
  // RLS يرفض بصمت (0 صفوف) بدل رسالة خطأ — نحوّل ذلك إلى خطأ واضح
  if (!data || data.length === 0) throw new Error('لم يتم التعديل — تحققي من صلاحيات الحساب.');
}

export async function deleteSale(id: string): Promise<void> {
  const { data, error } = await client().from(SALES_TABLE).delete().eq('id', id).select('id');

  if (error) throw error;
  if (!data || data.length === 0) throw new Error('لم يتم الحذف — تحققي من صلاحيات الحساب.');
}
