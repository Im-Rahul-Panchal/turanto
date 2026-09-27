import { useCallback, useEffect, useRef } from 'react';

/**
 * Tracks whether a component is still mounted.
 *
 * Needed wherever an async continuation (AsyncStorage read, timeout, animation
 * callback) could fire after unmount and try to set state.
 *
 * The returned function is referentially stable for the lifetime of the
 * component. That matters: callers put it in dependency arrays, and a new
 * closure each render would make those effects re-run on every single render.
 */
export function useIsMounted(): () => boolean {
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return useCallback(() => mountedRef.current, []);
}
