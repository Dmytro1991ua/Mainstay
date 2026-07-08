import { useTableStore } from "@/shared/stores/table-store";

import type { OnChangeFn, VisibilityState } from "@tanstack/react-table";

const EMPTY: VisibilityState = {};

export const useColumnVisibilityInTable = (tableId: string) => {
  const columnVisibility = useTableStore((s) => s.columnVisibility[tableId] ?? EMPTY);
  const set = useTableStore((s) => s.setColumnVisibility);

  const onColumnVisibilityChange: OnChangeFn<VisibilityState> = (updater) => {
    const next = typeof updater === "function" ? updater(columnVisibility) : updater;
    set(tableId, next);
  };

  return { columnVisibility, onColumnVisibilityChange };
};
