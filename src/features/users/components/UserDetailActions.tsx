import { PowerIcon, PowerOff, Trash2 } from "lucide-react";

import { DetailActions } from "@/shared/ui/detail-actions";

type UserDetailActionsProps = {
  canManageUser: boolean;
  isActive: boolean;
  onDeactivate: () => void;
  onActivate: () => void;
  onDelete: () => void;
};

export const UserDetailActions = ({
  canManageUser,
  isActive,
  onDeactivate,
  onActivate,
  onDelete,
}: UserDetailActionsProps) => (
  <DetailActions
    actions={[
      {
        label: "Deactivate",
        icon: PowerOff,
        onClick: onDeactivate,
        variant: "destructive",
        show: canManageUser && isActive,
      },
      {
        label: "Activate",
        icon: PowerIcon,
        onClick: onActivate,
        show: canManageUser && !isActive,
      },
      {
        label: "Delete",
        icon: Trash2,
        onClick: onDelete,
        variant: "destructive",
        show: canManageUser,
      },
    ]}
  />
);
