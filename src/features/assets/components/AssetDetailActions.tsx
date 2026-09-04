import { Pencil, Trash2 } from "lucide-react";

import { DetailActions } from "@/shared/ui/detail-actions";

type AssetDetailActionsProps = {
  canManage: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export const AssetDetailActions = ({
  canManage,
  canDelete,
  onEdit,
  onDelete,
}: AssetDetailActionsProps) => (
  <DetailActions
    actions={[
      { label: "Edit", icon: Pencil, onClick: onEdit, show: canManage },
      { label: "Delete", icon: Trash2, onClick: onDelete, variant: "destructive", show: canDelete },
    ]}
  />
);
