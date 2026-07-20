import { AlertTriangle } from "lucide-react";

import { ConfirmDialog } from "@/shared/ui/dialog";

import type { Task } from "../api/tasks.api";

type TaskDeleteDialogProps = {
  target: Task | null;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isDeleting: boolean;
};

export const TaskDeleteDialog = ({
  target,
  onConfirm,
  onClose,
  isDeleting,
}: TaskDeleteDialogProps) => (
  <ConfirmDialog
    open={target !== null}
    title="Delete task"
    description={
      <>
        <strong className="font-medium text-text">&ldquo;{target?.title}&rdquo;</strong> will be
        permanently deleted. This cannot be undone.
      </>
    }
    icon={<AlertTriangle className="size-5 text-red" />}
    confirmLabel={isDeleting ? "Deleting…" : "Delete"}
    variant="destructive"
    onConfirm={onConfirm}
    onClose={onClose}
  />
);
