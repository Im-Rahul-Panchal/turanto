import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { ToastViewport } from '@/components/feedback/toast-viewport';
import { haptics } from '@/utils/haptics';
import type { ToastPayload, ToastVariant } from '@/types';

type ShowToastInput = {
  message: string;
  variant?: ToastVariant;
  /** Overrides the icon implied by the variant. */
  icon?: ToastPayload['icon'];
  action?: ToastPayload['action'];
  /** Milliseconds before auto-dismiss. `0` keeps it until dismissed. */
  duration?: number;
};

type ToastContextValue = {
  show: (input: ShowToastInput) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 2200;
const MAX_VISIBLE = 3;
let counter = 0;

/**
 * App-wide transient messaging.
 *
 * Providers and screens call `show()` for anything the user should notice but
 * that does not need its own screen: "Added to cart", "Coupon applied",
 * "Removed from favourites". Each toast also fires a matching haptic, which is
 * what makes the interaction feel confirmed on a device.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastPayload[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    ({ message, variant = 'info', icon, action, duration = DEFAULT_DURATION }: ShowToastInput) => {
      counter += 1;
      const id = `toast-${counter}`;
      const next: ToastPayload = { id, message, variant, icon, action };

      setToasts((current) => {
        // Identical consecutive messages collapse into the existing toast, so
        // tapping "+" repeatedly does not build a wall of duplicates.
        const duplicate = current.find((toast) => toast.message === message);
        if (duplicate) return current;
        return [...current, next].slice(-MAX_VISIBLE);
      });

      if (variant === 'success') haptics.success();
      else if (variant === 'error') haptics.error();
      else haptics.light();

      if (duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), duration),
        );
      }

      return id;
    },
    [dismiss],
  );

  // Clear pending timers on unmount so no callback fires into a dead provider.
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return context;
}
