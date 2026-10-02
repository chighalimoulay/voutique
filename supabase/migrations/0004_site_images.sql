-- ════════════════════════════════════════════════════════════════════
--  VOUTIQUE — صور واجهة المتجر (Hero + صور الفئات)
--
--  صف واحد لكل صورة «مخصّصة». غياب الصف = يعرض الموقع الصورة الأصلية
--  من public/images تلقائيًا، فلا يتعطّل شيء إن لم تُرفع أي صورة.
--
--  المفاتيح المستخدمة:
--    hero                  الصورة الكبيرة في الصفحة الرئيسية
--    category:<slug>       صورة الفئة (slug كما في src/data/categories.ts)
--
--  الملفات تُرفع إلى مخزن product-images الموجود، داخل المجلد site/،
--  فتسري عليها سياساته وحدوده (المديرون فقط، صور فقط، 5 ميغابايت).
--
--  شغّلي بعد 0003. آمن لإعادة التشغيل.
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.site_images (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique
               check (key = 'hero' or key ~ '^category:[a-z0-9]+(-[a-z0-9]+)*$'),
  image_url  text not null check (image_url ~ '^https://'),
  updated_at timestamptz not null default now()
);

-- نفس دالة تحديث updated_at المستخدمة لجدول products
drop trigger if exists site_images_set_updated_at on public.site_images;
create trigger site_images_set_updated_at
  before update on public.site_images
  for each row execute function public.set_updated_at();

-- ─── الحماية: نفس مبدأ جدول products ───────────────────────────────
alter table public.site_images enable row level security;

-- الجميع يقرأ (الصور تظهر لكل الزوار)
drop policy if exists "site images public read" on public.site_images;
create policy "site images public read"
  on public.site_images for select
  using (true);

-- الكتابة للمديرين فقط (public.admins عبر is_admin())
drop policy if exists "site images admin insert" on public.site_images;
create policy "site images admin insert"
  on public.site_images for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "site images admin update" on public.site_images;
create policy "site images admin update"
  on public.site_images for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "site images admin delete" on public.site_images;
create policy "site images admin delete"
  on public.site_images for delete
  to authenticated
  using (public.is_admin());
