import { PackagePlus, Pencil, Trash2 } from "lucide-react";

import { DetailActions } from "@/shared/ui/detail-actions";

type InventoryDetailActionsProps = {
  canManage: boolean;
  canDelete: boolean;
  needsRestock: boolean;
  onEdit: () => void;
  onRestock: () => void;
  onDelete: () => void;
};

export const InventoryDetailActions = ({
  canManage,
  canDelete,
  needsRestock,
  onEdit,
  onRestock,
  onDelete,
}: InventoryDetailActionsProps) => (
  <DetailActions
    actions={[
      { label: "Edit", icon: Pencil, onClick: onEdit, show: canManage },
      { label: "Restock", icon: PackagePlus, onClick: onRestock, show: canManage && needsRestock },
      { label: "Delete", icon: Trash2, onClick: onDelete, variant: "destructive", show: canDelete },
    ]}
  />
);
