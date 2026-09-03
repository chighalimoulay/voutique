import { createContext } from 'react';
import type { CartItem, Product, ResolvedCartItem } from '@/types';

export interface CartContextValue {
  /** الأسطر الخام كما هي محفوظة في localStorage. */
  items: CartItem[];
  /** الأسطر بعد ربطها بالمنتجات وحساب إجمالي كل سطر. */
  resolvedItems: ResolvedCartItem[];
  totalQuantity: number;
  totalPrice: number;
  addItem: (
    product: Product,
    quantity?: number,
    selectedOptions?: Record<string, string>,
  ) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

export const CartContext = createContext<CartContextValue | null>(null);

/** مفتاح فريد للسطر: المنتج + الخيارات المختارة مرتّبة. */
export function buildCartKey(
  productId: string,
  selectedOptions: Record<string, string>,
): string {
  const parts = Object.keys(selectedOptions)
    .sort()
    .map((label) => `${label}=${selectedOptions[label]}`);
  return parts.length > 0 ? `${productId}|${parts.join('|')}` : productId;
}
