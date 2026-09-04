// يحوّل صور المنتجات الطولية إلى مربّعة دون قصّ أي جزء من المنتج،
// بحشو الفراغ بلون خلفية الصورة نفسها (يُلتقط من زواياها) فيبدو الحشو
// امتدادًا طبيعيًا للصورة لا شريطًا دخيلًا.
//
// السبب: بطاقات المنتجات تستخدم aspect-square مع object-cover، فأي صورة
// طولية يُقتطع أعلاها وأسفلها — وهو ما يقصّ غطاء العبوة أو قاعدتها.
//
// ملاحظة: نقرأ الملف إلى الذاكرة أولًا ونعمل على المخزن لا على المسار،
// لأن sharp يُبقي مقبض الملف مفتوحًا فيتعذّر الكتابة فوقه على ويندوز.
//
// الاستخدام:  node scripts/square-product-images.cjs <مسار sharp> <ملف...>
const sharp = require(process.argv[2]);
const path = require('node:path');
const fs = require('node:fs');

const files = process.argv.slice(3);

/** متوسط لون الزوايا الأربع — يمثّل خلفية الصورة بدقة كافية. */
async function backgroundColor(buffer, width, height) {
  const corners = [
    { left: 0, top: 0 },
    { left: width - 1, top: 0 },
    { left: 0, top: height - 1 },
    { left: width - 1, top: height - 1 },
  ];

  const totals = [0, 0, 0];
  for (const corner of corners) {
    const pixel = await sharp(buffer)
      .extract({ ...corner, width: 1, height: 1 })
      .removeAlpha()
      .raw()
      .toBuffer();
    totals[0] += pixel[0];
    totals[1] += pixel[1];
    totals[2] += pixel[2];
  }

  return {
    r: Math.round(totals[0] / corners.length),
    g: Math.round(totals[1] / corners.length),
    b: Math.round(totals[2] / corners.length),
  };
}

async function run() {
  for (const file of files) {
    const abs = path.resolve(file);
    const input = fs.readFileSync(abs);
    const { width, height } = await sharp(input).metadata();

    if (width === height) {
      console.log(`= ${path.basename(abs)} مربّعة أصلًا — تُركت كما هي`);
      continue;
    }

    const size = Math.max(width, height);
    const background = await backgroundColor(input, width, height);

    const output = await sharp(input)
      .resize(size, size, { fit: 'contain', background })
      .jpeg({ quality: 88 })
      .toBuffer();

    fs.writeFileSync(abs, output);

    console.log(
      `✔ ${path.basename(abs)}: ${width}×${height} → ${size}×${size}` +
        ` (حشو rgb(${background.r},${background.g},${background.b}))`,
    );
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
