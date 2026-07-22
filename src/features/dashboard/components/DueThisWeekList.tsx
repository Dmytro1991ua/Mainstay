import { format } from "date-fns";
import { CalendarClock } from "lucide-react";

import { EmptyState } from "@/shared/ui/empty-state";

import { Initials } from "./Initials";

import type { Task } from "../api/dashboard-api";

export const DueThisWeekList = ({ tasks }: { tasks: Task[] }) => {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={CalendarClock}
        message="Nothing due this week."
        description="No tasks are scheduled for this week."
      />
    );
  }

  return (
    <div className="divide-y divide-border">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center gap-3 py-2.5">
          {task.dueDate && (
            <span className="w-14 shrink-0 text-[12px] font-semibold text-accent">
              {format(new Date(task.dueDate), "MMM d")}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text">{task.title}</p>
            {task.assignee && (
              <p className="truncate text-[12px] text-text-3">{task.assignee.userName}</p>
            )}
          </div>
          {task.assignee && <Initials name={task.assignee.userName} />}
        </div>
      ))}
    </div>
  );
};
