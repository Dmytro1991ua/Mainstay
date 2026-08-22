import { format } from "date-fns";

import { TaskPriorityBadge } from "@/features/tasks/components/TaskPriorityBadge";

import { RecurringTaskRowActions } from "../components/RecurringTaskRowActions";
import { RecurringTaskStatusBadge } from "../components/RecurringTaskStatusBadge";

import type { RecurringTask } from "../api/recurring-tasks.api";
import type { ColumnDef } from "@tanstack/react-table";

const UNSET = <span className="text-text-3">—</span>;

type UseRecurringTaskColumnsOptions = {
  onEdit: (schedule: RecurringTask) => void;
  onDelete: (schedule: RecurringTask) => void;
  onPause: (schedule: RecurringTask) => void;
  onResume: (schedule: RecurringTask) => void;
};

export const useRecurringTaskColumns = ({
  onEdit,
  onDelete,
  onPause,
  onResume,
}: UseRecurringTaskColumnsOptions): ColumnDef<RecurringTask>[] => [
  {
    id: "title",
    accessorKey: "title",
    header: "Schedule",
    size: 280,
    cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
  },
  {
    id: "intervalDays",
    header: "Repeats",
    size: 120,
    cell: ({ row }) => (
      <span className="text-sm text-text-2">Every {row.original.intervalDays}d</span>
    ),
  },
  {
    id: "nextDueAt",
    header: "Next due",
    size: 130,
    cell: ({ row }) => (
      <span className="text-sm text-text-2">
        {format(new Date(row.original.nextDueAt), "MMM d, yyyy")}
      </span>
    ),
  },
  {
    id: "priority",
    header: "Priority",
    size: 100,
    cell: ({ row }) => <TaskPriorityBadge priority={row.original.priority} />,
  },
  {
    id: "assignee",
    header: "Assignee",
    size: 160,
    cell: ({ row }) => {
      const { assignee } = row.original;
      if (!assignee) return UNSET;
      return <span className="text-sm text-text-2">{assignee.userName}</span>;
    },
  },
  {
    id: "isActive",
    header: "Status",
    size: 100,
    cell: ({ row }) => <RecurringTaskStatusBadge isActive={row.original.isActive} />,
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    enableResizing: false,
    enableHiding: false,
    size: 100,
    cell: ({ row }) => (
      <RecurringTaskRowActions
        schedule={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
        onPause={onPause}
        onResume={onResume}
      />
    ),
  },
];
