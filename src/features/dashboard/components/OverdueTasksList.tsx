import { differenceInDays } from "date-fns";
import { Clock } from "lucide-react";

import { EmptyState } from "@/shared/ui/empty-state";

import { Initials } from "./Initials";

import type { Task } from "../api/dashboard-api";

const DaysOverdueBadge = ({ dueDate }: { dueDate: string }) => {
  const days = differenceInDays(new Date(), new Date(dueDate));
  return (
    <span className="shrink-0 rounded-md bg-red-soft px-1.5 py-0.5 text-[11px] font-semibold text-red">
      {days}d
    </span>
  );
};

export const OverdueTasksList = ({ tasks }: { tasks: Task[] }) => {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        message="Nothing overdue."
        description="All tasks are on schedule."
        variant="green"
      />
    );
  }

  return (
    <div className="divide-y divide-border">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center gap-3 py-2.5">
          {task.assignee && <Initials name={task.assignee.userName} />}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text">{task.title}</p>
            {task.assignee && <p className="text-[12px] text-text-3">{task.assignee.userName}</p>}
          </div>
          {task.dueDate && <DaysOverdueBadge dueDate={task.dueDate} />}
        </div>
      ))}
    </div>
  );
};
