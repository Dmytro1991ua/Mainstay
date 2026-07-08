import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { useColumnSizingInTable } from "./use-column-sizing-in-table";
import { useColumnVisibilityInTable } from "./use-column-visibility-in-table";
import { useRowSelectionInTable } from "./use-row-selection-in-table";
import { useSortingInTable } from "./use-sorting-in-table";

import type { OnSetTableState, TableUrlState } from "../types";
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";

type UseTableStateParams<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  tableId: string;
  enableRowSelection?: boolean;
  enableColumnResizing?: boolean;
  enableSorting?: boolean;
  getRowId?: (row: TData) => string;
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
  onSelectionChange?: (rows: TData[]) => void;
};

export const useTableState = <TData>({
  columns,
  data,
  tableId,
  enableRowSelection = false,
  enableColumnResizing = true,
  enableSorting = true,
  getRowId,
  tableState,
  onSetTableState,
  onSelectionChange,
}: UseTableStateParams<TData>) => {
  "use no memo";

  const { sorting, onSetSorting } = useSortingInTable({ tableState, onSetTableState });
  const { columnVisibility, onColumnVisibilityChange } = useColumnVisibilityInTable(tableId);
  const { columnSizing, onColumnSizingChange } = useColumnSizingInTable(tableId);
  const { rowSelection, onRowSelectionChange: onStoreRowSelectionChange } =
    useRowSelectionInTable(tableId);

  const onRowSelectionChange = (
    updater: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState),
  ) => {
    onStoreRowSelectionChange(updater);
    if (onSelectionChange && getRowId) {
      const next = typeof updater === "function" ? updater(rowSelection) : updater;
      onSelectionChange(data.filter((row) => next[getRowId(row)] === true));
    }
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    enableSorting,
    enableRowSelection,
    enableColumnResizing,
    columnResizeMode: "onChange",
    state: { sorting, rowSelection, columnVisibility, columnSizing },
    onSortingChange: onSetSorting,
    onRowSelectionChange,
    onColumnVisibilityChange,
    onColumnSizingChange,
    getRowId,
  });

  return { table };
};
