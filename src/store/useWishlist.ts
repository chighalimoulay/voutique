import { useContext } from 'react';
import { WishlistContext, type WishlistContextValue } from './wishlist-context';

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error('useWishlist يجب أن يُستخدم داخل WishlistProvider');
  }

  return context;
}
