import { useEffect, useRef } from "react";

type Debounced<A extends unknown[]> = ((...args: A) => void) & { cancel: () => void };

/**
 * Returns a debounced wrapper around `callback`. The timer lives in a ref (read
 * only at call time, never during render), so debouncing is correct no matter
 * how often the component re-renders, and the latest `callback` is always the
 * one invoked. Pending timers are cleared on unmount.
 *
 * No useMemo/useCallback: under the React Compiler the returned function is
 * memoized automatically (stable identity while `delayMs` is unchanged). Without
 * the compiler the identity may churn, but correctness is unaffected — the ref
 * owns the timer, not the function instance.
 */
export function useDebouncedCallback<A extends unknown[]>(
  callback: (...args: A) => void,
  delayMs: number,
): Debounced<A> {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Always call the freshest callback without making it a timer dependency.
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const debounced = ((...args: A) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => callbackRef.current(...args), delayMs);
  }) as Debounced<A>;
  debounced.cancel = () => clearTimeout(timerRef.current);

  return debounced;
}
