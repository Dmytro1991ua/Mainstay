import { AlertTriangle } from "lucide-react";

import { ConfirmDialog } from "@/shared/ui/dialog";
import { formatUserName } from "@/shared/utils";

import type { UserTableRow } from "../hooks/use-users";

type UserDeleteDialogProps = {
  target: UserTableRow | null;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isDeleting: boolean;
};

export const UserDeleteDialog = ({
  target,
  onConfirm,
  onClose,
  isDeleting,
}: UserDeleteDialogProps) => (
  <ConfirmDialog
    open={target !== null}
    title="Delete user"
    description={
      <>
        <strong className="font-medium text-text">
          {target?.userName ? formatUserName(target.userName) : target?.email}
        </strong>{" "}
        will be permanently deleted. This cannot be undone.
      </>
    }
    icon={<AlertTriangle className="size-5 text-red" />}
    confirmLabel={isDeleting ? "Deleting…" : "Delete"}
    variant="destructive"
    onConfirm={onConfirm}
    onClose={onClose}
  />
);
