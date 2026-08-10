import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/button";

type TaskDetailActionsProps = {
  canManage: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export const TaskDetailActions = ({
  canManage,
  canDelete,
  onEdit,
  onDelete,
}: TaskDetailActionsProps) => (
  <>
    {canManage && (
      <Button variant="outline" size="sm" onClick={onEdit}>
        <Pencil className="size-3.5" />
        Edit
      </Button>
    )}
    {canDelete && (
      <Button variant="destructive" size="sm" onClick={onDelete}>
        <Trash2 className="size-3.5" />
        Delete
      </Button>
    )}
  </>
);
