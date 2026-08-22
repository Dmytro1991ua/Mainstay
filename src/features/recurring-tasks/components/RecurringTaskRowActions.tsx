import { Pause, Pencil, Play, Trash2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { BASE_BTN } from "@/shared/ui/row-actions/config";

import type { RecurringTask } from "../api/recurring-tasks.api";
import type { LucideIcon } from "lucide-react";

type ActionConfig = {
  title: string;
  icon: LucideIcon;
  onClick: (e: React.MouseEvent) => void;
  hoverClass: string;
};

type RecurringTaskRowActionsProps = {
  schedule: RecurringTask;
  canDelete: boolean;
  onEdit: (schedule: RecurringTask) => void;
  onDelete: (schedule: RecurringTask) => void;
  onPause: (schedule: RecurringTask) => void;
  onResume: (schedule: RecurringTask) => void;
};

const stop = (e: React.MouseEvent, fn: () => void) => {
  e.stopPropagation();
  fn();
};

export const RecurringTaskRowActions = ({
  schedule,
  canDelete,
  onEdit,
  onDelete,
  onPause,
  onResume,
}: RecurringTaskRowActionsProps) => {
  const actions: ActionConfig[] = [
    {
      title: schedule.isActive ? "Pause schedule" : "Resume schedule",
      icon: schedule.isActive ? Pause : Play,
      onClick: (e) => stop(e, () => (schedule.isActive ? onPause(schedule) : onResume(schedule))),
      hoverClass: "hover:bg-amber-soft hover:text-amber",
    },
    {
      title: "Edit schedule",
      icon: Pencil,
      onClick: (e) => stop(e, () => onEdit(schedule)),
      hoverClass: "hover:bg-panel-2 hover:text-text",
    },
    ...(canDelete
      ? [
          {
            title: "Delete schedule",
            icon: Trash2,
            onClick: (e: React.MouseEvent) => stop(e, () => onDelete(schedule)),
            hoverClass: "hover:bg-red-soft hover:text-red",
          } satisfies ActionConfig,
        ]
      : []),
  ];

  return (
    <div className="flex items-center justify-end gap-1">
      {actions.map(({ title, icon: Icon, onClick, hoverClass }) => (
        <button
          key={title}
          type="button"
          title={title}
          onClick={onClick}
          className={cn(BASE_BTN, hoverClass)}
        >
          <Icon className="size-3.5" />
        </button>
      ))}
    </div>
  );
};
