/** روابط التنقّل الرئيسية — مصدر واحد للهيدر والدرج والفوتر. */
export interface NavLinkItem {
  label: string;
  to: string;
}

export const mainNav: NavLinkItem[] = [
  { label: 'الرئيسية', to: '/' },
  { label: 'المتجر', to: '/shop' },
  { label: 'العطور', to: '/category/perfumes' },
  { label: 'العناية', to: '/category/care' },
  { label: 'التجميل', to: '/category/makeup' },
  { label: 'الهدايا', to: '/category/gifts' },
  { label: 'اطلبي من الخارج', to: '/external-order' },
];

export const footerShopLinks: NavLinkItem[] = [
  { label: 'كل المنتجات', to: '/shop' },
  { label: 'العطور', to: '/category/perfumes' },
  { label: 'العطور الرجالية', to: '/category/perfumes-men' },
  { label: 'العناية', to: '/category/care' },
  { label: 'مستحضرات التجميل', to: '/category/makeup' },
  { label: 'النظافة والجمال', to: '/category/hygiene' },
  { label: 'الهدايا', to: '/category/gifts' },
];

export const footerServiceLinks: NavLinkItem[] = [
  { label: 'اطلبي من الخارج', to: '/external-order' },
  { label: 'المفضلة', to: '/wishlist' },
  { label: 'السلة', to: '/cart' },
  { label: 'تواصلي معنا', to: '/contact' },
  { label: 'سياسة الخصوصية', to: '/privacy' },
  { label: 'الشروط والأحكام', to: '/terms' },
];
