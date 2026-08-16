import { INVITE_ACTIONS, USER_ACTIONS } from "../config";

import { ActionsGroup } from "./ActionsGroup";

import type { ActionKey, UserTableRow } from "../config";

type UserRowActionsProps = {
  row: UserTableRow;
  isAdmin: boolean;
  currentUserId?: string;
  onDeactivate: (row: UserTableRow) => void;
  onActivate: (row: UserTableRow) => void;
  onDelete: (row: UserTableRow) => void;
  onResendInvite: (row: UserTableRow) => void;
  onCancelInvite: (row: UserTableRow) => void;
};

export const UserRowActions = ({
  row,
  isAdmin,
  currentUserId,
  onDeactivate,
  onActivate,
  onDelete,
  onResendInvite,
  onCancelInvite,
}: UserRowActionsProps) => {
  const handlers: Record<ActionKey, (row: UserTableRow) => void> = {
    resend: onResendInvite,
    cancelInvite: onCancelInvite,
    deactivate: onDeactivate,
    activate: onActivate,
    delete: onDelete,
  };

  if (row.source === "invite") {
    return (
      <ActionsGroup configs={INVITE_ACTIONS} row={row} isAdmin={isAdmin} handlers={handlers} />
    );
  }

  if (!isAdmin || row.id === currentUserId) return null;

  return <ActionsGroup configs={USER_ACTIONS} row={row} isAdmin={isAdmin} handlers={handlers} />;
};
