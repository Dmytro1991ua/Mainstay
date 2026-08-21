import { Ban, CheckCircle2, Pencil, Trash2 } from "lucide-react";

import { DetailActions } from "@/shared/ui/detail-actions";

type TaskDetailActionsProps = {
  canManage: boolean;
  canDelete: boolean;
  canComplete: boolean;
  canCancel: boolean;
  isTerminal: boolean;
  taskStatus: string;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  onCancel: () => void;
};

const TERMINAL_EDIT_TOOLTIP: Record<string, string> = {
  DONE: "Completed tasks cannot be edited",
  CANCELLED: "Cancelled tasks cannot be edited",
};

export const TaskDetailActions = ({
  canManage,
  canDelete,
  canComplete,
  canCancel,
  isTerminal,
  taskStatus,
  onEdit,
  onDelete,
  onComplete,
  onCancel,
}: TaskDetailActionsProps) => (
  <DetailActions
    actions={[
      { label: "Complete", icon: CheckCircle2, onClick: onComplete, show: canComplete },
      { label: "Cancel", icon: Ban, onClick: onCancel, show: canCancel },
      {
        label: "Edit",
        icon: Pencil,
        onClick: onEdit,
        show: canManage,
        disabled: isTerminal,
        tooltip: TERMINAL_EDIT_TOOLTIP[taskStatus],
      },
      { label: "Delete", icon: Trash2, onClick: onDelete, variant: "destructive", show: canDelete },
    ]}
  />
);
