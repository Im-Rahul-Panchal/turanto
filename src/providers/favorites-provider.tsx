import { createContext, useCallback, useContext, useMemo } from 'react';

import { usePersistentState } from '@/hooks/use-persistent-state';
import { useToast } from '@/providers/toast-provider';
import { storageKeys } from '@/constants/storage';
import { getProduct } from '@/data/products';
import { haptics } from '@/utils/haptics';
import type { Product } from '@/types';

type FavouriteEntry = {
  productId: string;
  savedAt: number;
};

type FavoritesContextValue = {
  entries: FavouriteEntry[];
  products: Product[];
  count: number;
  hydrated: boolean;
  isFavorite: (productId: string) => boolean;
  toggle: (product: Product) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/**
 * Saved-for-later list, shared by the product screen, the heart icon on cards and
 * the profile screen so the heart is always truthful wherever it appears.
 */
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  const { value: entries, setValue: setEntries, hydrated } = usePersistentState<FavouriteEntry[]>(
    storageKeys.favorites,
    [],
  );

  const idSet = useMemo(() => new Set(entries.map((entry) => entry.productId)), [entries]);

  const products = useMemo(
    () =>
      entries
        .map((entry) => getProduct(entry.productId))
        .filter((product): product is Product => Boolean(product)),
    [entries],
  );

  const isFavorite = useCallback((productId: string) => idSet.has(productId), [idSet]);

  const toggle = useCallback(
    (product: Product) => {
      setEntries((current) => {
        const exists = current.some((entry) => entry.productId === product.id);

        if (exists) {
          haptics.light();
          toast.show({ message: `${product.name} removed from favourites`, variant: 'info' });
          return current.filter((entry) => entry.productId !== product.id);
        }

        haptics.medium();
        toast.show({ message: `${product.name} saved to favourites`, variant: 'favorite', icon: 'heart' });
        return [...current, { productId: product.id, savedAt: Date.now() }];
      });
    },
    [setEntries, toast],
  );

  const remove = useCallback(
    (productId: string) => {
      setEntries((current) => current.filter((entry) => entry.productId !== productId));
    },
    [setEntries],
  );

  const clear = useCallback(() => setEntries([]), [setEntries]);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      entries,
      products,
      count: entries.length,
      hydrated,
      isFavorite,
      toggle,
      remove,
      clear,
    }),
    [clear, entries, hydrated, isFavorite, products, remove, toggle],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used inside <FavoritesProvider>');
  }
  return context;
}
