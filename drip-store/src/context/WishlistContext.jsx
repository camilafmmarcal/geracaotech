
import {
  useCallback,
  useMemo,
  useState
} from 'react';

import { useAuth } from './useAuth';
import { WishlistContext } from './wishlist-context';

const STORAGE_PREFIX = 'drip-store-wishlist-v1';

function readWishlist(accountId) {
  if (!accountId) return [];

  try {
    const stored = localStorage.getItem(
      `${STORAGE_PREFIX}:${accountId}`
    );

    if (!stored) return [];

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return [
      ...new Set(
        parsed
          .filter(
            (id) =>
              typeof id === 'number' ||
              typeof id === 'string'
          )
          .map(String)
      )
    ];
  } catch (error) {
    console.error(
      'Erro ao carregar favoritos:',
      error
    );

    return [];
  }
}

export function WishlistProvider({ children }) {
  const { currentUser, isAuthenticated } = useAuth();

  const accountId =
    isAuthenticated && currentUser?.id
      ? String(currentUser.id)
      : null;

  const storageKey = accountId
    ? `${STORAGE_PREFIX}:${accountId}`
    : null;

  const [wishlists, setWishlists] = useState({});

  const favoriteIds = useMemo(() => {
    if (!accountId) return [];

    return (
      wishlists[accountId] ??
      readWishlist(accountId)
    );
  }, [accountId, wishlists]);

  const isFavorite = useCallback(
    (productId) => {
      return favoriteIds.includes(String(productId));
    },
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    (productId) => {
      if (!accountId || !storageKey) {
        return false;
      }

      const id = String(productId);

      const current =
        wishlists[accountId] ??
        readWishlist(accountId);

      const updated = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];

      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify(updated)
        );

        setWishlists((previous) => ({
          ...previous,
          [accountId]: updated
        }));

        return true;
      } catch (error) {
        console.error(
          'Erro ao salvar favoritos:',
          error
        );

        return false;
      }
    },
    [accountId, storageKey, wishlists]
  );

  const clearFavorites = useCallback(() => {
    if (!accountId || !storageKey) return false;

    try {
      localStorage.removeItem(storageKey);

      setWishlists((previous) => ({
        ...previous,
        [accountId]: []
      }));

      return true;
    } catch (error) {
      console.error(
        'Erro ao limpar favoritos:',
        error
      );

      return false;
    }
  }, [accountId, storageKey]);

  const value = useMemo(
    () => ({
      favoriteIds,
      favoriteCount: favoriteIds.length,
      isFavorite,
      toggleFavorite,
      clearFavorites
    }),
    [
      favoriteIds,
      isFavorite,
      toggleFavorite,
      clearFavorites
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}
