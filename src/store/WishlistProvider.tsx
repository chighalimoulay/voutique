import { useCallback, useMemo, type ReactNode } from 'react';
import { getProductById } from '@/data/products';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Product } from '@/types';
import { WishlistContext, type WishlistContextValue } from './wishlist-context';

const STORAGE_KEY = 'voutique:wishlist:v1';

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useLocalStorage<string[]>(STORAGE_KEY, [], isStringArray);

  const isFavorite = useCallback((productId: string) => ids.includes(productId), [ids]);

  const toggle = useCallback(
    (productId: string) => {
      setIds((previous) =>
        previous.includes(productId)
          ? previous.filter((id) => id !== productId)
          : [productId, ...previous],
      );
    },
    [setIds],
  );

  const remove = useCallback(
    (productId: string) => {
      setIds((previous) => previous.filter((id) => id !== productId));
    },
    [setIds],
  );

  const clear = useCallback(() => setIds([]), [setIds]);

  /** المنتجات المحذوفة من الكتالوج تُتجاهل بصمت بدل كسر الصفحة. */
  const productList = useMemo<Product[]>(() => {
    const resolved: Product[] = [];
    for (const id of ids) {
      const product = getProductById(id);
      if (product) resolved.push(product);
    }
    return resolved;
  }, [ids]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      ids,
      products: productList,
      count: productList.length,
      isFavorite,
      toggle,
      remove,
      clear,
    }),
    [ids, productList, isFavorite, toggle, remove, clear],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
