import { AlertTriangle } from "lucide-react";

import { ConfirmDialog } from "@/shared/ui/dialog";

import type { Meter } from "../api/meters.api";

type MeterDeleteDialogProps = {
  target: Meter | null;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isDeleting: boolean;
};

export const MeterDeleteDialog = ({
  target,
  onConfirm,
  onClose,
  isDeleting,
}: MeterDeleteDialogProps) => (
  <ConfirmDialog
    open={target !== null}
    title="Delete meter"
    description={
      <>
        <strong className="font-medium text-text">&ldquo;{target?.name}&rdquo;</strong> and its
        reading history will be permanently removed. This cannot be undone.
      </>
    }
    icon={<AlertTriangle className="size-5 text-red" />}
    confirmLabel={isDeleting ? "Deleting…" : "Delete"}
    variant="destructive"
    onConfirm={onConfirm}
    onClose={onClose}
  />
);
