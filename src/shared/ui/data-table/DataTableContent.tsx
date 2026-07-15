import { AlertTriangle, Inbox } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";

import { EmptyState } from "@/shared/ui/empty-state";

import { DataTableBody } from "./DataTableBody";
import { DataTableFetchRows } from "./DataTableFetchRows";
import { DataTableHeader } from "./DataTableHeader";
import { DataTableSkeleton } from "./DataTableSkeleton";

import type { RowHighlightInfo } from "./types";
import type { Table } from "@tanstack/react-table";
import type { ReactNode } from "react";

type DataTableContentProps<TData> = {
  table: Table<TData>;
  data: TData[];
  isPending?: boolean;
  isError?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  scrollContainerId: string;
  enableColumnResizing?: boolean;
  isScrolled: boolean;
  emptyState?: ReactNode;
  errorState?: ReactNode;
  onRowClick?: (row: TData) => void;
  getRowHighlightInfo?: (rowOriginal: TData) => RowHighlightInfo;
  isRowDisabled?: (rowOriginal: TData) => boolean;
  rowTooltipMessage?: string | ((rowOriginal: TData) => string);
};

export const DataTableContent = <TData,>({
  table,
  data,
  isPending,
  isError,
  hasNextPage,
  fetchNextPage,
  scrollContainerId,
  enableColumnResizing,
  isScrolled,
  emptyState,
  errorState,
  onRowClick,
  getRowHighlightInfo,
  isRowDisabled,
  rowTooltipMessage,
}: DataTableContentProps<TData>) => {
  "use no memo";
  const colCount = table.getVisibleLeafColumns().length;
  const rows = table.getRowModel().rows;

  const header = (
    <DataTableHeader
      table={table}
      enableColumnResizing={enableColumnResizing}
      isScrolled={isScrolled}
    />
  );

  if (isPending) {
    return (
      <table className="w-full min-w-max border-collapse text-sm">
        {header}
        <DataTableSkeleton colCount={colCount} />
      </table>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        {errorState ?? (
          <EmptyState
            icon={AlertTriangle}
            message="Failed to load data."
            description="Try refreshing the page."
            variant="red"
          />
        )}
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        {emptyState ?? <EmptyState icon={Inbox} message="No data found." />}
      </div>
    );
  }

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={fetchNextPage ?? (() => {})}
      hasMore={hasNextPage ?? false}
      loader={<DataTableFetchRows colCount={colCount} rowCount={3} />}
      scrollableTarget={scrollContainerId}
      style={{ overflow: "visible" }}
    >
      <table className="w-full min-w-max border-collapse text-sm">
        {header}
        <DataTableBody
          table={table}
          onRowClick={onRowClick}
          getRowHighlightInfo={getRowHighlightInfo}
          isRowDisabled={isRowDisabled}
          rowTooltipMessage={rowTooltipMessage}
        />
      </table>
    </InfiniteScroll>
  );
};
