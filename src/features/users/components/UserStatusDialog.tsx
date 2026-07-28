import { UserX } from "lucide-react";

import { ConfirmDialog } from "@/shared/ui/dialog";
import { formatUserName } from "@/shared/utils";

import type { UserTableRow } from "../hooks/use-users";

type UserStatusDialogProps = {
  target: UserTableRow | null;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isUpdating: boolean;
};

export const UserStatusDialog = ({
  target,
  onConfirm,
  onClose,
  isUpdating,
}: UserStatusDialogProps) => (
  <ConfirmDialog
    open={target !== null}
    title="Deactivate user"
    description={
      <>
        <strong className="font-medium text-text">
          {target?.userName ? formatUserName(target.userName) : target?.email}
        </strong>{" "}
        will be deactivated and will no longer be able to sign in.
      </>
    }
    icon={<UserX className="size-5 text-red" />}
    confirmLabel={isUpdating ? "Deactivating…" : "Deactivate"}
    variant="destructive"
    onConfirm={onConfirm}
    onClose={onClose}
  />
);
