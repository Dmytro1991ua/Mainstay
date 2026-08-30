import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, HardHat, Plus, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { DataTable } from "@/shared/ui/data-table";
import type { OnSetTableState, TableUrlState } from "@/shared/ui/data-table";
import { EmptyState } from "@/shared/ui/empty-state";

import { useAssetColumns } from "../hooks/use-asset-columns";
import { useAssetDelete } from "../hooks/use-asset-delete";
import { useAssetForm } from "../hooks/use-asset-form";
import { useAssetsData } from "../hooks/use-assets-data";

import { AssetDeleteDialog } from "./AssetDeleteDialog";
import { AssetFormSheet } from "./AssetFormSheet";

import type { Asset } from "../api/assets.api";

type AssetsTableProps = {
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
};

export const AssetsTable = ({ tableState, onSetTableState }: AssetsTableProps) => {
  const navigate = useNavigate();

  const {
    assets,
    isLoading,
    isError,
    refetch,
    canManage,
    canDelete,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    filterConfig,
  } = useAssetsData(tableState);
  const { openEdit, openAdd, form, isSaving, handleSave, sheetMode, closeSheet } = useAssetForm();
  const { isDeleting, openDelete, deleteTarget, handleDelete, closeDelete } = useAssetDelete();

  const columns = useAssetColumns({
    canManage,
    canDelete,
    onEdit: openEdit,
    onDelete: openDelete,
  });

  const handleRowClick = (asset: Asset) => {
    navigate({ to: "/assets/$assetId", params: { assetId: asset.id } });
  };

  return (
    <>
      <DataTable
        tableId="assets"
        columns={columns}
        data={assets}
        isPending={isLoading}
        isError={isError}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        searchPlaceholder="Search name, serial, or location…"
        filterConfig={filterConfig}
        enableRowSelection
        actions={
          canManage ? (
            <Button onClick={openAdd} disabled={isError}>
              <Plus />
              Add asset
            </Button>
          ) : null
        }
        emptyState={
          <EmptyState
            icon={HardHat}
            message="No assets found"
            description="Try adjusting your search or filters."
          />
        }
        errorState={
          <EmptyState
            icon={AlertTriangle}
            message="Couldn't load assets"
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
        onRowClick={handleRowClick}
        getRowId={(row) => row.id}
        tableState={tableState}
        onSetTableState={onSetTableState}
        exportFilename="assets"
      />
      <AssetFormSheet
        sheetMode={sheetMode}
        form={form}
        onSave={handleSave}
        onClose={closeSheet}
        isSaving={isSaving}
      />
      <AssetDeleteDialog
        target={deleteTarget}
        onConfirm={handleDelete}
        onClose={closeDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};
