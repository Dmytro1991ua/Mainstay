import { AlertTriangle } from "lucide-react";

import { ConfirmDialog } from "@/shared/ui/dialog";

import type { Asset } from "../api/assets.api";

type AssetDeleteDialogProps = {
  target: Asset | null;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isDeleting: boolean;
};

export const AssetDeleteDialog = ({
  target,
  onConfirm,
  onClose,
  isDeleting,
}: AssetDeleteDialogProps) => (
  <ConfirmDialog
    open={target !== null}
    title="Delete asset"
    description={
      <>
        <strong className="font-medium text-text">&ldquo;{target?.name}&rdquo;</strong> will be
        permanently removed. Linked tasks are kept but unlinked. This cannot be undone.
      </>
    }
    icon={<AlertTriangle className="size-5 text-red" />}
    confirmLabel={isDeleting ? "Deleting…" : "Delete"}
    variant="destructive"
    onConfirm={onConfirm}
    onClose={onClose}
  />
);
