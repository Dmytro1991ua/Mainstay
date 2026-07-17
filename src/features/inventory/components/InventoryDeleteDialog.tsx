import { AlertTriangle } from "lucide-react";

import { ConfirmDialog } from "@/shared/ui/dialog";

import type { InventoryItem } from "../api/inventory.api";

type InventoryDeleteDialogProps = {
  target: InventoryItem | null;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isDeleting: boolean;
};

export const InventoryDeleteDialog = ({
  target,
  onConfirm,
  onClose,
  isDeleting,
}: InventoryDeleteDialogProps) => (
  <ConfirmDialog
    open={target !== null}
    title="Delete item"
    description={
      <>
        <strong className="font-medium text-text">&ldquo;{target?.name}&rdquo;</strong> will be
        permanently removed from inventory. This cannot be undone.
      </>
    }
    icon={<AlertTriangle className="size-5 text-red" />}
    confirmLabel={isDeleting ? "Deleting…" : "Delete"}
    variant="destructive"
    onConfirm={onConfirm}
    onClose={onClose}
  />
);
