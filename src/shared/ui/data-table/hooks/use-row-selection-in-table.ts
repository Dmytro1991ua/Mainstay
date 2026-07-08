import { useTableStore } from "@/shared/stores/table-store";

import type { OnChangeFn, RowSelectionState } from "@tanstack/react-table";

const EMPTY: RowSelectionState = {};

export const useRowSelectionInTable = (tableId: string) => {
  const rowSelection = useTableStore((s) => s.rowSelection[tableId] ?? EMPTY);

  const set = useTableStore((s) => s.setRowSelection);

  const onRowSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
    const next = typeof updater === "function" ? updater(rowSelection) : updater;

    set(tableId, next);
  };

  return { rowSelection, onRowSelectionChange };
};
