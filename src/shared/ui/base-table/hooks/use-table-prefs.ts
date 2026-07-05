import { useCallback } from "react";

import { useTablePrefsStore } from "@/shared/stores/table-prefs-store";

import type { ColumnSizingState, OnChangeFn, VisibilityState } from "@tanstack/react-table";

const EMPTY_VISIBILITY: VisibilityState = {};
const EMPTY_SIZING: ColumnSizingState = {};

/**
 * Bridges the persisted table-prefs store to TanStack's controlled state +
 * OnChangeFn handlers. When `tableId` is undefined the table is unpersisted:
 * empty prefs and no-op setters (resizing/visibility become ephemeral).
 */
export function useTablePrefs(tableId: string | undefined) {
  const prefs = useTablePrefsStore((state) => (tableId ? state.byTable[tableId] : undefined));
  const setColumnVisibility = useTablePrefsStore((state) => state.setColumnVisibility);
  const setColumnSizing = useTablePrefsStore((state) => state.setColumnSizing);

  const columnVisibility = prefs?.columnVisibility ?? EMPTY_VISIBILITY;
  const columnSizing = prefs?.columnSizing ?? EMPTY_SIZING;

  const onColumnVisibilityChange: OnChangeFn<VisibilityState> = useCallback(
    (updater) => {
      if (!tableId) return;
      setColumnVisibility(
        tableId,
        typeof updater === "function" ? updater(columnVisibility) : updater,
      );
    },
    [tableId, columnVisibility, setColumnVisibility],
  );

  const onColumnSizingChange: OnChangeFn<ColumnSizingState> = useCallback(
    (updater) => {
      if (!tableId) return;
      setColumnSizing(tableId, typeof updater === "function" ? updater(columnSizing) : updater);
    },
    [tableId, columnSizing, setColumnSizing],
  );

  return { columnVisibility, columnSizing, onColumnVisibilityChange, onColumnSizingChange };
}
