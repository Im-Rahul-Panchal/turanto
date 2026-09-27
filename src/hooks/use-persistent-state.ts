import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useIsMounted } from './use-is-mounted';

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

/**
 * `useState` that survives an app restart.
 *
 * The value is written back to AsyncStorage only after hydration completes, so
 * a fresh install never overwrites a stored value with its own initial state
 * during the first render pass. `hydrated` lets screens show skeletons rather
 * than flashing an empty cart while storage is read.
 */
export function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);
  const isMounted = useIsMounted();
  const hasHydratedRef = useRef(false);

  // `initialValue` is usually a fresh array or object literal at the call site.
  // Mirroring it into a ref from an effect keeps `reset` referentially stable
  // without writing to a ref during render.
  const initialValueRef = useRef(initialValue);

  useEffect(() => {
    initialValueRef.current = initialValue;
  }, [initialValue]);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const stored = await AsyncStorage.getItem(key);
        if (cancelled || !isMounted()) return;
        if (stored !== null) {
          setValue(JSON.parse(stored) as T);
        }
      } catch {
        // A corrupt or unreadable entry should degrade to the initial value,
        // never block the screen.
      } finally {
        if (!cancelled && isMounted()) {
          hasHydratedRef.current = true;
          setHydrated(true);
        }
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [key, isMounted]);

  useEffect(() => {
    if (!hasHydratedRef.current) return;
    void AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {
      // Persisting is best-effort; an in-memory cart is better than a crash.
    });
  }, [key, value]);

  const reset = useCallback(() => setValue(initialValueRef.current), []);

  return { value, setValue: setValue as SetState<T>, hydrated, reset } as const;
}
