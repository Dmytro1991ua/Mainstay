import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ColumnSizingState, VisibilityState } from "@tanstack/react-table";

type TablePrefs = {
  columnVisibility: VisibilityState;
  columnSizing: ColumnSizingState;
};

type TablePrefsState = {
  /** Per-table view preferences, keyed by a stable table id. */
  byTable: Record<string, TablePrefs>;
  setColumnVisibility: (tableId: string, columnVisibility: VisibilityState) => void;
  setColumnSizing: (tableId: string, columnSizing: ColumnSizingState) => void;
};

/**
 * Persisted, per-table VIEW chrome — which columns are shown and how wide they
 * are. Deliberately NOT in the URL (unlike sort/filter/search): these are
 * personal presentation prefs, not shareable query state, so they'd only bloat
 * links. localStorage-backed via zustand persist.
 */
export const useTablePrefsStore = create<TablePrefsState>()(
  persist(
    (set) => ({
      byTable: {},
      setColumnVisibility: (tableId, columnVisibility) =>
        set((state) => ({
          byTable: {
            ...state.byTable,
            [tableId]: { ...state.byTable[tableId], columnVisibility },
          },
        })),
      setColumnSizing: (tableId, columnSizing) =>
        set((state) => ({
          byTable: {
            ...state.byTable,
            [tableId]: { ...state.byTable[tableId], columnSizing },
          },
        })),
    }),
    { name: "mainstay-table-prefs" },
  ),
);
