import { useEffect, useMemo, useRef } from "react";

/**
 * Returns a stable debounced wrapper around `callback`. The latest callback is
 * kept in a ref so the debounced identity never changes (safe as an effect dep
 * or event handler) while still calling the freshest closure. Pending timers are
 * cleared on unmount.
 */
export function useDebouncedCallback<A extends unknown[]>(
  callback: (...args: A) => void,
  delayMs: number,
) {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return useMemo(() => {
    const debounced = (...args: A) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callbackRef.current(...args), delayMs);
    };
    debounced.cancel = () => clearTimeout(timerRef.current);
    return debounced;
  }, [delayMs]);
}
