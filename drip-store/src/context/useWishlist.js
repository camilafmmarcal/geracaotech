import { useContext } from 'react';
import { WishlistContext } from './wishlist-context';

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      'useWishlist deve ser utilizado dentro de WishlistProvider.'
    );
  }

  return context;
}