import { useTableStore } from "@/shared/stores/table-store";

import type { ColumnSizingState, OnChangeFn } from "@tanstack/react-table";

const EMPTY: ColumnSizingState = {};

export const useColumnSizingInTable = (tableId: string) => {
  const columnSizing = useTableStore((s) => s.columnSizing[tableId] ?? EMPTY);
  const set = useTableStore((s) => s.setColumnSizing);

  const onColumnSizingChange: OnChangeFn<ColumnSizingState> = (updater) => {
    const next = typeof updater === "function" ? updater(columnSizing) : updater;
    set(tableId, next);
  };

  return { columnSizing, onColumnSizingChange };
};
