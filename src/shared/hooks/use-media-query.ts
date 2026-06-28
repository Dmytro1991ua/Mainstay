import { useCallback, useSyncExternalStore } from "react";

const subscribe = (query: string, onChange: () => void) => {
  const mediaQueryList = globalThis.matchMedia(query);

  mediaQueryList.addEventListener("change", onChange);

  return () => mediaQueryList.removeEventListener("change", onChange);
};

export function useMediaQuery(query: string): boolean {
  const subscribeToQuery = useCallback(
    (onChange: () => void) => subscribe(query, onChange),
    [query],
  );

  return useSyncExternalStore(subscribeToQuery, () => globalThis.matchMedia(query).matches);
}
