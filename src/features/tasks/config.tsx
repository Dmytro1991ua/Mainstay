import { Link } from "@tanstack/react-router";
import { format, formatDistanceToNow } from "date-fns";

import { cn } from "@/shared/lib/utils";
import { Alert } from "@/shared/ui/alert";
import type { FilterConfig } from "@/shared/ui/data-table";
import type { DetailField } from "@/shared/ui/detail-shell";
import { Pill, PillStatus } from "@/shared/ui/pill";

import { InlineStatusSelect } from "./components/InlineStatusSelect";
import { OverdueBadge } from "./components/OverdueBadge";
import { PhotoLink } from "./components/PhotoLink";
import { TaskDetailDescription } from "./components/TaskDetailDescription";
import { BeforePhotoField } from "./components/TaskDetailPhotoField";
import { TaskPriorityBadge } from "./components/TaskPriorityBadge";
import { formatDueDate, getUserInitials, isTaskOverdue } from "./utils";

import type { Task, TaskCategory, TaskPriority } from "./api/tasks.api";

export const TASK_STATUS_PILL: Record<"OPEN" | "IN_PROGRESS" | "DONE" | "CANCELLED", PillStatus> = {
  OPEN: PillStatus.Open,
  IN_PROGRESS: PillStatus.InProgress,
  DONE: PillStatus.Done,
  CANCELLED: PillStatus.Cancelled,
};

// Options available via inline PATCH (DONE set by /complete, CANCELLED set by /cancel — both blocked on PATCH)
export const TASK_STATUS_OPTIONS = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
];

export const TASK_PRIORITY_CONFIG: Record<TaskPriority, { label: string; className: string }> = {
  LOW: { label: "Low", className: "border-green-border bg-green-soft text-green" },
  MEDIUM: { label: "Medium", className: "border-amber-border bg-amber-soft text-amber" },
  HIGH: { label: "High", className: "border-red-border bg-red-soft text-red" },
};

export const TASK_PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

export const TASK_CATEGORY_CONFIG: Record<TaskCategory, { label: string }> = {
  ELECTRICAL: { label: "Electrical" },
  PLUMBING: { label: "Plumbing" },
  HVAC: { label: "HVAC" },
  TOOLS: { label: "Tools" },
  FASTENERS: { label: "Fasteners" },
  CHEMICALS: { label: "Chemicals" },
  SAFETY: { label: "Safety" },
  BUILDING_MATERIALS: { label: "Building Materials" },
};

export const TASK_CATEGORY_OPTIONS: { value: TaskCategory; label: string }[] = (
  Object.entries(TASK_CATEGORY_CONFIG) as [TaskCategory, { label: string }][]
).map(([value, { label }]) => ({ value, label }));

export const TASK_FILTER_CONFIG: FilterConfig[] = [
  {
    id: "status",
    label: "Status",
    type: "single",
    options: [
      { label: "Open", value: "OPEN" },
      { label: "In Progress", value: "IN_PROGRESS" },
      { label: "Done", value: "DONE" },
      { label: "Cancelled", value: "CANCELLED" },
    ],
  },
  {
    id: "priority",
    label: "Priority",
    type: "single",
    options: [
      { label: "Low", value: "LOW" },
      { label: "Medium", value: "MEDIUM" },
      { label: "High", value: "HIGH" },
    ],
  },
  {
    id: "overdue",
    label: "Overdue",
    type: "single",
    options: [{ label: "Overdue only", value: "true" }],
  },
];

type DetailFieldOptions = {
  canEditStatus: boolean;
  canUploadBeforePhoto: boolean;
  isUploadingBeforePhoto: boolean;
  onUploadBeforePhoto: (file: File) => Promise<void>;
};

export const getTaskDetailFields = (task: Task, options: DetailFieldOptions): DetailField[] => {
  const { canEditStatus, canUploadBeforePhoto, isUploadingBeforePhoto, onUploadBeforePhoto } =
    options;
  const isOverdue = isTaskOverdue(task);

  const fields: DetailField[] = [
    {
      label: "Status",
      value: canEditStatus ? (
        <InlineStatusSelect task={task} />
      ) : (
        <Pill status={TASK_STATUS_PILL[task.status]} />
      ),
    },
    { label: "Priority", value: <TaskPriorityBadge priority={task.priority} /> },
    {
      label: "Category",
      value: task.category ? (
        <span className="text-sm text-text">{TASK_CATEGORY_CONFIG[task.category].label}</span>
      ) : (
        <span className="text-text-3">—</span>
      ),
    },
    {
      label: "Asset",
      value: task.asset ? (
        <Link
          to="/assets/$assetId"
          params={{ assetId: task.asset.id }}
          className="text-sm font-medium text-accent hover:underline"
        >
          {task.asset.name}
          <span className="ml-2 font-mono text-xs font-normal text-text-3">
            {task.asset.serialNumber}
          </span>
        </Link>
      ) : (
        <span className="text-text-3">—</span>
      ),
    },
    {
      label: "Assigned to",
      value: task.assignee ? (
        <div className="flex items-center gap-2">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[10.5px] font-semibold text-accent">
            {getUserInitials(task.assignee.userName)}
          </div>
          <div>
            <span className="font-medium text-text">{task.assignee.userName}</span>
            <span className="ml-2 text-xs text-text-3">{task.assignee.email}</span>
          </div>
        </div>
      ) : (
        <span className="text-text-3">Unassigned</span>
      ),
    },
    {
      label: "Due date",
      value: task.dueDate ? (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn("font-medium", isOverdue ? "text-amber" : "text-text")}>
            {formatDueDate(task.dueDate)}
          </span>
          {isOverdue && <OverdueBadge />}
        </div>
      ) : (
        <span className="text-text-3">—</span>
      ),
    },
    {
      label: "Created",
      value: <span className="text-text-2">{format(new Date(task.createdAt), "MMM d, yyyy")}</span>,
    },
    {
      label: "Last updated",
      value: (
        <span className="text-text-2">
          {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
        </span>
      ),
    },
  ];

  if (task.status === "IN_PROGRESS") {
    fields.push({
      label: "Before photo",
      value: (
        <BeforePhotoField
          task={task}
          canUploadBeforePhoto={canUploadBeforePhoto}
          isUploadingBeforePhoto={isUploadingBeforePhoto}
          onUploadBeforePhoto={(files) => {
            const file = files[0];
            if (file) void onUploadBeforePhoto(file);
          }}
        />
      ),
    });
  } else if (task.beforePhotoUrl) {
    fields.push({
      label: "Before photo",
      value: <PhotoLink href={task.beforePhotoUrl} alt="Before" />,
    });
  }

  if (task.afterPhotoUrl) {
    fields.push({
      label: "After photo",
      value: <PhotoLink href={task.afterPhotoUrl} alt="After" />,
    });
  }

  if (task.status === "CANCELLED" && task.cancellationReason) {
    fields.push({
      label: "Cancellation reason",
      value: <span className="text-sm text-text">{task.cancellationReason}</span>,
    });
  }

  if (task.status === "CANCELLED" && task.cancelledAt) {
    fields.push({
      label: "Cancelled",
      value: (
        <span className="text-sm text-text-2">
          {format(new Date(task.cancelledAt), "MMM d, yyyy")}
          <span className="ml-2 text-text-3">
            ({formatDistanceToNow(new Date(task.cancelledAt), { addSuffix: true })})
          </span>
        </span>
      ),
    });
  }

  fields.push({
    label: "Description",
    value: <TaskDetailDescription description={task.description} />,
  });

  return fields;
};

export const TERMINAL_BANNERS: Partial<Record<string, React.ReactNode>> = {
  DONE: <Alert variant="success">This task has been completed and is read-only.</Alert>,
  CANCELLED: <Alert variant="error">This task was cancelled and is read-only.</Alert>,
};
