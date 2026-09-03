import { useCallback, useMemo, type ReactNode } from 'react';
import { getProductById } from '@/data/products';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { CartItem, Product, ResolvedCartItem } from '@/types';
import { buildCartKey, CartContext, type CartContextValue } from './cart-context';

const STORAGE_KEY = 'voutique:cart:v1';
const MAX_QUANTITY = 99;

/** يتحقق من شكل البيانات القادمة من localStorage قبل استخدامها. */
function isCartItemArray(value: unknown): value is CartItem[] {
  if (!Array.isArray(value)) return false;

  return value.every((entry) => {
    if (typeof entry !== 'object' || entry === null) return false;
    const item = entry as Record<string, unknown>;
    return (
      typeof item.productId === 'string' &&
      typeof item.quantity === 'number' &&
      Number.isFinite(item.quantity) &&
      typeof item.selectedOptions === 'object' &&
      item.selectedOptions !== null
    );
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>(STORAGE_KEY, [], isCartItemArray);

  const addItem = useCallback(
    (product: Product, quantity = 1, selectedOptions: Record<string, string> = {}) => {
      if (!product.available) return;

      const key = buildCartKey(product.id, selectedOptions);
      const safeQuantity = Math.min(Math.max(Math.round(quantity), 1), MAX_QUANTITY);

      setItems((previous) => {
        const index = previous.findIndex(
          (item) => buildCartKey(item.productId, item.selectedOptions) === key,
        );

        if (index === -1) {
          return [...previous, { productId: product.id, quantity: safeQuantity, selectedOptions }];
        }

        const next = [...previous];
        const existing = next[index];
        next[index] = {
          ...existing,
          quantity: Math.min(existing.quantity + safeQuantity, MAX_QUANTITY),
        };
        return next;
      });
    },
    [setItems],
  );

  const updateQuantity = useCallback(
    (key: string, quantity: number) => {
      const safeQuantity = Math.round(quantity);

      setItems((previous) => {
        if (safeQuantity < 1) {
          return previous.filter(
            (item) => buildCartKey(item.productId, item.selectedOptions) !== key,
          );
        }

        return previous.map((item) =>
          buildCartKey(item.productId, item.selectedOptions) === key
            ? { ...item, quantity: Math.min(safeQuantity, MAX_QUANTITY) }
            : item,
        );
      });
    },
    [setItems],
  );

  const removeItem = useCallback(
    (key: string) => {
      setItems((previous) =>
        previous.filter((item) => buildCartKey(item.productId, item.selectedOptions) !== key),
      );
    },
    [setItems],
  );

  const clearCart = useCallback(() => setItems([]), [setItems]);

  /**
   * ربط الأسطر بالمنتجات الحالية.
   * أي سطر يشير إلى منتج محذوف أو غير متوفر يُستبعد من العرض والإجمالي،
   * حتى لا تُرسل رسالة واتساب بمنتج لم يعد موجودًا.
   */
  const resolvedItems = useMemo<ResolvedCartItem[]>(() => {
    const resolved: ResolvedCartItem[] = [];

    for (const item of items) {
      const product = getProductById(item.productId);
      if (!product || !product.available) continue;

      resolved.push({
        ...item,
        product,
        key: buildCartKey(item.productId, item.selectedOptions),
        lineTotal: product.price * item.quantity,
      });
    }

    return resolved;
  }, [items]);

  const totalQuantity = useMemo(
    () => resolvedItems.reduce((sum, item) => sum + item.quantity, 0),
    [resolvedItems],
  );

  const totalPrice = useMemo(
    () => resolvedItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [resolvedItems],
  );

  const isInCart = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      resolvedItems,
      totalQuantity,
      totalPrice,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      isInCart,
    }),
    [
      items,
      resolvedItems,
      totalQuantity,
      totalPrice,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      isInCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
