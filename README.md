# VOUTIQUE — متجر عطور وتجميل وعناية

> **جمالك… بطريقتك**

متجر إلكتروني **Frontend فقط** بالعربية الكاملة واتجاه RTL، يعرض المنتجات والأسعار
والصور، وعندما تريد العميلة الشراء يُفتح **واتساب** برسالة طلب جاهزة.

**لا يوجد Backend، ولا قاعدة بيانات، ولا تسجيل دخول، ولا بوابة دفع، ولا Docker.**
الموقع ثابت بالكامل وقابل للنشر مجانًا على أي استضافة ملفات ثابتة.

---

## المحتويات

1. [المتطلبات](#1-المتطلبات)
2. [التثبيت والتشغيل](#2-التثبيت-والتشغيل)
3. [⭐ تغيير رقم واتساب](#3--تغيير-رقم-واتساب-مهم)
4. [تغيير معلومات المتجر](#4-تغيير-معلومات-المتجر)
5. [إضافة منتج جديد](#5-إضافة-منتج-جديد)
6. [تغيير السعر](#6-تغيير-السعر)
7. [تغيير الصور](#7-تغيير-الصور)
8. [إضافة أو تعديل تصنيف](#8-إضافة-أو-تعديل-تصنيف)
9. [البناء للإنتاج](#9-البناء-للإنتاج)
10. [نشر الموقع](#10-نشر-الموقع)
11. [بنية المشروع](#11-بنية-المشروع)
12. [كيف تعمل رسائل واتساب](#12-كيف-تعمل-رسائل-واتساب)
13. [التطوير المستقبلي (3D)](#13-التطوير-المستقبلي-3d)

---

## 1. المتطلبات

- **Node.js 18 أو أحدث** (يُنصح بـ 20 أو 22 أو 24 LTS) — يتضمن `npm`.
  - التحميل: <https://nodejs.org>
  - أو على ويندوز عبر الطرفية:
    ```bash
    winget install OpenJS.NodeJS.LTS
    ```
  - بعد التثبيت أغلقي الطرفية وافتحيها من جديد، ثم تحقّقي:
    ```bash
    node -v
    npm -v
    ```

لا تحتاجين إلى أي شيء آخر: لا Docker، ولا PostgreSQL، ولا خادم.

---

## 2. التثبيت والتشغيل

من داخل مجلد المشروع:

```bash
npm install
```

ثم شغّلي خادم التطوير:

```bash
npm run dev
```

افتحي المتصفح على: **<http://localhost:5173>**

أي تعديل تحفظينه في الملفات يظهر فورًا في المتصفح دون إعادة تشغيل.

### كل الأوامر المتاحة

| الأمر | الوظيفة |
| --- | --- |
| `npm install` | تثبيت التبعيات (مرة واحدة، أو بعد تغيير `package.json`) |
| `npm run dev` | تشغيل الموقع محليًا للتطوير على المنفذ 5173 |
| `npm run build` | بناء نسخة الإنتاج داخل مجلد `dist/` |
| `npm run preview` | معاينة نسخة الإنتاج محليًا على المنفذ 4173 |
| `npm run lint` | فحص جودة الكود |

---

## 3. ⭐ تغيير رقم واتساب (مهم)

رقم واتساب موجود في **مكان واحد فقط** في المشروع:

📄 **`src/config/store.ts`**

```ts
export const storeConfig: StoreConfig = {
  name: 'VOUTIQUE',
  ...
  // ⬇⬇⬇  غيّري هذا الرقم إلى رقم واتساب متجرك الحقيقي  ⬇⬇⬇
  whatsappNumber: '222XXXXXXXX',
  // ⬆⬆⬆  ─────────────────────────────────────────────  ⬆⬆⬆
  ...
};
```

### قواعد كتابة الرقم

- **أرقام فقط**: بلا `+` وبلا فراغات وبلا شرطات وبلا أقواس.
- ابدئي **برمز الدولة** بدون صفر بادئ.
- رمز موريتانيا هو **222**.

| الرقم لديك | ما تكتبينه في الملف |
| --- | --- |
| `43 12 34 56` (موريتانيا) | `22243123456` |
| `+222 43 12 34 56` | `22243123456` |
| `+966 50 123 4567` | `966501234567` |

> ⚠️ ما دام الرقم `222XXXXXXXX` (القيمة النائبة)، فلن يفتح الموقع واتساب،
> وسيعرض بدلًا من ذلك رسالة واضحة للعميلة:
> **«يرجى إعداد رقم WhatsApp الخاص بالمتجر أولًا من الملف src/config/store.ts»**
>
> هذا مقصود حتى لا يُفتح رابط خاطئ. بمجرد وضع رقمك الحقيقي يعمل كل شيء تلقائيًا.

---

## 4. تغيير معلومات المتجر

كل بيانات المتجر في نفس الملف **`src/config/store.ts`**:

```ts
export const storeConfig: StoreConfig = {
  name: 'VOUTIQUE',                       // اسم المتجر
  tagline: 'جمالك… بطريقتك',              // الشعار النصي
  description: '...',                     // وصف يظهر في الفوتر ومحركات البحث
  whatsappNumber: '222XXXXXXXX',          // ← رقم واتساب
  phone: '+222 XX XX XX XX',              // رقم الهاتف المعروض
  email: 'contact@voutique.mr',           // البريد الإلكتروني
  address: 'نواكشوط — موريتانيا',         // العنوان
  workingHours: 'السبت — الخميس، ...',    // ساعات العمل
  currency: 'MRU',                        // رمز العملة
  currencyNameAr: 'أوقية',                // اسم العملة بالعربية
  social: [                               // روابط التواصل
    { key: 'instagram', label: 'إنستغرام', url: 'https://instagram.com/...' },
    { key: 'facebook',  label: 'فيسبوك',  url: 'https://facebook.com/...' },
  ],
  externalSites: ['SHEIN', 'Noon', ...],  // المواقع في صفحة «اطلبي من الخارج»
  freeShippingFrom: 15000,                // شحن مجاني ابتداءً من (أو null للتعطيل)
};
```

المفاتيح المدعومة في `social` هي: `instagram` و `facebook` و `tiktok` و `snapchat`.

---

## 5. إضافة منتج جديد

كل المنتجات في ملف واحد: 📄 **`src/data/products.ts`**

انسخي أي منتج موجود والصقيه، ثم غيّري القيم. **لا تحتاجين لتعديل أي ملف آخر.**

```ts
{
  id: 'p-031',                                  // معرّف فريد لا يتكرر
  name: 'عطر الياسمين الأبيض',                  // اسم المنتج
  slug: 'white-jasmine-perfume',                // الرابط: /product/white-jasmine-perfume
  shortDescription: 'ياسمين ناعم للاستخدام اليومي.',
  description: 'وصف تفصيلي يظهر داخل صفحة المنتج…',
  price: 9500,                                  // السعر بالأوقية (رقم بلا فواصل)
  oldPrice: 11000,                              // اختياري — احذفي السطر إن لم يوجد خصم
  category: 'perfumes',                         // من src/data/categories.ts
  brand: 'Maison VOUTIQUE',                     // اختياري
  gender: 'women',                              // women | men | unisex
  image: '/images/products/jasmine.jpg',        // الصورة الرئيسية
  badge: 'new',                                 // اختياري: new | sale | bestseller | limited
  featured: true,                               // يظهر في «منتجات مختارة لكِ»
  bestSeller: false,                            // يظهر في «الأكثر مبيعًا»
  available: true,                              // false = غير متوفر ولا يمكن طلبه
  size: '75 مل',                                // اختياري
  ingredients: 'كحول، ماء، زيوت عطرية…',        // اختياري
  options: [                                    // اختياري — تُرسل ضمن رسالة واتساب
    { label: 'الحجم', values: ['50 مل', '100 مل'] },
    { label: 'اللون', values: ['وردي', 'أحمر'] },
  ],
},
```

### ملاحظات مهمة

- **`id` و `slug` يجب ألا يتكررا** مع أي منتج آخر.
- **`category`** يجب أن يطابق `slug` تصنيف موجود في `src/data/categories.ts`.
- **`available: false`** يعرض «غير متوفر حاليًا» ويمنع الإضافة للسلة والطلب.
- المنتج الذي يحتوي **`options`** يجب اختيار خياراته من صفحته قبل الطلب
  (زر الطلب السريع في البطاقة يوجّه العميلة إلى الصفحة).
- لا نعرض «متبقي 3 قطع» إطلاقًا — المخزون هنا **متوفر / غير متوفر** فقط،
  لأنه لا توجد قاعدة بيانات تتابع الكميات فعليًا.

---

## 6. تغيير السعر

في `src/data/products.ts` غيّري الرقم فقط:

```ts
price: 12500,      // السعر الحالي
oldPrice: 15000,   // السعر قبل الخصم — يظهر مشطوبًا مع نسبة الخصم تلقائيًا
```

- الأسعار **أعداد صحيحة بالأوقية** بلا فواصل ولا كسور: اكتبي `12500` لا `12,500`.
- نسبة الخصم تُحسب تلقائيًا: `(oldPrice − price) ÷ oldPrice`.
- تنسيق العرض («12,500 أوقية») موحّد في كل الموقع من `src/utils/format.ts`.
- لإزالة الخصم: احذفي سطر `oldPrice` بالكامل.

---

## 7. تغيير الصور

### مكان الصور

```
public/images/products/     ← صور المنتجات
public/images/categories/   ← صور التصنيفات
```

### الخطوات

1. ضعي ملف الصورة في `public/images/products/` — مثلًا `jasmine.jpg`.
2. في `src/data/products.ts` اكتبي المسار:
   ```ts
   image: '/images/products/jasmine.jpg',
   ```
   (المسار يبدأ من `/images` وليس من `/public`.)

### صور متعددة لمنتج واحد

```ts
image: '/images/products/jasmine.jpg',
images: [
  '/images/products/jasmine.jpg',
  '/images/products/jasmine-2.jpg',
  '/images/products/jasmine-3.jpg',
],
```

### توصيات

- الأبعاد المفضّلة: **مربعة** (مثل 1000×1000).
- الصيغة: `webp` أو `jpg` مضغوطة (أقل من 200 كيلوبايت لسرعة أفضل).
- **إن كانت الصورة مفقودة أو تالفة**، يعرض الموقع تلقائيًا صورة بديلة
  (`/images/products/placeholder.svg`) ولا تظهر أي صورة مكسورة.

### الصور التجريبية الحالية

الصور الموجودة الآن ملفات **SVG خفيفة** مولّدة تلقائيًا (وليست صورًا حقيقية).
لإعادة توليدها بعد التعديل عليها:

```bash
bash scripts/make-placeholders.sh
```

استبدليها بصورك الحقيقية بنفس أسماء الملفات، أو استخدمي أسماء جديدة وحدّثي
`src/data/products.ts`.

---

## 8. إضافة أو تعديل تصنيف

📄 **`src/data/categories.ts`**

```ts
{
  slug: 'perfumes',                          // يظهر في الرابط: /category/perfumes
  name: 'العطور',                            // الاسم المعروض
  description: 'عطور نسائية فاخرة…',
  image: '/images/categories/perfumes.svg',
  icon: 'Sparkles',                          // اسم أيقونة من القائمة أدناه
  order: 1,                                  // ترتيب الظهور
},
```

الأيقونات المتاحة حاليًا: `Sparkles`, `Wind`, `Droplet`, `Palette`, `ShieldCheck`, `Gift`.

لإضافة أيقونة جديدة، استورديها في 📄 `src/data/categoryIcons.ts` وأضيفيها للقائمة:

```ts
import { Flower } from 'lucide-react';

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Sparkles, Wind, Droplet, Palette, ShieldCheck, Gift,
  Flower,   // ← جديدة
};
```

> ⚠️ لا تستوردي كل الأيقونات دفعة واحدة (`import * as Icons`) — ذلك يضيف أكثر
> من 700 كيلوبايت إلى حجم الموقع ويُبطئه على الهاتف.

---

## 9. البناء للإنتاج

```bash
npm run build
```

- ينشئ مجلد **`dist/`** وهو الموقع النهائي الجاهز للنشر.
- يفحص أنواع TypeScript أولًا، فإن وُجد خطأ يتوقف البناء ولا يُنتج ملفات ناقصة.

لمعاينة نسخة الإنتاج محليًا قبل النشر:

```bash
npm run preview
```

ثم افتحي <http://localhost:4173>

---

## 10. نشر الموقع

الموقع **ثابت بالكامل** (HTML + CSS + JS فقط)، فينشر مجانًا على أي من هذه الخدمات.

### الروابط الحالية للمشروع

| الرابط | الاستضافة | التحديث |
| --- | --- | --- |
| **<https://voutique-mr.netlify.app>** | Netlify (الرابط الرئيسي الموصى به) | تلقائي مع كل `git push` إلى `main` |
| <https://chighalimoulay.github.io/voutique/> | GitHub Pages (نسخة احتياطية) | يدوي عبر `npm run deploy` |

المستودع: <https://github.com/chighalimoulay/voutique>

### Netlify — النشر التلقائي (مُفعَّل حاليًا)

المشروع مربوط بمستودع GitHub، فأي `git push` إلى `main` يُشغّل بناءً
ونشرًا تلقائيًا خلال دقيقة تقريبًا. إعدادات البناء موجودة في `netlify.toml`
(الأمر `npm run build`، مجلد النشر `dist`).

للنشر اليدوي من جهازك مباشرة دون انتظار GitHub:

```bash
netlify deploy --prod
```

> ⚠️ إن ظهرت رسالة «This site is private» عند فتح الرابط، فهذا إعداد
> **Team protection** في حساب Netlify (قد يُعاد تفعيله عند ربط مستودع جديد).
> عطّليه من: Team settings ← Team protection، أو من Site settings ← Visitor access.

### GitHub Pages — نشر يدوي

```bash
npm run deploy
```

يبني الموقع بمسار `/voutique/` الفرعي تلقائيًا (`vite.config.ts` يضبط
`base` حسب نمط البناء) وينشئ `404.html` لدعم التوجيه من جهة العميل.

### خدمات أخرى

| الخدمة | الطريقة |
| --- | --- |
| **Vercel** | `Build Command: npm run build` — `Output Directory: dist` |
| **Cloudflare Pages** | نفس إعدادات Vercel |

### مهم: إعادة توجيه المسارات (SPA)

الموقع يستخدم مسارات مثل `/product/luxury-rose-perfume`. عند فتح هذا الرابط
مباشرة، يجب أن تُرجع الاستضافة ملف `index.html`، وإلا ظهر خطأ 404.

- **Netlify**: مضبوط تلقائيًا عبر `netlify.toml` و `public/_redirects`.
- **Vercel / Cloudflare Pages**: يتعرّفان على مشاريع Vite تلقائيًا.
- **GitHub Pages**: `npm run deploy` ينشئ `dist/404.html` تلقائيًا (عبر
  `scripts/copy-404.mjs`) — لا حاجة لأي خطوة يدوية.
- **استضافة عادية (Apache)**: أضيفي ملف `.htaccess`:
  ```apache
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
  ```

> ✅ لا تنسي وضع **رقم واتساب الحقيقي** في `src/config/store.ts` قبل البناء والنشر.

---

## 11. بنية المشروع

```
voutique/
├── public/
│   ├── images/
│   │   ├── products/          ← صور المنتجات (ضعي صورك هنا)
│   │   ├── categories/        ← صور التصنيفات
│   │   └── og-cover.svg       ← صورة المشاركة على وسائل التواصل
│   ├── logo.png                ← شعار المتجر (هيدر + فوتر)
│   ├── logo-icon.png           ← الشعار بلا نص (أساس أيقونة المتصفح)
│   ├── favicon-32.png / favicon-192.png
│   ├── robots.txt
│   └── _redirects             ← إعادة توجيه SPA لـ Netlify
│
├── scripts/
│   └── make-placeholders.sh   ← مولّد الصور التجريبية
│
├── src/
│   ├── config/
│   │   └── store.ts           ⭐ رقم واتساب وكل بيانات المتجر
│   │
│   ├── data/
│   │   ├── products.ts        ⭐ كل المنتجات
│   │   ├── categories.ts      ⭐ كل التصنيفات
│   │   └── categoryIcons.ts   ← أيقونات التصنيفات
│   │
│   ├── types/index.ts         ← أنواع TypeScript
│   │
│   ├── utils/
│   │   ├── whatsapp.ts        ⭐ بناء كل روابط ورسائل واتساب
│   │   ├── format.ts          ← تنسيق الأسعار والخصومات
│   │   ├── search.ts          ← البحث والفلاتر والترتيب
│   │   └── cn.ts              ← دمج أصناف CSS
│   │
│   ├── hooks/                 ← useLocalStorage، useDebounce، useScrollToTop…
│   │
│   ├── store/                 ← السلة والمفضلة والتنبيهات (React Context)
│   │   ├── CartProvider.tsx
│   │   ├── WishlistProvider.tsx
│   │   └── ToastProvider.tsx
│   │
│   ├── components/
│   │   ├── layout/            ← Header، MobileDrawer، Footer، زر واتساب العائم
│   │   ├── home/              ← HeroSection، CategoryGrid، ProductShowcase…
│   │   ├── product/           ← ProductCard، ProductGrid، ProductGallery، ProductVisual
│   │   ├── shop/              ← FilterPanel
│   │   ├── ui/                ← Button، Badge، QuantityInput، ConfirmDialog…
│   │   ├── ErrorBoundary.tsx
│   │   └── Seo.tsx
│   │
│   ├── pages/                 ← صفحات الموقع
│   ├── App.tsx                ← المسارات
│   ├── main.tsx               ← نقطة الدخول
│   └── index.css              ← أنماط Tailwind والهوية البصرية
│
├── index.html
├── package.json
├── tailwind.config.js         ← ألوان Olive & Blush (زيتوني ووردي)
└── vite.config.ts
```

### صفحات الموقع

| المسار | الصفحة |
| --- | --- |
| `/` | الرئيسية |
| `/shop` | المتجر (بحث + فلاتر + ترتيب) |
| `/category/:slug` | صفحة تصنيف |
| `/product/:slug` | تفاصيل المنتج |
| `/cart` | السلة |
| `/wishlist` | المفضلة |
| `/external-order` | اطلبي من الخارج |
| `/contact` | تواصلي معنا |
| `/privacy` | سياسة الخصوصية |
| `/terms` | الشروط والأحكام |
| أي مسار آخر | صفحة 404 |

### التقنيات

React 18 · TypeScript · Vite 6 · Tailwind CSS 3 · React Router 7 · Framer Motion · Lucide React

---

## 12. كيف تعمل رسائل واتساب

كل الرسائل تُبنى في ملف واحد: 📄 **`src/utils/whatsapp.ts`**

| الدالة | الاستخدام |
| --- | --- |
| `createWhatsAppLink(message)` | تبني رابط `https://wa.me/...` مع ترميز صحيح |
| `createProductOrderMessage(product, qty, options)` | طلب منتج واحد |
| `createCartOrderMessage(items, total)` | طلب السلة كاملة |
| `createExternalOrderMessage(form)` | طلب من موقع خارجي |
| `createContactMessage(text?)` | رسالة تواصل عامة |
| `openWhatsApp(message)` | تفتح واتساب، أو تُرجع رسالة خطأ إن لم يُضبط الرقم |

جميع الرسائل تُرمَّز بـ `encodeURIComponent()` حتى تصل الأحرف العربية والأسطر
الجديدة والرموز التعبيرية سليمة.

### مثال على رسالة طلب منتج

```
مرحبًا VOUTIQUE 🌸

أرغب في طلب المنتج التالي:

المنتج: عطر ورد فاخر
السعر: 12,500 أوقية
الكمية: 3
الإجمالي: 37,500 أوقية

الحجم: 100 مل

شكرًا 🌷
```

### مثال على رسالة السلة

```
مرحبًا VOUTIQUE 🌸

أرغب في طلب:

1. عطر ورد فاخر
   الكمية: 1
   السعر: 12,500 أوقية
   الإجمالي: 12,500 أوقية
   الحجم: 50 مل

2. كريم ترطيب فاخر
   الكمية: 2
   السعر: 4,800 أوقية
   الإجمالي: 9,600 أوقية

إجمالي الطلب:
22,100 أوقية

سأتواصل معكم لإكمال تفاصيل التوصيل والدفع.
```

### السلة والمفضلة

تُحفظان في **`localStorage`** داخل متصفح العميلة فقط:

- `voutique:cart:v1`
- `voutique:wishlist:v1`

لا تُرسل إلى أي خادم، ولا تختفي عند إعادة تحميل الصفحة.

---

## 13. التطوير المستقبلي (3D)

المشروع مُهيَّأ لإضافة عرض ثلاثي الأبعاد لاحقًا **دون إعادة بناء الموقع**:

- كل عرض لصورة منتج يمرّ عبر مكوّن واحد: 📄 `src/components/product/ProductVisual.tsx`
- المكوّن يقبل خاصية `overlay` جاهزة لاستقبال طبقة إضافية.
- `HeroSection` و `ProductShowcase` و `ProductGallery` تستخدم هذا المكوّن،
  فأي ترقية بصرية تنطبق على الموقع كله تلقائيًا.

عند الحاجة لاحقًا:

```bash
npm install three @react-three/fiber @react-three/drei
```

ثم استبدلي `<img>` داخل `ProductVisual.tsx` بـ `<Canvas>` — ولا تحتاجين لتعديل
أي صفحة أخرى.

> لم نضف هذه المكتبات الآن لأنها تزيد حجم الموقع بشكل كبير دون فائدة حالية.

---

## أسئلة سريعة

**لماذا لا يفتح واتساب عند الضغط على زر الطلب؟**
لأن `whatsappNumber` ما زال `222XXXXXXXX`. راجعي [القسم 3](#3--تغيير-رقم-واتساب-مهم).

**أضفت منتجًا ولا يظهر.**
تأكدي أن `category` يطابق `slug` تصنيف موجود في `src/data/categories.ts`،
وأن `id` و `slug` غير مكررين.

**الصورة لا تظهر.**
تأكدي أن الملف داخل `public/images/products/` وأن المسار يبدأ بـ `/images/`
وليس `/public/images/`.

**كيف أخفي منتجًا مؤقتًا؟**
اجعلي `available: false` ليظهر «غير متوفر حاليًا»، أو احذفي العنصر بالكامل.
