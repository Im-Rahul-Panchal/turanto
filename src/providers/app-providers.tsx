import { CartProvider } from '@/providers/cart-provider';
import { FavoritesProvider } from '@/providers/favorites-provider';
import { OrdersProvider } from '@/providers/orders-provider';
import { ToastProvider } from '@/providers/toast-provider';
import { UserProvider } from '@/providers/user-provider';

/**
 * Composes the app's state providers.
 *
 * Order matters: toasts sit outermost so any provider can raise a message, the
 * orders provider wraps the cart because placing an order reads the cart and
 * then clears it.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <UserProvider>
        <FavoritesProvider>
          <CartProvider>
            <OrdersProvider>{children}</OrdersProvider>
          </CartProvider>
        </FavoritesProvider>
      </UserProvider>
    </ToastProvider>
  );
}
