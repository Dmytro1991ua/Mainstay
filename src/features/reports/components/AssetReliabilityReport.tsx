import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, HardHat, RotateCcw } from "lucide-react";

import type { AssetStatus } from "@/features/assets/api/assets.api";
import { getAssetStatusRowHighlight } from "@/features/assets/utils";
import { Button } from "@/shared/ui/button";
import { DataTable } from "@/shared/ui/data-table";
import type { OnSetTableState, TableUrlState } from "@/shared/ui/data-table";
import { EmptyState } from "@/shared/ui/empty-state";

import { useReliabilityColumns } from "../hooks/use-reliability-columns";
import { useReliabilityData } from "../hooks/use-reliability-data";

import type { AssetReliabilityRow } from "../api/reports.api";

type AssetReliabilityReportProps = {
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
};

export const AssetReliabilityReport = ({
  tableState,
  onSetTableState,
}: AssetReliabilityReportProps) => {
  const navigate = useNavigate();

  const {
    rows,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    filterConfig,
  } = useReliabilityData(tableState);

  const columns = useReliabilityColumns();

  const handleRowClick = (row: AssetReliabilityRow) => {
    navigate({ to: "/assets/$assetId", params: { assetId: row.id } });
  };

  return (
    <DataTable
      tableId="asset-reliability"
      columns={columns}
      data={rows}
      isPending={isLoading}
      isError={isError}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
      searchPlaceholder="Search name or serial…"
      filterConfig={filterConfig}
      emptyState={
        <EmptyState
          icon={HardHat}
          message="No asset data yet"
          description="Assets appear here once tasks are logged against them."
        />
      }
      errorState={
        <EmptyState
          icon={AlertTriangle}
          message="Couldn't load asset reliability"
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
      getRowHighlightInfo={(row) => getAssetStatusRowHighlight(row.status as AssetStatus)}
      onRowClick={handleRowClick}
      getRowId={(row) => row.id}
      tableState={tableState}
      onSetTableState={onSetTableState}
      exportFilename="asset-reliability"
    />
  );
};
