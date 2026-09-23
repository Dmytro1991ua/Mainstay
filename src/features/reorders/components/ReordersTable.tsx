import { AlertTriangle, PackagePlus, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { DataTable } from "@/shared/ui/data-table";
import type { OnSetTableState, TableUrlState } from "@/shared/ui/data-table";
import { EmptyState } from "@/shared/ui/empty-state";

import { useReorderColumns } from "../hooks/use-reorder-columns";
import { useReordersData } from "../hooks/use-reorders-data";

type ReordersTableProps = {
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
};

export const ReordersTable = ({ tableState, onSetTableState }: ReordersTableProps) => {
  const {
    reorders,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    filterConfig,
  } = useReordersData(tableState);

  const columns = useReorderColumns();

  return (
    <DataTable
      tableId="reorders"
      columns={columns}
      data={reorders}
      isPending={isLoading}
      isError={isError}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
      hideSearch
      filterConfig={filterConfig}
      emptyState={
        <EmptyState
          icon={PackagePlus}
          message="No reorders"
          description="Replenishment orders appear here when stock hits its reorder point."
        />
      }
      errorState={
        <EmptyState
          icon={AlertTriangle}
          message="Couldn't load reorders"
          description="The server didn't respond."
          variant="red"
          action={
            <Button onClick={() => refetch()}>
              <RotateCcw className="size-3.5" />
              Retry
            </Button>
          }
        />
      }
      getRowId={(row) => row.id}
      tableState={tableState}
      onSetTableState={onSetTableState}
      exportFilename="reorders"
    />
  );
};
