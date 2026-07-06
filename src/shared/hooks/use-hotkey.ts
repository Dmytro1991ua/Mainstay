import { useEffect, useRef } from "react";

/**
 * Fire `handler` when the user presses ⌘/Ctrl + `key` anywhere in the app.
 *
 * The handler is stored in a ref (synced via effect, never written during
 * render) so changing its identity between renders doesn't re-bind the global
 * listener — the binding effect depends only on `key`. This is the standard
 * "latest ref" pattern for event callbacks under React 19.
 */
export const useHotkey = (key: string, handler: () => void) => {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        handlerRef.current();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key]);
};
