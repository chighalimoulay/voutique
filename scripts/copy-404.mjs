// نسخة من index.html باسم 404.html — GitHub Pages يعرضها لأي مسار غير معروف
// (مثل /voutique/product/xyz)، فيتولى React Router بعدها التوجيه من جهة العميل.
import { copyFileSync } from 'node:fs';

copyFileSync('dist/index.html', 'dist/404.html');
console.log('✔ تم إنشاء dist/404.html لدعم مسارات GitHub Pages الفرعية');
