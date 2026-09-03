import { useContext } from 'react';
import { CartContext, type CartContextValue } from './cart-context';

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart يجب أن يُستخدم داخل CartProvider');
  }

  return context;
}
