import { router } from 'expo-router';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { usePersistentState } from '@/hooks/use-persistent-state';
import { useToast } from '@/providers/toast-provider';
import { storageKeys } from '@/constants/storage';
import { getProduct } from '@/data/products';
import { getCoupon } from '@/data/coupons';
import { computeTotals, formatPrice, type PricedLine } from '@/utils/pricing';
import { haptics } from '@/utils/haptics';
import type { CartItem, CartLine, CartSummary, Product, SavedItem } from '@/types';

/** A cart line is just a product id plus a count — price is always derived. */
type PersistedLine = CartLine;

type CartContextValue = {
  lines: CartLine[];
  items: CartItem[];
  saved: SavedItem[];
  summary: CartSummary;
  /** Bumped on every mutation so the tab badge can animate its change. */
  revision: number;
  hydrated: boolean;
  addItem: (product: Product, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  isInCart: (productId: string) => boolean;
  quantityOf: (productId: string) => number;
  totalQuantity: number;
  toggleSaveForLater: (product: Product) => void;
  removeSaved: (productId: string) => void;
  moveSavedToCart: (product: Product) => void;
  couponCode: string | null;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  const {
    value: lines,
    setValue: setLines,
    hydrated,
  } = usePersistentState<PersistedLine[]>(storageKeys.cartLines, []);

  const { value: saved, setValue: setSaved } = usePersistentState<SavedItem[]>(
    storageKeys.cartSaved,
    [],
  );
  const { value: couponCode, setValue: setCouponCode } = usePersistentState<string | null>(
    storageKeys.cartCoupon,
    null,
  );

  // Kept in plain state so badge animations can react to changes without
  // anything being persisted.
  const [revision, setRevision] = useState(0);

  // Resolve ids into full products. Unknown ids are dropped rather than rendered
  // as blanks, so a catalogue change can never produce a broken cart row.
  const items = useMemo<CartItem[]>(
    () =>
      lines
        .map((line): CartItem | null => {
          const product = getProduct(line.productId);
          if (!product) return null;
          return {
            productId: line.productId,
            quantity: line.quantity,
            product,
            lineTotal: product.price * line.quantity,
            lineSavings: Math.max(0, product.mrp - product.price) * line.quantity,
          };
        })
        .filter((item): item is CartItem => item !== null),
    [lines],
  );

  // Pricing only needs ids and amounts, so the product objects are flattened
  // once rather than passed around.
  const priced = useMemo<PricedLine[]>(
    () =>
      items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
        mrp: item.product.mrp,
      })),
    [items],
  );

  const summary = useMemo<CartSummary>(() => {
    const coupon = couponCode ? getCoupon(couponCode) : null;
    const totals = computeTotals(priced, { coupon });

    return {
      items,
      itemCount: totals.itemCount,
      itemTotal: totals.itemTotal,
      productSavings: totals.productSavings,
      deliveryFee: totals.deliveryFee,
      handlingFee: totals.handlingFee,
      // Prices are tax-inclusive, so there is no tax line to add at checkout.
      taxes: 0,
      couponDiscount: totals.couponDiscount,
      totalSavings: totals.totalSavings,
      payable: totals.payable,
      appliedCoupon: totals.appliedCoupon,
      freeDeliveryUnlocked: totals.freeDeliveryUnlocked,
      amountToFreeDelivery: totals.amountToFreeDelivery,
    };
  }, [couponCode, items, priced]);

  const quantityMap = useMemo(
    () => new Map(lines.map((line) => [line.productId, line.quantity])),
    [lines],
  );

  const quantityOf = useCallback(
    (productId: string) => quantityMap.get(productId) ?? 0,
    [quantityMap],
  );

  const isInCart = useCallback((productId: string) => quantityMap.has(productId), [quantityMap]);

  const totalQuantity = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );

  const mutate = useCallback(
    (updater: (current: CartLine[]) => CartLine[]) => {
      setLines((current) => updater(current));
      setRevision((value) => value + 1);
    },
    [setLines],
  );

  const addItem = useCallback(
    (product: Product, quantity = 1) => {
      if (product.stockStatus === 'out_of_stock') {
        toast.show({ message: `${product.name} is out of stock`, variant: 'error' });
        return;
      }

      mutate((current) => {
        const existing = current.find((line) => line.productId === product.id);
        if (!existing) {
          return [...current, { productId: product.id, quantity }];
        }
        return current.map((line) =>
          line.productId === product.id
            ? { ...line, quantity: Math.min(99, line.quantity + quantity) }
            : line,
        );
      });

      haptics.medium();
      toast.show({
        message: `${product.name} added to cart`,
        variant: 'cart',
        icon: 'shopping-bag',
        action: { label: 'View', onPress: () => router.push('/cart') },
      });
    },
    [mutate, toast],
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        mutate((current) => current.filter((line) => line.productId !== productId));
        return;
      }
      mutate((current) =>
        current.map((line) =>
          line.productId === productId ? { ...line, quantity: Math.min(99, quantity) } : line,
        ),
      );
    },
    [mutate],
  );

  const increment = useCallback(
    (productId: string) => setQuantity(productId, (quantityMap.get(productId) ?? 0) + 1),
    [quantityMap, setQuantity],
  );

  const decrement = useCallback(
    (productId: string) => {
      const next = (quantityMap.get(productId) ?? 0) - 1;
      const product = getProduct(productId);
      if (next <= 0 && product) {
        removeWithFeedback(product);
      } else {
        setQuantity(productId, next);
      }
    },
    // `removeWithFeedback` is stable enough for this purpose.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [quantityMap, setQuantity],
  );

  function removeWithFeedback(product: Product) {
    mutate((current) => current.filter((line) => line.productId !== product.id));
    haptics.warning();
    toast.show({
      message: `${product.name} removed`,
      variant: 'info',
      icon: 'trash-2',
      action: {
        label: 'Undo',
        onPress: () => addItem(product, 1),
      },
    });
  }

  const removeItem = useCallback(
    (productId: string) => {
      const product = getProduct(productId);
      if (!product) return;
      removeWithFeedback(product);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mutate, toast],
  );

  const clear = useCallback(() => {
    mutate(() => []);
    setCouponCode(null);
  }, [mutate, setCouponCode]);

  const toggleSaveForLater = useCallback(
    (product: Product) => {
      setSaved((current) => {
        const exists = current.some((item) => item.productId === product.id);
        if (exists) {
          toast.show({ message: `${product.name} removed from saved`, variant: 'info' });
          return current.filter((item) => item.productId !== product.id);
        }
        toast.show({ message: `${product.name} saved for later`, variant: 'info', icon: 'bookmark' });
        return [...current, { productId: product.id, savedAt: Date.now() }];
      });
    },
    [setSaved, toast],
  );

  const removeSaved = useCallback(
    (productId: string) => {
      setSaved((current) => current.filter((item) => item.productId !== productId));
    },
    [setSaved],
  );

  const moveSavedToCart = useCallback(
    (product: Product) => {
      addItem(product, 1);
      removeSaved(product.id);
    },
    [addItem, removeSaved],
  );

  const applyCoupon = useCallback(
    (code: string) => {
      const normalized = code.trim().toUpperCase();
      if (!normalized) return { ok: false, message: 'Enter a coupon code' };

      const coupon = getCoupon(normalized);
      if (!coupon) return { ok: false, message: `“${normalized}” is not a valid code` };

      // Minimum-spend failures are explained rather than silently rejected.
      if (summary.itemTotal < coupon.minOrderValue) {
        return {
          ok: false,
          message: `Spend ${formatPrice(coupon.minOrderValue - summary.itemTotal)} more to use this code`,
        };
      }

      const applied = computeTotals(priced, { coupon }).appliedCoupon;
      if (!applied || applied.saved <= 0) {
        return { ok: false, message: 'This code saves nothing on your current cart' };
      }

      setCouponCode(normalized);
      return {
        ok: true,
        message: `Coupon applied — you save ${formatPrice(applied.saved)}`,
      };
    },
    [priced, setCouponCode, summary.itemTotal],
  );

  const removeCoupon = useCallback(() => setCouponCode(null), [setCouponCode]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      items,
      saved,
      summary,
      revision,
      hydrated,
      addItem,
      setQuantity,
      increment,
      decrement,
      removeItem,
      clear,
      isInCart,
      quantityOf,
      totalQuantity,
      toggleSaveForLater,
      removeSaved,
      moveSavedToCart,
      couponCode,
      applyCoupon,
      removeCoupon,
    }),
    [
      addItem,
      applyCoupon,
      clear,
      couponCode,
      decrement,
      hydrated,
      increment,
      isInCart,
      items,
      lines,
      moveSavedToCart,
      quantityOf,
      removeCoupon,
      removeItem,
      removeSaved,
      revision,
      saved,
      setQuantity,
      summary,
      toggleSaveForLater,
      totalQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside <CartProvider>');
  }
  return context;
}
