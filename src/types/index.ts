/** أنواع البيانات المشتركة في متجر VOUTIQUE. */

export type Gender = 'women' | 'men' | 'unisex';

export type BadgeKind = 'new' | 'sale' | 'bestseller' | 'limited';

export interface ProductOption {
  /** عنوان الخيار كما يظهر للعميلة: «اللون» أو «الحجم» أو «المقاس». */
  label: string;
  values: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  /** سطر قصير يظهر في البطاقة. */
  shortDescription: string;
  /** السعر بالأوقية الموريتانية — رقم صحيح بلا كسور. */
  price: number;
  /** السعر قبل الخصم. اتركيه undefined إن لم يكن هناك خصم. */
  oldPrice?: number;
  /** يجب أن يطابق حقل slug في src/data/categories.ts */
  category: string;
  brand?: string;
  gender: Gender;
  /** الصورة الرئيسية — مسار داخل مجلد public. */
  image: string;
  /** صور إضافية للمعرض (اختياري). */
  images?: string[];
  badge?: BadgeKind;
  featured?: boolean;
  bestSeller?: boolean;
  available: boolean;
  /** الحجم أو السعة، مثل «100 مل». */
  size?: string;
  ingredients?: string;
  /** خيارات مثل اللون والمقاس — تُرسل ضمن رسالة واتساب. */
  options?: ProductOption[];
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  image: string;
  /** اسم أيقونة من lucide-react. */
  icon: string;
  order: number;
}

/** عنصر داخل السلة — الخيارات المختارة جزء من هويته. */
export interface CartItem {
  productId: string;
  quantity: number;
  /** الخيارات المختارة: { "اللون": "وردي", "الحجم": "100 مل" } */
  selectedOptions: Record<string, string>;
}

/** عنصر سلة بعد ربطه بمنتج حقيقي وحساب إجماليه. */
export interface ResolvedCartItem extends CartItem {
  product: Product;
  lineTotal: number;
  /** مفتاح فريد يجمع المنتج مع الخيارات المختارة. */
  key: string;
}

export interface ExternalOrderForm {
  productName: string;
  productUrl: string;
  site: string;
  quantity: number;
  color: string;
  size: string;
  notes: string;
}

export type SortKey = 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'name';

export interface ShopFilters {
  search: string;
  category: string;
  gender: Gender | 'all';
  minPrice: number | null;
  maxPrice: number | null;
  availableOnly: boolean;
  onSaleOnly: boolean;
  sort: SortKey;
}
