/**
 * تجهيز صور الهاتف قبل رفعها.
 *
 * صور كاميرا الهاتف تكون عادةً 3–12 ميغابايت؛ رفعها كما هي بطيء على
 * بيانات الجوال ويثقل المتجر على الزائرات. نصغّرها هنا إلى 1600 بكسل
 * كحد أقصى ونحفظها JPEG بجودة عالية (عادةً 200–500 كيلوبايت).
 */

const MAX_SIDE = 1600;
const JPEG_QUALITY = 0.85;
/** حد أمان لقراءة الملف الأصلي قبل الضغط. */
const MAX_INPUT_BYTES = 30 * 1024 * 1024;

export async function prepareImage(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) {
    throw new Error(`«${file.name}» ليس صورة.`);
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error(`«${file.name}» كبير جدًا (أكثر من 30 ميغابايت).`);
  }

  let decoded: DecodedImage;
  try {
    decoded = await decodeImage(file);
  } catch {
    throw new Error(`تعذّرت قراءة «${file.name}». جرّبي صورة بصيغة JPG أو PNG.`);
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(decoded.width, decoded.height));
  const width = Math.round(decoded.width * scale);
  const height = Math.round(decoded.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    decoded.release();
    throw new Error('المتصفح لا يدعم معالجة الصور.');
  }

  // خلفية بيضاء: صور PNG الشفافة تصبح سوداء في JPEG بدونها
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.drawImage(decoded.source, 0, 0, width, height);
  decoded.release();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY),
  );
  if (!blob) throw new Error(`تعذّر تجهيز «${file.name}».`);

  return blob;
}

interface DecodedImage {
  source: CanvasImageSource;
  width: number;
  height: number;
  release: () => void;
}

/**
 * يفكّ ترميز الصورة. المتصفحات الحديثة تطبّق اتجاه الكاميرا (EXIF)
 * تلقائيًا في الطريقتين، فلا تظهر الصورة مقلوبة.
 */
async function decodeImage(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file);
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        release: () => bitmap.close(),
      };
    } catch {
      // بعض المتصفحات القديمة تدعم الدالة جزئيًا — ننتقل إلى الطريقة البديلة
    }
  }

  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}
