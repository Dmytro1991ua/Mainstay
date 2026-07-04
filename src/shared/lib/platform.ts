/**
 * True on Apple platforms, where the command palette shortcut is ⌘K rather than
 * Ctrl+K. `navigator.platform` is deprecated but still the most reliable signal;
 * we fall back to the UA string and default to false during SSR/tests.
 */
export const isMac = (): boolean => {
  if (typeof navigator === "undefined") return false;
  const source = navigator.platform || navigator.userAgent || "";
  return /Mac|iPhone|iPad|iPod/i.test(source);
};
