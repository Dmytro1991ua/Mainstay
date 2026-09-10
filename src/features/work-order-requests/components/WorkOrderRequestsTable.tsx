import { AlertTriangle, Inbox, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { DataTable } from "@/shared/ui/data-table";
import type { OnSetTableState, TableUrlState } from "@/shared/ui/data-table";
import { EmptyState } from "@/shared/ui/empty-state";

import { useWorkOrderRequestColumns } from "../hooks/use-work-order-request-columns";
import { useWorkOrderRequestsData } from "../hooks/use-work-order-requests-data";

type WorkOrderRequestsTableProps = {
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
};

export const WorkOrderRequestsTable = ({
  tableState,
  onSetTableState,
}: WorkOrderRequestsTableProps) => {
  const {
    requests,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    filterConfig,
  } = useWorkOrderRequestsData(tableState);

  const columns = useWorkOrderRequestColumns();

  return (
    <DataTable
      tableId="work-order-requests"
      columns={columns}
      data={requests}
      isPending={isLoading}
      isError={isError}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
      searchPlaceholder="Search requests…"
      filterConfig={filterConfig}
      emptyState={
        <EmptyState
          icon={Inbox}
          message="No requests found"
          description="Try adjusting your search or filters."
        />
      }
      errorState={
        <EmptyState
          icon={AlertTriangle}
          message="Couldn't load requests"
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
      exportFilename="work-order-requests"
    />
  );
};
