import { AlertTriangle, RotateCcw, Users } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { DataTable } from "@/shared/ui/data-table";
import type { OnSetTableState, TableUrlState } from "@/shared/ui/data-table";
import { EmptyState } from "@/shared/ui/empty-state";

import { useTechnicianWorkloadColumns } from "../hooks/use-technician-workload-columns";
import { useTechnicianWorkloadData } from "../hooks/use-technician-workload-data";

type TechnicianWorkloadReportProps = {
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
};

export const TechnicianWorkloadReport = ({
  tableState,
  onSetTableState,
}: TechnicianWorkloadReportProps) => {
  const {
    technicians,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useTechnicianWorkloadData(tableState);

  const columns = useTechnicianWorkloadColumns();

  return (
    <DataTable
      tableId="technician-workload"
      columns={columns}
      data={technicians}
      isPending={isLoading}
      isError={isError}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
      searchPlaceholder="Search technicians…"
      emptyState={
        <EmptyState
          icon={Users}
          message="No technicians found"
          description={
            tableState.search
              ? "Try adjusting your search."
              : "Technicians appear here once they're added to the workspace."
          }
        />
      }
      errorState={
        <EmptyState
          icon={AlertTriangle}
          message="Couldn't load technician workload"
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
      exportFilename="technician-workload"
    />
  );
};
