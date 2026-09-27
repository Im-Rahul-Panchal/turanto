import { createContext, useCallback, useContext, useMemo } from 'react';

import { usePersistentState } from '@/hooks/use-persistent-state';
import { useCart } from '@/providers/cart-provider';
import { useToast } from '@/providers/toast-provider';
import { storageKeys } from '@/constants/storage';
import { createOrder, seedOrders } from '@/data/orders';
import { getProduct } from '@/data/products';
import { haptics } from '@/utils/haptics';
import type { Address, Order, PaymentMethod } from '@/types';

type OrdersContextValue = {
  orders: Order[];
  /** Orders still moving: preparing, packed or out for delivery. */
  activeOrders: Order[];
  pastOrders: Order[];
  hydrated: boolean;
  getOrder: (id: string) => Order | null;
  placeOrder: (input: {
    address: Address;
    paymentMethod: PaymentMethod;
    instructions?: string;
  }) => Order;
  cancelOrder: (id: string) => void;
  rateOrder: (id: string, rating: number) => void;
  /** Puts every item from a past order back in the cart. */
  reorder: (order: Order) => number;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

const activeStatuses = new Set<Order['status']>(['preparing', 'packed', 'out_for_delivery']);

/**
 * Order history and the place-order flow.
 *
 * Seeded from `seedOrders` on first launch so the tracking UI has realistic
 * data immediately, then owned entirely by AsyncStorage. Placing an order moves
 * the cart contents into a new order and empties the cart.
 */
export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  const cart = useCart();
  const { value: orders, setValue: setOrders, hydrated } = usePersistentState<Order[]>(
    storageKeys.orders,
    seedOrders,
  );

  const getOrder = useCallback(
    (id: string) => orders.find((order) => order.id === id) ?? null,
    [orders],
  );

  const placeOrder = useCallback<OrdersContextValue['placeOrder']>(
    ({ address, paymentMethod, instructions }) => {
      if (cart.items.length === 0) {
        throw new Error('Cannot place an order with an empty cart');
      }

      const order = createOrder({
        items: cart.items,
        address,
        paymentMethod,
        couponCode: cart.couponCode,
        instructions,
      });

      // Newest first, so the list is already in display order.
      setOrders((current) => [order, ...current]);
      cart.clear();

      haptics.success();
      toast.show({
        message: `Order ${order.reference} placed`,
        variant: 'success',
        icon: 'check-circle-2',
      });

      return order;
    },
    [cart, setOrders, toast],
  );

  const cancelOrder = useCallback(
    (id: string) => {
      setOrders((current) =>
        current.map((order) =>
          order.id === id
            ? {
                ...order,
                status: 'cancelled' as const,
                tracking: order.tracking.map((step) => ({ ...step, at: null })),
              }
            : order,
        ),
      );
      haptics.warning();
      toast.show({ message: 'Order cancelled', variant: 'info' });
    },
    [setOrders, toast],
  );

  const rateOrder = useCallback(
    (id: string, rating: number) => {
      setOrders((current) =>
        current.map((order) => (order.id === id ? { ...order, rating } : order)),
      );
      haptics.success();
      toast.show({ message: 'Thanks for rating your order', variant: 'success' });
    },
    [setOrders, toast],
  );

  const reorder = useCallback(
    (order: Order) => {
      let added = 0;
      for (const item of order.items) {
        const product = getProduct(item.productId);
        // Resolved from the catalogue, and out-of-stock lines are skipped so a
        // reorder never quietly fails at the point of adding.
        if (product && product.stockStatus !== 'out_of_stock') {
          cart.addItem(product, item.quantity);
          added += 1;
        }
      }
      return added;
    },
    [cart],
  );

  const activeOrders = useMemo(
    () => orders.filter((order) => activeStatuses.has(order.status)),
    [orders],
  );

  const pastOrders = useMemo(
    () =>
      orders.filter(
        (order) => order.status === 'delivered' || order.status === 'cancelled',
      ),
    [orders],
  );

  const value = useMemo<OrdersContextValue>(
    () => ({
      orders,
      activeOrders,
      pastOrders,
      hydrated,
      getOrder,
      placeOrder,
      cancelOrder,
      rateOrder,
      reorder,
    }),
    [activeOrders, cancelOrder, getOrder, hydrated, orders, pastOrders, placeOrder, rateOrder, reorder],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders(): OrdersContextValue {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used inside <OrdersProvider>');
  }
  return context;
}
