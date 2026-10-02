import { useContext } from 'react';
import { ProductsContext, type ProductsContextValue } from './products-context';

export function useCatalog(): ProductsContextValue {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error('useCatalog يجب أن يُستخدم داخل ProductsProvider');
  }

  return context;
}
