import type { Product } from '@/types';

/**
 * ══════════════════════════════════════════════════════════════════
 *  منتجات متجر VOUTIQUE
 *
 *  ➕ لإضافة منتج جديد: انسخي أي عنصر من القائمة والصقيه، ثم غيّري:
 *      id            معرّف فريد لا يتكرر (مثل 'p-031')
 *      name          اسم المنتج بالعربية
 *      slug          الرابط بالإنجليزية بحروف صغيرة وشرطات (يظهر في /product/slug)
 *      price         السعر بالأوقية — رقم فقط بلا فواصل
 *      oldPrice      السعر قبل الخصم (احذفي السطر إن لم يوجد خصم)
 *      category      يجب أن يطابق slug في src/data/categories.ts
 *      image         ضعي صورتك في public/images/products/ ثم اكتبي المسار
 *      available     true = متوفر  |  false = غير متوفر (يُمنع طلبه)
 *
 *  🖼 الصور: ضعي ملفاتك في  public/images/products/  واستخدمي المسار
 *      '/images/products/اسم-الملف.jpg'
 *      إن لم توجد صورة، سيعرض الموقع صورة بديلة تلقائيًا.
 *
 *  ⚠ لا تحتاجين لتعديل أي مكوّن آخر — كل الصفحات تقرأ من هذا الملف.
 * ══════════════════════════════════════════════════════════════════
 */
export const products: Product[] = [
  // ─────────────────────────── العطور النسائية ───────────────────────────
  {
    id: 'p-001',
    name: 'عطر ورد فاخر',
    slug: 'luxury-rose-perfume',
    shortDescription: 'ورد دمشقي وقلب زهري بثبات طويل.',
    description:
      'عطر نسائي فاخر يفتتح بنفحات من الورد الدمشقي الطازج، يتبعها قلب من الفاوانيا والياسمين، وينتهي بقاعدة دافئة من المسك الأبيض وخشب الصندل. ثبات يمتد لساعات طويلة ويناسب المناسبات المسائية والإطلالات الراقية.',
    price: 12500,
    oldPrice: 15000,
    category: 'perfumes',
    brand: 'Maison VOUTIQUE',
    gender: 'women',
    image: '/images/products/rose-perfume.svg',
    badge: 'bestseller',
    featured: true,
    bestSeller: true,
    available: true,
    size: '100 مل',
    ingredients: 'كحول، ماء، زيوت عطرية طبيعية، مستخلص الورد الدمشقي، مسك أبيض.',
    options: [{ label: 'الحجم', values: ['50 مل', '100 مل'] }],
  },
  {
    id: 'p-002',
    name: 'عطر المسك الأبيض',
    slug: 'white-musk-perfume',
    shortDescription: 'مسك ناعم ونظيف يصلح للاستخدام اليومي.',
    description:
      'عطر ناعم يقوم على المسك الأبيض النقي مع لمسة من الفانيليا والبودرة. رائحة نظيفة وهادئة تناسب النهار والعمل والاستخدام اليومي دون مبالغة.',
    price: 9800,
    category: 'perfumes',
    brand: 'Maison VOUTIQUE',
    gender: 'women',
    image: '/images/products/white-musk.svg',
    featured: true,
    bestSeller: true,
    available: true,
    size: '75 مل',
    ingredients: 'كحول، ماء، مسك أبيض، فانيليا، نوتات بودرية.',
  },
  {
    id: 'p-003',
    name: 'عطر ياسمين الليل',
    slug: 'jasmine-night-perfume',
    shortDescription: 'ياسمين شرقي دافئ لسهرات المساء.',
    description:
      'تركيبة شرقية زهرية تعتمد على الياسمين العربي مع العنبر والفانيليا. حضور أنثوي دافئ يناسب السهرات والمناسبات الخاصة.',
    price: 14200,
    oldPrice: 16800,
    category: 'perfumes',
    brand: 'Lumière',
    gender: 'women',
    image: '/images/products/jasmine-night.svg',
    badge: 'sale',
    featured: true,
    available: true,
    size: '100 مل',
    options: [{ label: 'الحجم', values: ['50 مل', '100 مل'] }],
  },
  {
    id: 'p-004',
    name: 'عطر العنبر الحريري',
    slug: 'amber-silk-perfume',
    shortDescription: 'عنبر دافئ مع لمسة من الصندل.',
    description:
      'عطر شرقي دافئ يجمع بين العنبر وخشب الصندل والفانيليا، بثبات عالٍ وانتشار متوسط يناسب أجواء الشتاء والمساء.',
    price: 11500,
    category: 'perfumes',
    brand: 'Lumière',
    gender: 'women',
    image: '/images/products/amber-silk.svg',
    available: true,
    size: '90 مل',
  },
  {
    id: 'p-005',
    name: 'عطر زهرة الفانيليا',
    slug: 'vanilla-bloom-perfume',
    shortDescription: 'فانيليا كريمية بلمسة زهرية خفيفة.',
    description:
      'عطر حلو ومريح يقوم على الفانيليا الكريمية مع نوتات من جوز الهند والزهور البيضاء. خيار محبب للاستخدام اليومي في الأجواء المعتدلة.',
    price: 8900,
    category: 'perfumes',
    brand: 'Noor Beauty',
    gender: 'women',
    image: '/images/products/vanilla-bloom.svg',
    badge: 'new',
    available: true,
    size: '75 مل',
  },
  {
    id: 'p-006',
    name: 'عطر العود الملكي',
    slug: 'royal-oud-perfume',
    shortDescription: 'عود شرقي فاخر يناسب الجنسين.',
    description:
      'عطر شرقي فاخر يعتمد على العود الطبيعي مع الورد والزعفران. حضور قوي وثبات طويل يناسب المناسبات الخاصة، ومصمّم ليناسب الجنسين.',
    price: 18500,
    category: 'perfumes',
    brand: 'Maison VOUTIQUE',
    gender: 'unisex',
    image: '/images/products/oud-royal.svg',
    badge: 'limited',
    featured: true,
    available: true,
    size: '100 مل',
    options: [{ label: 'الحجم', values: ['50 مل', '100 مل'] }],
  },

  // ─────────────────────────── العطور الرجالية ───────────────────────────
  {
    id: 'p-007',
    name: 'عطر رجالي كلاسيكي',
    slug: 'classic-men-perfume',
    shortDescription: 'خشبي عنبري بثبات عالٍ.',
    description:
      'عطر رجالي كلاسيكي يجمع بين البرغموت في المقدمة، والتوابل الدافئة في القلب، وقاعدة خشبية عنبرية قوية. خيار مناسب للسهرات ومواسم الشتاء.',
    price: 13900,
    oldPrice: 16500,
    category: 'perfumes-men',
    brand: 'Lumière',
    gender: 'men',
    image: '/images/products/classic-men.svg',
    badge: 'sale',
    featured: true,
    bestSeller: true,
    available: true,
    size: '100 مل',
    options: [{ label: 'الحجم', values: ['50 مل', '100 مل'] }],
  },
  {
    id: 'p-008',
    name: 'عود رجالي فاخر',
    slug: 'oud-men-perfume',
    shortDescription: 'عود صافٍ مع مسك وتوابل.',
    description:
      'عطر رجالي شرقي يعتمد على العود الصافي مع المسك والتوابل الدافئة. انتشار قوي وثبات يمتد لساعات طويلة.',
    price: 17200,
    category: 'perfumes-men',
    brand: 'Maison VOUTIQUE',
    gender: 'men',
    image: '/images/products/oud-men.svg',
    available: true,
    size: '100 مل',
  },
  {
    id: 'p-009',
    name: 'عطر رياضي منعش',
    slug: 'sport-men-perfume',
    shortDescription: 'حمضي منعش للاستخدام النهاري.',
    description:
      'عطر رجالي منعش يفتح بالليمون والبرغموت مع قلب مائي ونوتات خشبية خفيفة. مثالي للنهار والأجواء الحارة.',
    price: 7900,
    category: 'perfumes-men',
    brand: 'Noor Beauty',
    gender: 'men',
    image: '/images/products/sport-men.svg',
    badge: 'new',
    available: true,
    size: '90 مل',
  },
  {
    id: 'p-010',
    name: 'عطر الجلد والتوابل',
    slug: 'leather-men-perfume',
    shortDescription: 'جلد وتوابل بطابع كلاسيكي أنيق.',
    description:
      'تركيبة رجالية جريئة تجمع بين نوتة الجلد والتوابل والتبغ الحلو. خيار لمن يفضّل العطور ذات الشخصية القوية.',
    price: 15400,
    category: 'perfumes-men',
    brand: 'Lumière',
    gender: 'men',
    image: '/images/products/leather-men.svg',
    available: false,
    size: '100 مل',
  },

  // ─────────────────────────────── العناية ───────────────────────────────
  {
    id: 'p-011',
    name: 'كريم ترطيب فاخر',
    slug: 'luxury-moisturizer',
    shortDescription: 'ترطيب يدوم 24 ساعة دون ملمس دهني.',
    description:
      'كريم مرطب غني بحمض الهيالورونيك وزبدة الشيا، يمنح البشرة ترطيبًا يدوم 24 ساعة دون ملمس دهني. مناسب للبشرة الجافة والعادية.',
    price: 4800,
    category: 'care',
    brand: 'Derma Care',
    gender: 'women',
    image: '/images/products/moisturizer.svg',
    featured: true,
    bestSeller: true,
    available: true,
    size: '50 مل',
    ingredients: 'ماء، جليسرين، حمض الهيالورونيك، زبدة الشيا، فيتامين E.',
  },
  {
    id: 'p-012',
    name: 'سيروم فيتامين سي',
    slug: 'vitamin-c-serum',
    shortDescription: 'يوحّد لون البشرة ويمنحها إشراقًا.',
    description:
      'سيروم مركّز بفيتامين سي يساعد على توحيد لون البشرة وتقليل آثار البقع الداكنة مع الاستخدام المنتظم صباحًا. يُستخدم قبل المرطب وواقي الشمس.',
    price: 6200,
    oldPrice: 7400,
    category: 'care',
    brand: 'Derma Care',
    gender: 'women',
    image: '/images/products/vitamin-c-serum.svg',
    badge: 'sale',
    featured: true,
    available: true,
    size: '30 مل',
    ingredients: 'ماء، فيتامين سي 10%، فيتامين E، حمض الفيروليك.',
  },
  {
    id: 'p-013',
    name: 'ماسك الطين المنقّي',
    slug: 'clay-face-mask',
    shortDescription: 'ينقّي المسام ويقلل اللمعان.',
    description:
      'ماسك بالطين الأخضر ومستخلص الشاي الأخضر، ينقّي المسام ويمتص الزيوت الزائدة. يُستخدم مرتين أسبوعيًا لمدة 10 دقائق.',
    price: 3600,
    category: 'care',
    brand: 'Derma Care',
    gender: 'women',
    image: '/images/products/face-mask.svg',
    available: true,
    size: '100 غ',
  },
  {
    id: 'p-014',
    name: 'واقي شمس يومي',
    slug: 'daily-sunscreen',
    shortDescription: 'حماية SPF 50 بملمس خفيف.',
    description:
      'واقي شمس بعامل حماية 50 بملمس خفيف لا يترك أثرًا أبيض، مناسب للاستخدام اليومي تحت المكياج.',
    price: 5400,
    category: 'care',
    brand: 'Derma Care',
    gender: 'unisex',
    image: '/images/products/sunscreen.svg',
    badge: 'new',
    available: true,
    size: '50 مل',
  },
  {
    id: 'p-015',
    name: 'زيت الأرغان للشعر',
    slug: 'argan-hair-oil',
    shortDescription: 'يغذي الشعر ويحمي الأطراف من التقصف.',
    description:
      'زيت أرغان مغربي نقي يغذي فروة الرأس ويحمي الأطراف من التقصف. يُستخدم قبل الاستحمام أو كلمسة نهائية على الأطراف.',
    price: 3400,
    category: 'care',
    brand: 'Silk Hair',
    gender: 'women',
    image: '/images/products/hair-oil.svg',
    bestSeller: true,
    available: true,
    size: '100 مل',
  },
  {
    id: 'p-016',
    name: 'مجموعة العناية بالشعر',
    slug: 'hair-care-set',
    shortDescription: 'شامبو وبلسم وزيت في مجموعة واحدة.',
    description:
      'مجموعة كاملة للعناية بالشعر تتكون من شامبو خالٍ من السلفات، وبلسم مغذٍ، وزيت أرغان للأطراف. تعيد للشعر لمعانه ونعومته.',
    price: 8900,
    category: 'care',
    brand: 'Silk Hair',
    gender: 'women',
    image: '/images/products/hair-set.svg',
    featured: true,
    bestSeller: true,
    available: true,
  },
  {
    id: 'p-017',
    name: 'مقشر الجسم بالسكر',
    slug: 'sugar-body-scrub',
    shortDescription: 'ينعّم الجسم ويرطبه برائحة زهرية.',
    description:
      'مقشر جسم بحبيبات السكر الطبيعية وزيت اللوز، يزيل خلايا الجلد الميتة ويترك البشرة ناعمة ومرطبة برائحة زهرية خفيفة.',
    price: 2900,
    category: 'care',
    brand: 'Maison VOUTIQUE',
    gender: 'women',
    image: '/images/products/body-scrub.svg',
    badge: 'new',
    available: true,
    size: '200 غ',
  },
  {
    id: 'p-018',
    name: 'لوشن الجسم المرطب',
    slug: 'body-lotion',
    shortDescription: 'سريع الامتصاص لترطيب يومي.',
    description:
      'لوشن خفيف سريع الامتصاص يمنح الجسم ترطيبًا يوميًا دون ملمس لزج، برائحة ناعمة تدوم طويلًا.',
    price: 2600,
    category: 'care',
    brand: 'Maison VOUTIQUE',
    gender: 'women',
    image: '/images/products/body-lotion.svg',
    available: true,
    size: '250 مل',
  },

  // ────────────────────────── مستحضرات التجميل ──────────────────────────
  {
    id: 'p-019',
    name: 'أحمر شفاه مخملي',
    slug: 'velvet-lipstick',
    shortDescription: 'ملمس مخملي مطفي وثبات طويل.',
    description:
      'أحمر شفاه بتركيبة مخملية خفيفة على الشفاه، يمنح تغطية كاملة بلمسة واحدة دون جفاف. متوفر بعدة درجات تناسب البشرة السمراء والفاتحة.',
    price: 2400,
    oldPrice: 3200,
    category: 'makeup',
    brand: 'Noor Beauty',
    gender: 'women',
    image: '/images/products/lipstick.svg',
    badge: 'bestseller',
    featured: true,
    bestSeller: true,
    available: true,
    ingredients: 'زبدة الشيا، فيتامين E، أصباغ تجميلية آمنة.',
    options: [{ label: 'اللون', values: ['أحمر كلاسيكي', 'وردي موف', 'نود دافئ', 'عنابي'] }],
  },
  {
    id: 'p-020',
    name: 'ماسكارا تكثيف الرموش',
    slug: 'volume-mascara',
    shortDescription: 'تكثيف وتطويل بدون تكتّل.',
    description:
      'ماسكارا بفرشاة مخروطية تمنح الرموش كثافة وطولًا دون تكتّل، مقاومة للتلطخ وسهلة الإزالة بالماء الدافئ.',
    price: 2100,
    category: 'makeup',
    brand: 'Noor Beauty',
    gender: 'women',
    image: '/images/products/mascara.svg',
    available: true,
    options: [{ label: 'اللون', values: ['أسود', 'بني'] }],
  },
  {
    id: 'p-021',
    name: 'كريم أساس مطفي',
    slug: 'matte-foundation',
    shortDescription: 'تغطية متوسطة بمظهر طبيعي.',
    description:
      'كريم أساس بتغطية متوسطة قابلة للبناء ولمسة نهائية مطفية طبيعية، يدوم حتى 12 ساعة دون تأكسد.',
    price: 4200,
    category: 'makeup',
    brand: 'Noor Beauty',
    gender: 'women',
    image: '/images/products/foundation.svg',
    available: true,
    size: '30 مل',
    options: [{ label: 'الدرجة', values: ['فاتح', 'متوسط', 'حنطي', 'داكن'] }],
  },
  {
    id: 'p-022',
    name: 'أحمر خدود وردي',
    slug: 'rose-blush',
    shortDescription: 'لمسة وردية طبيعية على الوجنتين.',
    description:
      'أحمر خدود بودري ناعم يمتزج بسهولة ويمنح الوجنتين لونًا ورديًا طبيعيًا يدوم طوال اليوم.',
    price: 1900,
    category: 'makeup',
    brand: 'Noor Beauty',
    gender: 'women',
    image: '/images/products/blush.svg',
    available: true,
    options: [{ label: 'اللون', values: ['وردي فاتح', 'مشمشي', 'موف'] }],
  },
  {
    id: 'p-023',
    name: 'باليت ظلال العيون',
    slug: 'eyeshadow-palette',
    shortDescription: '12 درجة بين المطفي واللامع.',
    description:
      'باليت يضم 12 درجة متناسقة بين المطفي واللامع، بتركيبة عالية التصبّغ تناسب الإطلالات النهارية والمسائية.',
    price: 5600,
    oldPrice: 6900,
    category: 'makeup',
    brand: 'Noor Beauty',
    gender: 'women',
    image: '/images/products/eyeshadow-palette.svg',
    badge: 'sale',
    featured: true,
    available: true,
  },

  // ────────────────────────── النظافة والجمال ──────────────────────────
  {
    id: 'p-024',
    name: 'صابون الحليب والعسل',
    slug: 'honey-milk-soap',
    shortDescription: 'صابون طبيعي لطيف على البشرة.',
    description:
      'صابون مصنوع يدويًا من الحليب والعسل وزيت الزيتون، ينظف البشرة بلطف دون أن يسبب الجفاف. مناسب لجميع أنواع البشرة.',
    price: 900,
    category: 'hygiene',
    brand: 'Maison VOUTIQUE',
    gender: 'unisex',
    image: '/images/products/honey-soap.svg',
    available: true,
    size: '120 غ',
  },
  {
    id: 'p-025',
    name: 'مزيل عرق لطيف',
    slug: 'gentle-deodorant',
    shortDescription: 'حماية تدوم 48 ساعة بلا كحول.',
    description:
      'مزيل عرق خالٍ من الكحول، يمنح حماية تدوم حتى 48 ساعة برائحة منعشة، ولا يترك آثارًا على الملابس.',
    price: 1200,
    category: 'hygiene',
    brand: 'Noor Beauty',
    gender: 'unisex',
    image: '/images/products/deodorant.svg',
    available: true,
  },
  {
    id: 'p-026',
    name: 'كريم اليدين المغذي',
    slug: 'nourishing-hand-cream',
    shortDescription: 'ترطيب سريع لليدين الجافة.',
    description:
      'كريم يدين غني بزبدة الشيا وفيتامين E، يمتص بسرعة ويحمي اليدين من الجفاف والتشقق.',
    price: 1400,
    category: 'hygiene',
    brand: 'Derma Care',
    gender: 'women',
    image: '/images/products/hand-cream.svg',
    available: true,
    size: '75 مل',
  },
  {
    id: 'p-027',
    name: 'غسول الجسم المنعش',
    slug: 'refreshing-shower-gel',
    shortDescription: 'رغوة غنية برائحة منعشة.',
    description:
      'غسول جسم بتركيبة لطيفة ورغوة غنية، ينظف البشرة ويتركها منتعشة برائحة تدوم بعد الاستحمام.',
    price: 1800,
    category: 'hygiene',
    brand: 'Maison VOUTIQUE',
    gender: 'unisex',
    image: '/images/products/shower-gel.svg',
    available: true,
    size: '400 مل',
  },

  // ─────────────────────────────── الهدايا ───────────────────────────────
  {
    id: 'p-028',
    name: 'مجموعة هدية العطور',
    slug: 'perfume-gift-set',
    shortDescription: 'عطران ولوشن داخل علبة أنيقة.',
    description:
      'مجموعة هدية فاخرة داخل علبة أنيقة، تضم عطرين بحجم 50 مل ولوشن جسم مرطب. خيار مثالي لأعياد الميلاد والمناسبات، ويمكن إضافة رسالة هدية عند الطلب.',
    price: 21000,
    oldPrice: 25000,
    category: 'gifts',
    brand: 'Maison VOUTIQUE',
    gender: 'women',
    image: '/images/products/gift-perfume-set.svg',
    badge: 'bestseller',
    featured: true,
    bestSeller: true,
    available: true,
    options: [{ label: 'التغليف', values: ['تغليف هدية', 'بدون تغليف'] }],
  },
  {
    id: 'p-029',
    name: 'مجموعة هدية العناية',
    slug: 'care-gift-set',
    shortDescription: 'كريم وسيروم ومقشر مع بطاقة تهنئة.',
    description:
      'مجموعة عناية متكاملة تضم كريم ترطيب وسيروم ومقشرًا لطيفًا داخل علبة هدية أنيقة مع بطاقة تهنئة.',
    price: 16500,
    category: 'gifts',
    brand: 'Derma Care',
    gender: 'women',
    image: '/images/products/gift-care-set.svg',
    badge: 'new',
    featured: true,
    available: true,
    options: [{ label: 'التغليف', values: ['تغليف هدية', 'بدون تغليف'] }],
  },
  {
    id: 'p-030',
    name: 'علبة الهدية الفاخرة',
    slug: 'luxe-gift-box',
    shortDescription: 'مختارات VOUTIQUE في علبة واحدة.',
    description:
      'علبة هدية فاخرة تضم مختارات من العطور ومستحضرات العناية والتجميل، مغلّفة يدويًا بشريط ساتان وبطاقة مخصصة.',
    price: 28000,
    category: 'gifts',
    brand: 'Maison VOUTIQUE',
    gender: 'women',
    image: '/images/products/gift-box-luxe.svg',
    badge: 'limited',
    available: true,
    options: [{ label: 'التغليف', values: ['تغليف هدية', 'بدون تغليف'] }],
  },

  {
    id: 'p-031',
    name: 'الواقي الحراري للشعر',
    slug: 'tresemme-heat-protecting-spray',
    shortDescription: 'حماية من حرارة الاستشوار وأدوات التصفيف حتى 450°F.',
    description:
      'بخاخ تصفيف يحمي الشعر من حرارة أدوات التصفيف حتى 450 درجة فهرنهايت، ويعمل كأساس (Primer) قبل التصفيف لتقليل التقصف والتكسر. يُرش على الشعر الرطب أو الجاف قبل استخدام المكواة أو السيشوار، ويترك الشعر ناعمًا ولامعًا دون ثقل.',
    price: 600,
    category: 'care',
    brand: 'TRESemmé',
    gender: 'women',
    image: '/images/products/tresemme-heat-spray.jpeg',
    badge: 'new',
    featured: true,
    bestSeller: true,
    available: true,
    ingredients: 'ماء، بوليمرات واقية من الحرارة، مرطبات، عطر.',
  },

  {
    id: 'p-034',
    name: 'شفرات فلامينجو النسائية لإزالة الشعر',
    slug: 'feather-flamingos-razor',
    shortDescription: 'أداة آمنة لإزالة شعر الوجه والجسم مع حماية للبشرة.',
    description:
      'شفرات Feather Flamingos لإزالة شعر الوجه والجسم بأمان، مزوّدة بحارس أمان يحمي البشرة أثناء الاستخدام.',
    price: 120,
    category: 'care',
    brand: 'Feather',
    gender: 'women',
    image: '/images/products/flamingos-razors.jpeg',
    featured: true,
    available: true,
  },
  {
    id: 'p-033',
    name: 'زيت فازلين لتوحيد لون البشرة وترطيبها',
    slug: 'vaseline-vitamin-b3-body-oil',
    shortDescription: 'زيت مرطب للجسم يوحّد لون البشرة ويمنحها إشراقة صحية.',
    description:
      'زيت جسم مكثف العناية من فازلين، مدعّم بفيتامين B3، ينعّم البشرة ويوحّد لونها ويمنحها إشراقة صحية.',
    price: 320,
    category: 'care',
    brand: 'Vaseline',
    gender: 'unisex',
    image: '/images/products/vaseline-vitamin-b3.jpeg',
    badge: 'new',
    featured: true,
    bestSeller: true,
    available: true,
    size: '200 مل',
  },
  {
    id: 'p-036',
    name: 'قناع العناية العميقة للشعر',
    slug: 'hair-mask-deep-care',
    shortDescription: 'يمنح الشعر نعومة ولمعانًا ومظهرًا أكثر حيوية.',
    description:
      'قناع عناية وترطيب للشعر (Hair Mask Deep Care) يساعد على منح الشعر نعومة ولمعانًا ومظهرًا أكثر حيوية، متوفر بثلاثة ألوان.',
    price: 100,
    category: 'care',
    gender: 'women',
    image: '/images/products/hair-mask.jpeg',
    badge: 'new',
    featured: true,
    available: true,
    options: [{ label: 'اللون', values: ['وردي', 'أزرق', 'بنفسجي'] }],
  },
  {
    id: 'p-037',
    name: 'بيور سيدكشن — بخاخ عطري أنثوي',
    slug: 'pure-seduction-fragrance-mist',
    shortDescription: 'رائحة أنثوية ناعمة وجذابة من Victoria\'s Secret.',
    description:
      'Pure Seduction Fragrance Mist من Victoria\'s Secret — بخاخ عطري أنثوي ناعم وجذاب، مثالي للاستخدام اليومي وتجديد الإحساس بالانتعاش.',
    price: 450,
    category: 'perfumes',
    brand: "Victoria's Secret",
    gender: 'women',
    image: '/images/products/pure-seduction.jpeg',
    featured: true,
    bestSeller: true,
    available: true,
    size: '250 مل / 8.4 fl.oz',
  },
  {
    id: 'p-038',
    name: 'ميس لافارنا — عطر زيتي فاخر',
    slug: 'miss-lavarna-perfume-oil',
    shortDescription: 'عطر أنثوي جريء بلا كحول.',
    description:
      'Miss Lavarna من Clive Dorris — عطر زيتي فاخر مركّز بلا كحول، حجم صغير ورائحة تدوم، مثالي للحقيبة والاستخدام اليومي.',
    price: 100,
    category: 'perfumes',
    brand: 'Clive Dorris',
    gender: 'women',
    image: '/images/products/miss-lavarna.jpeg',
    available: true,
    size: '20 مل',
  },
  {
    id: 'p-039',
    name: 'رول أون — عطر زيتي فاخر',
    slug: 'clive-dorris-roll-on-perfume',
    shortDescription: 'عطر زيتي مركّز بلا كحول بتطبيق رول أون عملي.',
    description:
      'Roll On Perfume من Clive Dorris — عطر زيتي فاخر مركّز بلا كحول، حجم صغير ورائحة تدوم، مثالي للحقيبة والاستخدام اليومي.',
    price: 100,
    category: 'perfumes',
    brand: 'Clive Dorris',
    gender: 'women',
    image: '/images/products/roll-on-perfume.jpeg',
    available: true,
    size: '20 مل',
  },
  {
    id: 'p-040',
    name: 'ماي واي — عطركِ بطريقتك',
    slug: 'clive-dorris-my-way',
    shortDescription: 'عطر زيتي فاخر مركّز بلا كحول.',
    description:
      'My Way من Clive Dorris — عطر زيتي فاخر مركّز بلا كحول، حجم صغير ورائحة تدوم، مثالي للحقيبة والاستخدام اليومي.',
    price: 100,
    category: 'perfumes',
    brand: 'Clive Dorris',
    gender: 'women',
    image: '/images/products/my-way.jpeg',
    available: true,
    size: '20 مل',
  },
  {
    id: 'p-041',
    name: 'يارا — عطر ناعم',
    slug: 'clive-dorris-yara',
    shortDescription: 'عطر يارا الناعم بلا كحول.',
    description:
      'Yara من Clive Dorris — عطر زيتي فاخر مركّز بلا كحول، حجم صغير ورائحة تدوم، مثالي للحقيبة والاستخدام اليومي.',
    price: 100,
    category: 'perfumes',
    brand: 'Clive Dorris',
    gender: 'women',
    image: '/images/products/yara.jpeg',
    available: true,
    size: '20 مل',
  },
  {
    id: 'p-042',
    name: 'بودرة Raindrops من Ajmal',
    slug: 'ajmal-raindrops-body-powder',
    shortDescription: 'لمسة ناعمة وعطرية تدوم معك طوال اليوم.',
    description: 'بودرة جسم معطرة من Ajmal، لمسة ناعمة وعطرية تدوم معك طوال اليوم.',
    price: 250,
    category: 'care',
    brand: 'Ajmal',
    gender: 'women',
    image: '/images/products/raindrops-ajmal.jpeg',
    available: true,
  },
  {
    id: 'p-043',
    name: 'بودرة Evoke Her المعطرة من Ajmal',
    slug: 'ajmal-evoke-her-body-powder',
    shortDescription: 'لمسة ناعمة تمنح بشرتك انتعاشًا ورائحة أنثوية جميلة.',
    description:
      'بودرة Evoke Her المعطرة من Ajmal — لمسة ناعمة وعطرة تمنح بشرتك إحساسًا بالانتعاش ورائحة أنثوية جميلة. مثالية للاستخدام اليومي وبعد الاستحمام.',
    price: 250,
    category: 'care',
    brand: 'Ajmal',
    gender: 'women',
    image: '/images/products/evoke-her-ajmal.jpeg',
    available: true,
  },
  {
    id: 'p-044',
    name: 'بودرة أجمل Sacred Love المعطرة للجسم',
    slug: 'ajmal-sacred-love-body-powder',
    shortDescription: 'بودرة جسم معطرة بحجم 100 جم.',
    description: 'بودرة أجمل Sacred Love المعطرة للجسم — 100 جم من Ajmal.',
    price: 250,
    category: 'care',
    brand: 'Ajmal',
    gender: 'women',
    image: '/images/products/sacred-love-ajmal.jpeg',
    available: true,
    size: '100 غ',
  },
  {
    id: 'p-045',
    name: 'Ajmal Sacrifice For Her — بودرة جسم معطرة',
    slug: 'ajmal-sacrifice-for-her-body-powder',
    shortDescription: 'بودرة جسم معطرة برائحة أنثوية جذابة.',
    description: 'Ajmal Sacrifice For Her — بودرة جسم معطرة برائحة أنثوية جذابة من Ajmal.',
    price: 250,
    category: 'care',
    brand: 'Ajmal',
    gender: 'women',
    image: '/images/products/sacrifice-for-her-ajmal.jpeg',
    available: true,
  },
  {
    id: 'p-046',
    name: 'Dior Homme 2020 — العطر الأسطوري النادر',
    slug: 'dior-homme-2020',
    shortDescription: 'العطر الأسطوري النادر من Dior.',
    description:
      'Dior Homme 2020 — عطر رجالي أسطوري ونادر من Dior، حضور قوي وثبات عالٍ يناسب من يبحث عن التميز.',
    price: 6000,
    category: 'perfumes-men',
    brand: 'Dior',
    gender: 'men',
    image: '/images/products/dior-homme-fragrance-for-man.jpeg',
    badge: 'limited',
    featured: true,
    bestSeller: true,
    available: true,
  },
  {
    id: 'p-047',
    name: 'Ajmal Aurum Summer — بودرة جسم معطرة',
    slug: 'ajmal-aurum-summer-body-powder',
    shortDescription: 'بودرة جسم معطرة من Ajmal بلمسة صيفية منعشة.',
    description: 'Ajmal Aurum Summer — بودرة جسم معطرة من Ajmal بلمسة صيفية منعشة.',
    price: 250,
    category: 'care',
    brand: 'Ajmal',
    gender: 'women',
    image: '/images/products/aurum-summer-ajmal.jpeg',
    available: true,
  },
  {
    id: 'p-048',
    name: 'Ajmal Viola — بودرة جسم معطرة من أجمل',
    slug: 'ajmal-viola-body-powder',
    shortDescription: 'بودرة جسم معطرة من Ajmal برائحة زهرية ناعمة.',
    description: 'Ajmal Viola — بودرة جسم معطرة من أجمل برائحة زهرية ناعمة.',
    price: 250,
    category: 'care',
    brand: 'Ajmal',
    gender: 'women',
    image: '/images/products/viola-ajmal.jpeg',
    available: true,
  },
  {
    id: 'p-049',
    name: 'Easy Fresh — كريم إزالة الشعر بالحليب والعسل',
    slug: 'easy-fresh-milk-honey-hair-removal-cream',
    shortDescription: 'كريم إزالة شعر لطيف على البشرة بالحليب والعسل.',
    description: 'Easy Fresh — كريم إزالة الشعر بالحليب والعسل، تركيبة لطيفة على البشرة.',
    price: 100,
    category: 'care',
    brand: 'Easy Fresh',
    gender: 'women',
    image: '/images/products/easy-fresh-milk-honey.jpeg',
    available: true,
  },
  {
    id: 'p-050',
    name: 'Easy Fresh Rose — كريم إزالة الشعر',
    slug: 'easy-fresh-rose-hair-removal-cream',
    shortDescription: 'كريم إزالة شعر برائحة الورد.',
    description: 'Easy Fresh Rose — كريم إزالة الشعر برائحة الورد.',
    price: 100,
    category: 'care',
    brand: 'Easy Fresh',
    gender: 'women',
    image: '/images/products/easy-fresh-rose.jpeg',
    available: true,
  },
  {
    id: 'p-051',
    name: "Aqua Kiss — بخاخ عطري أنثوي من Victoria's Secret",
    slug: 'aqua-kiss-victorias-secret-fragrance-mist',
    shortDescription: 'رائحة منعشة ومائية من Victoria\'s Secret.',
    description:
      "Aqua Kiss Fragrance Mist من Victoria's Secret — بخاخ عطري أنثوي منعش برائحة مائية، مثالي للاستخدام اليومي وتجديد الإحساس بالانتعاش.",
    price: 450,
    category: 'perfumes',
    brand: "Victoria's Secret",
    gender: 'women',
    image: '/images/products/aqua-kiss-victorias-secret.jpeg',
    available: true,
    size: '250 مل / 8.4 fl.oz',
  },
];

/**
 * ══════════════════════════════════════════════════════════════════
 *  منتجات بانتظار السعر — غير معروضة في المتجر حاليًا
 *
 *  لإظهار أحد هذه المنتجات: انسخي كائنه إلى المصفوفة `products` أعلاه
 *  (قبل `];` مباشرة)، وعدّلي price من 0 إلى السعر الحقيقي.
 * ══════════════════════════════════════════════════════════════════
 */
export const pendingProducts: Product[] = [
  {
    id: 'p-032',
    name: 'بخاخ زارا Twilight Mauve المنعش',
    slug: 'zara-twilight-mauve',
    shortDescription: 'بخاخ عطري منعش برائحة زهرية دافئة.',
    description:
      'بخاخ عطري (Refreshing Fragrance Mist) من زارا برائحة Twilight Mauve، مثالي للاستخدام اليومي وتجديد الإحساس بالانتعاش.',
    price: 0, // ⚠️ TODO: أدخلي السعر
    category: 'perfumes',
    brand: 'Zara',
    gender: 'women',
    image: '/images/products/zara-twilight-mauve.jpg',
    available: true,
    size: '250 مل / 8.4 fl.oz',
  },
];

/** صورة بديلة تُستخدم إن لم تتوفر صورة المنتج. */
export const PLACEHOLDER_IMAGE = '/images/products/placeholder.svg';

/**
 * هل للمنتج صورة حقيقية؟
 *
 * الصور التوضيحية المؤقتة كلها بصيغة SVG داخل public/images/products/،
 * أما صور المنتجات الفعلية فهي jpg/jpeg/png/webp. نستخدم هذا للتمييز
 * حتى تتصدّر المنتجات المصوَّرة فعليًا واجهة المتجر.
 *
 * بمجرد استبدال كل الصور التوضيحية بصور حقيقية، تصبح النتيجة true
 * للجميع ويعود الترتيب إلى معياره الطبيعي دون أي تعديل في الكود.
 */
export function hasRealPhoto(product: Product): boolean {
  return Boolean(product.image) && !product.image.toLowerCase().endsWith('.svg');
}

/** يقدّم المنتجات المصوَّرة فعليًا مع الحفاظ على الترتيب الأصلي داخل كل مجموعة. */
export function photosFirst(list: Product[]): Product[] {
  return [...list].sort((a, b) => Number(hasRealPhoto(b)) - Number(hasRealPhoto(a)));
}

const productsBySlug = new Map(products.map((product) => [product.slug, product]));
const productsById = new Map(products.map((product) => [product.id, product]));

export function getProductBySlug(slug: string): Product | undefined {
  return productsBySlug.get(slug);
}

export function getProductById(id: string): Product | undefined {
  return productsById.get(id);
}

/**
 * الأقسام المُنسَّقة على الصفحة الرئيسية (مختارة لكِ، الأكثر مبيعًا، وصلنا حديثًا)
 * تستبعد صور placeholder التوضيحية تمامًا بدل تأخيرها في الترتيب، حتى لا يظهر
 * أي رسم SVG بينما توجد صور حقيقية كافية للملء.
 */
export function getFeaturedProducts(limit = 8): Product[] {
  return products.filter((product) => product.featured && hasRealPhoto(product)).slice(0, limit);
}

export function getBestSellers(limit = 8): Product[] {
  return products
    .filter((product) => product.bestSeller && hasRealPhoto(product))
    .slice(0, limit);
}

export function getNewArrivals(limit = 8): Product[] {
  return products
    .filter((product) => product.badge === 'new' && hasRealPhoto(product))
    .slice(0, limit);
}

export function getByCategory(categorySlug: string): Product[] {
  return photosFirst(products.filter((product) => product.category === categorySlug));
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return photosFirst(
    products.filter((item) => item.category === product.category && item.id !== product.id),
  ).slice(0, limit);
}

/** أعلى سعر في الكتالوج — يُستخدم لضبط مرشّح السعر. */
export const MAX_PRODUCT_PRICE = products.reduce(
  (max, product) => Math.max(max, product.price),
  0,
);

export const BRANDS = [...new Set(products.map((p) => p.brand).filter(Boolean))] as string[];
