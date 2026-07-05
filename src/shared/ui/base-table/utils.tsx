import { Loader2 } from "lucide-react";

import {
  DEFAULT_EMPTY_MESSAGE,
  DEFAULT_EMPTY_SEARCH_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
} from "./constants";

type TableStatusArgs = {
  loading: boolean;
  error?: string;
  isEmpty: boolean;
  emptyMessage?: string;
};

/**
 * The single full-width cell shown in place of rows when the table has no data:
 * a spinner while loading, the error text on failure, otherwise the empty
 * message. Returns null once there are rows to render.
 */
export function getTableStatusContent({
  loading,
  error,
  isEmpty,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
}: TableStatusArgs) {
  if (loading) {
    return (
      <span className="flex items-center justify-center gap-2 py-10 text-sm text-text-3">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading…
      </span>
    );
  }
  if (error) {
    return <span className="block py-10 text-center text-sm text-destructive">{error}</span>;
  }
  if (isEmpty) {
    return <span className="block py-10 text-center text-sm text-text-3">{emptyMessage}</span>;
  }
  return null;
}

/** Pick the right empty message: a search-specific one when a query is active. */
export function getEmptyMessage(searchTerm: string | undefined, defaultMessage?: string): string {
  if (searchTerm) return DEFAULT_EMPTY_SEARCH_MESSAGE;
  return defaultMessage ?? DEFAULT_EMPTY_MESSAGE;
}

export { DEFAULT_ERROR_MESSAGE };
