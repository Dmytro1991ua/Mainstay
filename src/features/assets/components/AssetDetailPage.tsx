import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { DetailShell } from "@/shared/ui/detail-shell";
import { EmptyState } from "@/shared/ui/empty-state";

import { getAssetDetailFields } from "../asset-detail.config";
import { useAssetDetail } from "../hooks/use-asset-detail";

import { AssetDeleteDialog } from "./AssetDeleteDialog";
import { AssetDetailActions } from "./AssetDetailActions";
import { AssetFormSheet } from "./AssetFormSheet";
import { AssetMaintenanceHistory } from "./AssetMaintenanceHistory";

const SKELETON_KEYS = ["Status", "Serial number", "Category", "Location", "Added", "Last updated"];

type AssetDetailPageProps = { assetId: string };

export const AssetDetailPage = ({ assetId }: AssetDetailPageProps) => {
  const {
    asset,
    isPending,
    isError,
    refetch,
    canManage,
    canDelete,
    openEdit,
    form,
    isSaving,
    handleSave,
    sheetMode,
    closeSheet,
    openDelete,
    deleteTarget,
    handleDelete,
    closeDelete,
    isDeleting,
  } = useAssetDetail(assetId);

  if (isPending) {
    return (
      <DetailShell backTo="/assets" title="" fields={[]} isPending skeletonKeys={SKELETON_KEYS} />
    );
  }

  if (isError || !asset) {
    return (
      <div className="flex flex-1 flex-col gap-4 min-h-0">
        <DetailShell backTo="/assets" title="Asset not found" fields={[]} />
        <div className="flex flex-1 items-center justify-center rounded-xl border border-border bg-panel p-6 shadow-card">
          <EmptyState
            icon={AlertTriangle}
            message="Asset not found"
            description="This asset may have been deleted or doesn't exist."
            variant="red"
            action={
              <Button onClick={() => refetch()}>
                <RotateCcw className="size-3.5" />
                Retry
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <DetailShell
        backTo="/assets"
        title={asset.name}
        actions={
          <AssetDetailActions
            canManage={canManage}
            canDelete={canDelete}
            onEdit={() => openEdit(asset)}
            onDelete={() => openDelete(asset)}
          />
        }
        fields={getAssetDetailFields(asset)}
        skeletonKeys={SKELETON_KEYS}
      >
        <AssetMaintenanceHistory assetId={asset.id} />
      </DetailShell>

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
