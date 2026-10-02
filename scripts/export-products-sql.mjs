// ════════════════════════════════════════════════════════════════════
//  مولّد بيانات النقل: يقرأ المنتجات من src/data/products.ts ويكتب
//  ملف SQL جاهزًا للّصق في Supabase SQL Editor.
//
//  التشغيل:  node scripts/export-products-sql.mjs
//  الناتج:   supabase/migrations/0002_seed_products.sql
//
//  لا يتصل بأي قاعدة بيانات ولا يحتاج أي مفتاح — يولّد نصًّا فقط.
//  يستخدم esbuild (موجود ضمن تبعيات Vite) لتحميل ملف TypeScript.
// ════════════════════════════════════════════════════════════════════
import { build } from 'esbuild';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();

/** يحمّل وحدة TypeScript في Node عبر تحويلها بـ esbuild إلى ملف مؤقت. */
async function loadTs(relPath) {
  const result = await build({
    entryPoints: [path.join(root, relPath)],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    logLevel: 'silent',
    plugins: [
      {
        name: 'alias-@',
        setup(b) {
          b.onResolve({ filter: /^@\// }, (args) => ({
            path: path.join(root, 'src', args.path.slice(2)),
          }));
        },
      },
    ],
  });
  const code = result.outputFiles[0].text;
  const tmp = path.join(os.tmpdir(), `vq-${Date.now()}-${Math.random().toString(36).slice(2)}.mjs`);
  await fs.writeFile(tmp, code);
  try {
    return await import(pathToFileURL(tmp).href);
  } finally {
    await fs.rm(tmp, { force: true });
  }
}

const TAG = '$vq$';

/** قيمة نصّية بصيغة dollar-quoted — تتفادى كل مشاكل علامات الاقتباس. */
function text(value) {
  if (value === undefined || value === null) return 'null';
  const s = String(value);
  if (s.includes(TAG)) throw new Error(`النص يحتوي على الوسم ${TAG}: ${s.slice(0, 40)}`);
  return `${TAG}${s}${TAG}`;
}

function intOrNull(value) {
  return value === undefined || value === null ? 'null' : String(Math.round(Number(value)));
}

function bool(value) {
  return value ? 'true' : 'false';
}

/** مصفوفة نصوص → ARRAY[...]::text[] */
function textArray(arr) {
  if (!arr || arr.length === 0) return `'{}'::text[]`;
  return `ARRAY[${arr.map((v) => text(v)).join(', ')}]::text[]`;
}

/** كائن/مصفوفة → jsonb */
function jsonb(value) {
  const json = JSON.stringify(value ?? []);
  if (json.includes(TAG)) throw new Error('JSON يحتوي على الوسم المحجوز');
  return `${TAG}${json}${TAG}::jsonb`;
}

const COLUMNS = [
  'id', 'slug', 'name', 'short_description', 'description', 'price', 'old_price',
  'category', 'brand', 'gender', 'image', 'images', 'badge', 'featured',
  'best_seller', 'available', 'published', 'size', 'ingredients', 'options', 'sort_order',
];

function rowFor(product, index, published) {
  return [
    text(product.id),
    text(product.slug),
    text(product.name),
    text(product.shortDescription ?? ''),
    text(product.description ?? ''),
    intOrNull(product.price ?? 0),
    intOrNull(product.oldPrice),
    text(product.category),
    text(product.brand),
    text(product.gender ?? 'women'),
    text(product.image ?? ''),
    textArray(product.images),
    text(product.badge),
    bool(product.featured),
    bool(product.bestSeller),
    bool(product.available ?? true),
    bool(published),
    text(product.size),
    text(product.ingredients),
    jsonb(product.options),
    String(index),
  ];
}

async function main() {
  const { products, pendingProducts } = await loadTs('src/data/products.ts');

  if (!Array.isArray(products) || products.length === 0) {
    throw new Error('لم يتم العثور على مصفوفة products.');
  }

  const rows = [];
  products.forEach((p, i) => rows.push(rowFor(p, i, true)));
  // المنتجات قيد الإعداد: تُنقل مخفيّة (published=false) حتى لا تظهر في المتجر
  // بسعرها غير المكتمل، وتبقى متاحة لإكمالها من لوحة الإدارة.
  if (Array.isArray(pendingProducts)) {
    pendingProducts.forEach((p, i) => rows.push(rowFor(p, products.length + i, false)));
  }

  const header = `-- ════════════════════════════════════════════════════════════════════
--  VOUTIQUE — نقل المنتجات الحالية إلى Supabase (Phase 2)
--
--  مُولَّد تلقائيًا من src/data/products.ts عبر scripts/export-products-sql.mjs
--  لا تُحرّري هذا الملف يدويًا — أعيدي توليده عند تغيّر المنتجات المصدرية.
--
--  شغّلي بعد 0001_init.sql في: Supabase ← SQL Editor ← Run
--  on conflict do nothing: إعادة التشغيل لن تمسّ أي تعديل أجريتِه لاحقًا.
--
--  عدد المنتجات المنشورة: ${products.length}
--  عدد المنتجات المخفية (قيد الإعداد): ${Array.isArray(pendingProducts) ? pendingProducts.length : 0}
-- ════════════════════════════════════════════════════════════════════

insert into public.products (${COLUMNS.join(', ')})
values
`;

  const body = rows.map((cols) => `  (${cols.join(', ')})`).join(',\n');
  const footer = `\non conflict (id) do nothing;\n`;

  const out = path.join(root, 'supabase', 'migrations', '0002_seed_products.sql');
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, header + body + footer, 'utf8');

  console.log(`✓ كُتب ${rows.length} منتجًا إلى ${path.relative(root, out)}`);
}

main().catch((err) => {
  console.error('✗ فشل التوليد:', err.message);
  process.exit(1);
});
