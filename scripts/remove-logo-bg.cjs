// يزيل الخلفية السوداء المسطّحة من public/logo.jpg (نتيجة تحويل PNG شفاف
// إلى JPEG أثناء الحفظ من المتصفح) وينتج public/logo.png بخلفية شفافة حقيقية.
// سكربت لمرة واحدة — لا يُستخدم في البناء أو الإنتاج.
const sharp = require(process.argv[2]);
const path = require('node:path');

const SRC = path.resolve(__dirname, '../public/logo.jpg');
const OUT = path.resolve(__dirname, '../public/logo.png');

const THRESHOLD_LOW = 18;
const THRESHOLD_HIGH = 55;

async function run() {
  const image = sharp(SRC);
  const { width, height } = await image.metadata();
  const raw = await sharp(SRC).ensureAlpha().raw().toBuffer();

  for (let i = 0; i < raw.length; i += 4) {
    const maxC = Math.max(raw[i], raw[i + 1], raw[i + 2]);
    let alpha;
    if (maxC <= THRESHOLD_LOW) alpha = 0;
    else if (maxC >= THRESHOLD_HIGH) alpha = 255;
    else alpha = Math.round(((maxC - THRESHOLD_LOW) / (THRESHOLD_HIGH - THRESHOLD_LOW)) * 255);
    raw[i + 3] = alpha;
  }

  await sharp(raw, { raw: { width, height, channels: 4 } }).png().toFile(OUT);
  console.log('✔ تم إنشاء', OUT);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
