import { AlertTriangle, RotateCcw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { DetailShell } from "@/shared/ui/detail-shell";
import { ConfirmDialog } from "@/shared/ui/dialog";
import { EmptyState } from "@/shared/ui/empty-state";

import { getScheduleDetailFields, SCHEDULE_DETAIL_SKELETON_KEYS } from "../config";
import { useRecurringTaskDetail } from "../hooks/use-recurring-task-detail";

import { RecurringTaskDetailActions } from "./RecurringTaskDetailActions";
import { RecurringTaskFormSheet } from "./RecurringTaskFormSheet";

type RecurringTaskDetailPageProps = { scheduleId: string };

export const RecurringTaskDetailPage = ({ scheduleId }: RecurringTaskDetailPageProps) => {
  const {
    schedule,
    isPending,
    isError,
    refetch,
    canManage,
    sheetMode,
    form,
    openEdit,
    closeSheet,
    handleSave,
    isSaving,
    handlePause,
    handleResume,
    isPausing,
    isResuming,
    handleDelete,
    isDeleting,
  } = useRecurringTaskDetail(scheduleId);

  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isPending) {
    return (
      <DetailShell
        backTo="/recurring-tasks"
        title=""
        fields={[]}
        isPending
        skeletonKeys={SCHEDULE_DETAIL_SKELETON_KEYS}
      />
    );
  }

  if (isError || !schedule) {
    return (
      <div className="flex flex-1 flex-col gap-4 min-h-0">
        <DetailShell backTo="/recurring-tasks" title="Schedule not found" fields={[]} />
        <div className="flex flex-1 items-center justify-center rounded-xl border border-border bg-panel p-6 shadow-card">
          <EmptyState
            icon={AlertTriangle}
            message="Schedule not found"
            description="This schedule may have been deleted or doesn't exist."
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

  return (
    <>
      <DetailShell
        backTo="/recurring-tasks"
        title={schedule.title}
        actions={
          canManage ? (
            <RecurringTaskDetailActions
              isActive={schedule.isActive}
              isPausing={isPausing}
              isResuming={isResuming}
              onPause={handlePause}
              onResume={handleResume}
              onEdit={() => openEdit(schedule)}
              onDelete={() => setConfirmDelete(true)}
            />
          ) : undefined
        }
        fields={getScheduleDetailFields(schedule)}
        skeletonKeys={SCHEDULE_DETAIL_SKELETON_KEYS}
      />
      <RecurringTaskFormSheet
        sheetMode={sheetMode}
        form={form}
        onSave={handleSave}
        onClose={closeSheet}
        isSaving={isSaving}
      />
      <ConfirmDialog
        open={confirmDelete}
        title="Delete schedule"
        description={
          <>
            <strong className="font-medium text-text">&ldquo;{schedule.title}&rdquo;</strong> will
            be permanently deleted. Generated tasks will be preserved.
          </>
        }
        icon={<AlertTriangle className="size-5 text-red" />}
        confirmLabel={isDeleting ? "Deleting…" : "Delete"}
        variant="destructive"
        onConfirm={handleDelete}
        onClose={() => setConfirmDelete(false)}
      />
    </>
  );
};
