import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ColumnSizingState, RowSelectionState, VisibilityState } from "@tanstack/react-table";

type TablePersistedState = {
  columnVisibility: Record<string, VisibilityState>;
  columnSizing: Record<string, ColumnSizingState>;
  rowSelection: Record<string, RowSelectionState>;
  setColumnVisibility: (tableId: string, state: VisibilityState) => void;
  setColumnSizing: (tableId: string, state: ColumnSizingState) => void;
  setRowSelection: (tableId: string, state: RowSelectionState) => void;
};

export const useTableStore = create<TablePersistedState>()(
  persist(
    (set) => ({
      columnVisibility: {},
      columnSizing: {},
      rowSelection: {},
      setColumnVisibility: (tableId, state) =>
        set((s) => ({ columnVisibility: { ...s.columnVisibility, [tableId]: state } })),
      setColumnSizing: (tableId, state) =>
        set((s) => ({ columnSizing: { ...s.columnSizing, [tableId]: state } })),
      setRowSelection: (tableId, state) =>
        set((s) => ({ rowSelection: { ...s.rowSelection, [tableId]: state } })),
    }),
    {
      name: "mainstay-tables",
      partialize: (s) => ({ columnVisibility: s.columnVisibility, columnSizing: s.columnSizing }),
    },
  ),
);
