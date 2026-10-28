-- ════════════════════════════════════════════════════════════════════
--  VOUTIQUE — سجل المبيعات (صفحة «المبيعات والأرباح» في لوحة الإدارة)
--
--  صف واحد لكل عملية بيع: التاريخ، سعر البيع، الربح فقط.
--  رأس المال لا يُخزَّن: يُحسب دائمًا (سعر البيع − الربح)، فلا يمكن
--  أن يتعارض مع السجل. والإجماليات الشهرية تُحسب من الصفوف نفسها.
--
--  بيانات خاصة بالمديرين فقط: لا قراءة عامة إطلاقًا (بخلاف products
--  و site_images)، فالجدول غير مرئي لزوار المتجر.
--
--  شغّلي بعد 0003 (يعتمد على public.is_admin()). آمن لإعادة التشغيل.
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.sales (
  id         uuid primary key default gen_random_uuid(),
  -- تاريخ البيع كما تدخله المالكة (وليس تاريخ إنشاء السجل)
  sale_date  date not null,
  -- أعداد صحيحة بالأوقية، مثل أسعار المنتجات
  amount     integer not null check (amount > 0),
  -- الربح صفر مسموح (بيع بسعر التكلفة)، ولا يتجاوز سعر البيع
  profit     integer not null check (profit >= 0 and profit <= amount),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- عرض الشهر يبحث بنطاق تاريخ البيع
create index if not exists sales_sale_date_idx on public.sales (sale_date);

-- نفس دالة تحديث updated_at المستخدمة لجدول products
drop trigger if exists sales_set_updated_at on public.sales;
create trigger sales_set_updated_at
  before update on public.sales
  for each row execute function public.set_updated_at();

-- ─── الحماية: المديرون فقط (public.admins عبر is_admin()) ────────────
alter table public.sales enable row level security;

drop policy if exists "sales admin read" on public.sales;
create policy "sales admin read"
  on public.sales for select
  to authenticated
  using (public.is_admin());

drop policy if exists "sales admin insert" on public.sales;
create policy "sales admin insert"
  on public.sales for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "sales admin update" on public.sales;
create policy "sales admin update"
  on public.sales for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "sales admin delete" on public.sales;
create policy "sales admin delete"
  on public.sales for delete
  to authenticated
  using (public.is_admin());
