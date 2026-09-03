import { createContext } from 'react';
import type { Product } from '@/types';

export interface WishlistContextValue {
  /** معرّفات المنتجات المفضّلة كما هي في localStorage. */
  ids: string[];
  /** المنتجات الموجودة فعلًا في الكتالوج. */
  products: Product[];
  count: number;
  isFavorite: (productId: string) => boolean;
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

export const WishlistContext = createContext<WishlistContextValue | null>(null);
