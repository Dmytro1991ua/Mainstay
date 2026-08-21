import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { DetailShell } from "@/shared/ui/detail-shell";
import { EmptyState } from "@/shared/ui/empty-state";

import { getTaskDetailFields, TERMINAL_BANNERS } from "../config";
import { useTaskCancel } from "../hooks/use-task-cancel";
import { useTaskComplete } from "../hooks/use-task-complete";
import { useTaskDetail } from "../hooks/use-task-detail";

const SKELETON_KEYS = [
  "Status",
  "Priority",
  "Category",
  "Assigned to",
  "Due date",
  "Created",
  "Last updated",
  "Description",
];

import { TaskCancelDialog } from "./TaskCancelDialog";
import { TaskCompleteSheet } from "./TaskCompleteSheet";
import { TaskDeleteDialog } from "./TaskDeleteDialog";
import { TaskDetailActions } from "./TaskDetailActions";
import { TaskFormSheet } from "./TaskFormSheet";

type TaskDetailPageProps = { taskId: string };

export const TaskDetailPage = ({ taskId }: TaskDetailPageProps) => {
  const {
    task,
    isPending,
    isError,
    refetch,
    isTerminal,
    canManage,
    canDelete,
    canEditStatus,
    canComplete,
    canCancel,
    canUploadBeforePhoto,
    isUploadingBeforePhoto,
    handleUploadBeforePhoto,
    openEdit,
    form,
    isSaving,
    handleSave,
    sheetMode,
    closeSheet,
    openDelete,
    deleteTarget,
    handleDelete,
    closeDelete,
    isDeleting,
  } = useTaskDetail(taskId);

  const { taskToComplete, openComplete, closeComplete } = useTaskComplete();
  const { cancelTarget, openCancel, closeCancel, handleCancel, isCancelling } = useTaskCancel();

  if (isPending) {
    return (
      <DetailShell backTo="/tasks" title="" fields={[]} isPending skeletonKeys={SKELETON_KEYS} />
    );
  }

  if (isError || !task) {
    return (
      <div className="flex flex-1 flex-col gap-4 min-h-0">
        <DetailShell backTo="/tasks" title="Task not found" fields={[]} />
        <div className="flex flex-1 items-center justify-center rounded-xl border border-border bg-panel p-6 shadow-card">
          <EmptyState
            icon={AlertTriangle}
            message="Task not found"
            description="This task may have been deleted or doesn't exist."
            variant="red"
            action={
              <Button onClick={() => refetch()}>
                <RotateCcw className="size-3.5" />
                Retry
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const terminalBanner = TERMINAL_BANNERS[task.status] ?? null;

  return (
    <>
      <DetailShell
        backTo="/tasks"
        title={task.title}
        banner={terminalBanner}
        actions={
          <TaskDetailActions
            canManage={canManage}
            canDelete={canDelete}
            canComplete={canComplete}
            canCancel={canCancel}
            isTerminal={isTerminal}
            taskStatus={task.status}
            onEdit={() => openEdit(task)}
            onDelete={() => openDelete(task)}
            onComplete={() => openComplete(task)}
            onCancel={() => openCancel(task)}
          />
        }
        fields={getTaskDetailFields(task, {
          canEditStatus,
          canUploadBeforePhoto,
          isUploadingBeforePhoto,
          onUploadBeforePhoto: handleUploadBeforePhoto,
        })}
        skeletonKeys={SKELETON_KEYS}
      />
      <TaskFormSheet
        sheetMode={sheetMode}
        form={form}
        canManage={canManage}
        onSave={handleSave}
        onClose={closeSheet}
        isSaving={isSaving}
      />
      <TaskDeleteDialog
        target={deleteTarget}
        onConfirm={handleDelete}
        onClose={closeDelete}
        isDeleting={isDeleting}
      />
      <TaskCompleteSheet task={taskToComplete} onClose={closeComplete} />
      <TaskCancelDialog
        target={cancelTarget}
        onConfirm={handleCancel}
        onClose={closeCancel}
        isCancelling={isCancelling}
      />
    </>
  );
};
