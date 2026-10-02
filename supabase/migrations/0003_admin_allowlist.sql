-- ════════════════════════════════════════════════════════════════════
--  VOUTIQUE — قائمة المديرين المصرّح لهم (Phase 7 — Security)
--
--  قبل هذا الملف: أي مستخدم مسجّل يستطيع التعديل. هذا آمن فقط ما دام
--  التسجيل العام معطّلًا — وإعداد واحد منسيّ يكفي لفتح المتجر للجميع.
--
--  بعد هذا الملف: الكتابة مسموحة فقط لمن يوجد في جدول public.admins،
--  حتى لو تمكّن شخص آخر من إنشاء حساب.
--
--  شغّلي بعد 0001 و 0002. آمن لإعادة التشغيل.
--
--  ➕ لإضافة مدير (بعد إنشاء حسابه من Authentication ← Users):
--     insert into public.admins (user_id)
--     select id from auth.users where email = 'البريد@example.com'
--     on conflict do nothing;
-- ════════════════════════════════════════════════════════════════════

-- ─── 1) جدول المديرين ───────────────────────────────────────────────
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- RLS بلا أي سياسة = لا أحد يقرأ أو يعدّل الجدول عبر الواجهة البرمجية.
-- الإضافة تتم فقط من SQL Editor في لوحة Supabase.
alter table public.admins enable row level security;

-- ─── 2) دالة التحقق ─────────────────────────────────────────────────
-- security definer: تقرأ جدول admins رغم أن RLS يمنع قراءته مباشرة.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ─── 3) سياسات المنتجات: المسجّل وحده لا يكفي، يجب أن يكون مديرًا ───
drop policy if exists "products auth read all" on public.products;
drop policy if exists "products admin read all" on public.products;
create policy "products admin read all"
  on public.products for select
  to authenticated
  using (public.is_admin());

drop policy if exists "products auth insert" on public.products;
drop policy if exists "products admin insert" on public.products;
create policy "products admin insert"
  on public.products for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "products auth update" on public.products;
drop policy if exists "products admin update" on public.products;
create policy "products admin update"
  on public.products for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "products auth delete" on public.products;
drop policy if exists "products admin delete" on public.products;
create policy "products admin delete"
  on public.products for delete
  to authenticated
  using (public.is_admin());

-- ─── 4) سياسات الصور: الرفع والحذف للمدير فقط ───────────────────────
drop policy if exists "product images auth insert" on storage.objects;
drop policy if exists "product images admin insert" on storage.objects;
create policy "product images admin insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product images auth update" on storage.objects;
drop policy if exists "product images admin update" on storage.objects;
create policy "product images admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product images auth delete" on storage.objects;
drop policy if exists "product images admin delete" on storage.objects;
create policy "product images admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- ─── 5) حدود المخزن: صور فقط، وبحجم معقول ───────────────────────────
-- لوحة الإدارة تضغط الصور قبل رفعها (أقل من 1 ميغابايت عادةً)؛
-- هذا الحد يمنع رفع ملفات ضخمة أو غير الصور حتى لو تجاوز أحدٌ اللوحة.
update storage.buckets
set file_size_limit = 5242880, -- 5 MB
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'product-images';
