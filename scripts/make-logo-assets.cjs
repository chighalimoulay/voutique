// يبني الأصول المشتقة من public/logo.png (شعار المتجر الرسمي):
//   - public/logo-icon.png   : الحقيبة فقط (بلا نص) — مربّعة، لاستخدامها
//                              كأساس لأيقونة المتصفح حيث لا يظهر النص بوضوح
//   - public/favicon-192.png : نسخة 192×192 من الأيقونة لأجهزة الهاتف
// سكربت لمرة واحدة — لا يُستخدم في البناء أو الإنتاج.
const sharp = require(process.argv[2]);
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const LOGO = path.join(ROOT, 'public/logo.png');

async function run() {
  const { width, height } = await sharp(LOGO).metadata();

  // الحقيبة تشغل تقريبًا الثلثين العلويين من الصورة؛ نقتصّ مربّعًا من الأعلى
  // للحصول على الأيقونة وحدها بلا النص السفلي.
  const cropSize = Math.round(width * 0.78);
  await sharp(LOGO)
    .extract({ left: 0, top: 0, width, height: Math.min(cropSize, height) })
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(ROOT, 'public/logo-icon.png'));

  await sharp(path.join(ROOT, 'public/logo-icon.png'))
    .resize(192, 192)
    .png()
    .toFile(path.join(ROOT, 'public/favicon-192.png'));

  await sharp(path.join(ROOT, 'public/logo-icon.png'))
    .resize(32, 32)
    .png()
    .toFile(path.join(ROOT, 'public/favicon-32.png'));

  console.log('✔ تم إنشاء logo-icon.png و favicon-192.png و favicon-32.png');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
