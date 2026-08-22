import { Pause, Pencil, Play, Trash2 } from "lucide-react";

import { DetailActions } from "@/shared/ui/detail-actions";

type RecurringTaskDetailActionsProps = {
  isActive: boolean;
  isPausing: boolean;
  isResuming: boolean;
  onPause: () => void;
  onResume: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const getToggleLabel = (isActive: boolean, isPausing: boolean, isResuming: boolean) => {
  if (isActive) return isPausing ? "Pausing…" : "Pause";
  return isResuming ? "Resuming…" : "Resume";
};

export const RecurringTaskDetailActions = ({
  isActive,
  isPausing,
  isResuming,
  onPause,
  onResume,
  onEdit,
  onDelete,
}: RecurringTaskDetailActionsProps) => (
  <DetailActions
    actions={[
      {
        label: getToggleLabel(isActive, isPausing, isResuming),
        icon: isActive ? Pause : Play,
        onClick: isActive ? onPause : onResume,
        show: true,
      },
      { label: "Edit", icon: Pencil, onClick: onEdit, show: true },
      { label: "Delete", icon: Trash2, onClick: onDelete, variant: "destructive", show: true },
    ]}
  />
);
