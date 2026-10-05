import { AlertTriangle, PackagePlus, Plus, RotateCcw } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { DataTable } from "@/shared/ui/data-table";
import type { OnSetTableState, TableUrlState } from "@/shared/ui/data-table";
import { ConfirmDialog } from "@/shared/ui/dialog";
import { EmptyState } from "@/shared/ui/empty-state";

import { REORDER_ACTIONS } from "../config";
import { useReorderActions } from "../hooks/use-reorder-actions";
import { useReorderColumns } from "../hooks/use-reorder-columns";
import { useReorderForm } from "../hooks/use-reorder-form";
import { useReordersData } from "../hooks/use-reorders-data";
import { getReorderRowHighlight } from "../utils";

import { RaiseReorderSheet } from "./RaiseReorderSheet";
import { ReorderReceiveDialog } from "./ReorderReceiveDialog";

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

  const { pending, openAction, closeAction, confirm, isPending } = useReorderActions();
  const {
    isOpen,
    openSheet,
    closeSheet,
    inventoryItemId,
    setInventoryItemId,
    handleSubmit,
    isSaving,
  } = useReorderForm();

  const columns = useReorderColumns({ onAction: openAction });

  const isReceive = pending?.type === "receive";
  const confirmSpec = pending && !isReceive ? REORDER_ACTIONS[pending.type] : null;

  return (
    <>
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
        actions={
          <Button onClick={openSheet} disabled={isError}>
            <Plus />
            Raise reorder
          </Button>
        }
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
        getRowHighlightInfo={getReorderRowHighlight}
        getRowId={(row) => row.id}
        tableState={tableState}
        onSetTableState={onSetTableState}
        exportFilename="reorders"
      />
      <RaiseReorderSheet
        open={isOpen}
        value={inventoryItemId}
        onValueChange={setInventoryItemId}
        onSave={handleSubmit}
        onClose={closeSheet}
        isSaving={isSaving}
      />
      <ConfirmDialog
        open={confirmSpec !== null}
        onClose={closeAction}
        onConfirm={() => confirm()}
        title={confirmSpec?.title ?? ""}
        description={pending && confirmSpec ? confirmSpec.describe(pending.reorder) : undefined}
        icon={
          confirmSpec ? (
            <confirmSpec.icon className={cn("size-5", confirmSpec.iconClass)} />
          ) : undefined
        }
        confirmLabel={confirmSpec?.confirmLabel}
        variant={confirmSpec?.dialogVariant ?? "default"}
      />
      <ReorderReceiveDialog
        key={pending?.reorder.id}
        target={isReceive ? pending.reorder : null}
        onConfirm={confirm}
        onClose={closeAction}
        isReceiving={isPending}
      />
    </>
  );
};
