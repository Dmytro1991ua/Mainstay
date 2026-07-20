import { cn } from "@/shared/lib/utils";
import { Pill } from "@/shared/ui/pill";
import { RowActions } from "@/shared/ui/row-actions";

import { InlineStatusSelect } from "../components/InlineStatusSelect";
import { TASK_STATUS_PILL } from "../config";
import { formatDueDate, getUserInitials, isTaskOverdue } from "../utils";

import type { Task } from "../api/tasks.api";
import type { ColumnDef } from "@tanstack/react-table";

type UseTaskColumnsOptions = {
  canManage: boolean;
  canDelete: boolean;
  isTechnician: boolean;
  currentUserId?: string;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export const useTaskColumns = ({
  canManage,
  canDelete,
  isTechnician,
  currentUserId,
  onEdit,
  onDelete,
}: UseTaskColumnsOptions): ColumnDef<Task>[] => {
  const showActions = canManage || canDelete || isTechnician;

  return [
    {
      id: "title",
      accessorKey: "title",
      header: "Task",
      enableSorting: true,
      size: 320,
      cell: ({ row }) => {
        return <span className="font-medium">{row.original.title}</span>;
      },
    },
    {
      id: "assignee",
      header: "Assignee",
      enableSorting: false,
      size: 180,
      cell: ({ row }) => {
        const assignee = row.original.assignee;

        if (!assignee) return <span className="text-text-3">—</span>;

        return (
          <div className="flex items-center gap-2">
            <div className="flex size-[25px] shrink-0 items-center justify-center rounded-full bg-panel-2 text-[10.5px] font-semibold text-text-2">
              {getUserInitials(assignee.userName)}
            </div>
            <span className="text-sm text-text-2">{assignee.userName}</span>
          </div>
        );
      },
    },
    {
      id: "dueDate",
      header: "Due",
      enableSorting: true,
      size: 140,
      cell: ({ row }) => {
        const overdue = isTaskOverdue(row.original);
        return (
          <div className="flex flex-col gap-0.5">
            <span className={cn("text-sm", overdue ? "font-medium text-red" : "text-text-2")}>
              {formatDueDate(row.original.dueDate)}
            </span>
            {overdue && (
              <span className="inline-block rounded-md border border-red-border bg-red-soft px-1.5 py-px text-[11px] font-semibold text-red">
                Overdue
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      size: 120,
      cell: ({ row }) => {
        const task = row.original;
        const canEditStatus =
          canManage ||
          (isTechnician && task.assignedTo === currentUserId && task.status !== "DONE");
        return canEditStatus ? (
          <InlineStatusSelect task={task} />
        ) : (
          <Pill status={TASK_STATUS_PILL[task.status]} />
        );
      },
    },
    ...(showActions
      ? ([
          {
            id: "actions",
            header: "",
            enableSorting: false,
            enableResizing: false,
            enableHiding: false,
            size: canManage && canDelete ? 80 : 0,
            cell: ({ row }) => {
              const task = row.original;

              return (
                <RowActions
                  label={task.title}
                  onEdit={canManage ? () => onEdit(task) : undefined}
                  onDelete={canDelete ? () => onDelete(task) : undefined}
                />
              );
            },
          },
        ] satisfies ColumnDef<Task>[])
      : []),
  ];
};
