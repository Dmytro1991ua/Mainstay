import type { ColumnDef, SortingState } from "@tanstack/react-table";
import type { ReactNode } from "react";

export type ActiveFilters = Record<string, string[]>;

export type RowHighlightInfo = {
  isHighlighted: boolean;
  highlightStyles: string;
};

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterConfig = {
  id: string;
  label: string;
  options: FilterOption[];
  type?: "single" | "multi";
};

/** Shareable table state — lives in URL search params on the route. */
export type TableUrlState = {
  sorting?: SortingState;
  search?: string;
  filters?: ActiveFilters;
};

/** Functional updater that writes the next state back (wraps navigate on the route side). */
export type OnSetTableState = (updater: (prev: TableUrlState) => TableUrlState) => void;

/** Shared type for hooks that read/write through the shared state container. */
export type TableStateHookParams = {
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
};

export type DataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  tableId: string;
  isPending?: boolean;
  isError?: boolean;
  // Infinite scroll — wire directly to React Query's useInfiniteQuery
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  isFetchingNextPage?: boolean;
  // Toolbar
  searchPlaceholder?: string;
  filterConfig?: FilterConfig[];
  exportFilename?: string;
  // Slot for feature-specific action buttons (e.g. "Add item") rendered right of the search bar
  actions?: ReactNode;
  // States
  emptyState?: ReactNode;
  errorState?: ReactNode;
  // Row behavior
  onRowClick?: (row: TData) => void;
  getRowId?: (row: TData) => string;
  getRowHighlightInfo?: (rowOriginal: TData) => RowHighlightInfo;
  isRowDisabled?: (rowOriginal: TData) => boolean;
  rowTooltipMessage?: string | ((rowOriginal: TData) => string);
  // URL-backed table state — route creates from Route.useSearch() + navigate
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
  // Called whenever row selection changes — store result in Zustand or local state for bulk actions
  onSelectionChange?: (rows: TData[]) => void;
  // Layout
  maxHeight?: string;
  // Feature toggles
  enableRowSelection?: boolean;
  enableColumnVisibility?: boolean;
  enableColumnResizing?: boolean;
  enableSorting?: boolean;
  hideSearch?: boolean;
};
