-- ════════════════════════════════════════════════════════════════════
--  VOUTIQUE — المخطط الأساسي (Phase 1)
--
--  جدول المنتجات + حماية الصفوف (RLS) + مخزن صور المنتجات.
--  شغّلي هذا الملف مرة واحدة في: Supabase ← SQL Editor ← New query ← Run
--  آمن لإعادة التشغيل (idempotent): لن يُكرّر أو يُفسد شيئًا إن أُعيد.
-- ════════════════════════════════════════════════════════════════════

-- ─── 1) جدول المنتجات ───────────────────────────────────────────────
create table if not exists public.products (
  id                text primary key,
  slug              text not null unique,
  name              text not null,
  short_description text not null default '',
  description       text not null default '',
  price             integer not null default 0,
  old_price         integer,
  category          text not null,
  brand             text,
  gender            text not null default 'women' check (gender in ('women','men','unisex')),
  image             text not null default '',
  images            text[] not null default '{}',
  badge             text check (badge in ('new','sale','bestseller','limited')),
  featured          boolean not null default false,
  best_seller       boolean not null default false,
  available         boolean not null default true,
  published         boolean not null default true,
  size              text,
  ingredients       text,
  options           jsonb not null default '[]'::jsonb,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists products_category_idx  on public.products (category);
create index if not exists products_published_idx on public.products (published);
create index if not exists products_sort_idx      on public.products (sort_order);

-- تحديث updated_at تلقائيًا عند كل تعديل
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ─── 2) حماية الصفوف (Row Level Security) ───────────────────────────
alter table public.products enable row level security;

-- الزوّار (anon) + المسجّلون: قراءة المنتجات المنشورة فقط
drop policy if exists "products read published" on public.products;
create policy "products read published"
  on public.products for select
  using (published = true);

-- المالك المسجّل: قراءة كل المنتجات (بما فيها المخفية)
drop policy if exists "products auth read all" on public.products;
create policy "products auth read all"
  on public.products for select
  to authenticated
  using (true);

-- المالك المسجّل: إضافة / تعديل / حذف
drop policy if exists "products auth insert" on public.products;
create policy "products auth insert"
  on public.products for insert
  to authenticated
  with check (true);

drop policy if exists "products auth update" on public.products;
create policy "products auth update"
  on public.products for update
  to authenticated
  using (true) with check (true);

drop policy if exists "products auth delete" on public.products;
create policy "products auth delete"
  on public.products for delete
  to authenticated
  using (true);

-- ─── 3) مخزن صور المنتجات (Storage) ─────────────────────────────────
-- الصور الحالية تبقى في public/images/ كما هي؛ هذا المخزن مخصّص للصور
-- الجديدة التي تُرفع من لوحة الإدارة.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- قراءة عامة لصور هذا المخزن (حتى تظهر في المتجر دون تسجيل دخول)
drop policy if exists "product images public read" on storage.objects;
create policy "product images public read"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- المالك المسجّل: رفع / تعديل / حذف الصور
drop policy if exists "product images auth insert" on storage.objects;
create policy "product images auth insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "product images auth update" on storage.objects;
create policy "product images auth update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

drop policy if exists "product images auth delete" on storage.objects;
create policy "product images auth delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
