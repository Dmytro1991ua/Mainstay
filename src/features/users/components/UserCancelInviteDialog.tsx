import { AlertTriangle } from "lucide-react";

import { ConfirmDialog } from "@/shared/ui/dialog";

import type { UserTableRow } from "../hooks/use-users";

type UserCancelInviteDialogProps = {
  target: UserTableRow | null;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isCancelling: boolean;
};

export const UserCancelInviteDialog = ({
  target,
  onConfirm,
  onClose,
  isCancelling,
}: UserCancelInviteDialogProps) => (
  <ConfirmDialog
    open={target !== null}
    title="Cancel invite"
    description={
      <>
        The invite sent to <strong className="font-medium text-text">{target?.email}</strong> will
        be cancelled. The invite link will no longer work.
      </>
    }
    icon={<AlertTriangle className="size-5 text-red" />}
    confirmLabel={isCancelling ? "Cancelling…" : "Cancel invite"}
    variant="destructive"
    onConfirm={onConfirm}
    onClose={onClose}
  />
);
