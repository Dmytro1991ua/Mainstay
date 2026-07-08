import { type OnChangeFn, type SortingState } from "@tanstack/react-table";

import type { TableStateHookParams } from "../types";

export const useSortingInTable = ({ tableState, onSetTableState }: TableStateHookParams) => {
  const sorting: SortingState = tableState.sorting ?? [];

  const onSetSorting: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === "function" ? updater(sorting) : updater;

    onSetTableState((prev) => ({ ...prev, sorting: next.length ? next : undefined }));
  };

  return { sorting, onSetSorting };
};
