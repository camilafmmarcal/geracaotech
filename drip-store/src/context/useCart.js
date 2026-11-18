
import { useContext } from 'react';
import { CartContext } from './cart-context';

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart deve ser utilizado dentro de CartProvider.'
    );
  }

  return context;
}
