import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, CalendarClock, Plus, RotateCcw } from "lucide-react";
import { useState } from "react";

import { useAuthStore } from "@/shared/stores/auth-store";
import { Button } from "@/shared/ui/button";
import { DataTable } from "@/shared/ui/data-table";
import { ConfirmDialog } from "@/shared/ui/dialog";
import { EmptyState } from "@/shared/ui/empty-state";

import { useRecurringTaskColumns } from "../hooks/use-recurring-task-columns";
import { useRecurringTaskForm } from "../hooks/use-recurring-task-form";
import { useRecurringTasksQuery } from "../hooks/use-recurring-tasks";
import { useScheduleActions } from "../hooks/use-schedule-actions";

import { RecurringTaskFormSheet } from "./RecurringTaskFormSheet";

import type { RecurringTask } from "../api/recurring-tasks.api";

type RecurringTasksTableProps = {
  isActiveFilter?: boolean;
};

const NOOP_SET_STATE = () => {};

export const RecurringTasksTable = ({ isActiveFilter }: RecurringTasksTableProps) => {
  const navigate = useNavigate();
  const roles = useAuthStore((s) => s.user?.roles ?? []);
  const canDelete = roles.includes("ADMIN");
  const {
    data: schedules = [],
    isPending,
    isError,
    refetch,
  } = useRecurringTasksQuery(
    isActiveFilter !== undefined ? { isActive: isActiveFilter } : undefined,
  );

  const { sheetMode, form, openAdd, openEdit, closeSheet, handleSave, isSaving } =
    useRecurringTaskForm();

  const [deleteTarget, setDeleteTarget] = useState<RecurringTask | null>(null);
  const { handlePause, handleResume, handleDelete, isDeleting } = useScheduleActions();

  const columns = useRecurringTaskColumns({
    canDelete,
    onEdit: openEdit,
    onDelete: setDeleteTarget,
    onPause: handlePause,
    onResume: handleResume,
  });

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await handleDelete(deleteTarget, () => setDeleteTarget(null));
  };

  return (
    <>
      <DataTable
        tableId="recurring-tasks"
        columns={columns}
        data={schedules}
        isPending={isPending}
        isError={isError}
        tableState={{}}
        onSetTableState={NOOP_SET_STATE}
        hideSearch
        enableSorting={false}
        getRowId={(row) => row.id}
        onRowClick={(row) =>
          navigate({ to: "/recurring-tasks/$scheduleId", params: { scheduleId: row.id } })
        }
        actions={
          <Button size="sm" onClick={openAdd}>
            <Plus className="size-3.5" />
            New schedule
          </Button>
        }
        emptyState={
          <EmptyState
            icon={CalendarClock}
            message="No schedules yet"
            description="Create a recurring maintenance schedule to auto-generate work orders."
            action={
              <Button size="sm" onClick={openAdd}>
                <Plus className="size-3.5" />
                New schedule
              </Button>
            }
          />
        }
        errorState={
          <EmptyState
            icon={AlertTriangle}
            message="Failed to load schedules"
            description="Something went wrong. Please try again."
            variant="red"
            action={
              <Button variant="outline" size="sm" onClick={() => void refetch()}>
                <RotateCcw className="size-3.5" />
                Retry
              </Button>
            }
          />
        }
      />
      <RecurringTaskFormSheet
        sheetMode={sheetMode}
        form={form}
        onSave={handleSave}
        onClose={closeSheet}
        isSaving={isSaving}
      />
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete schedule"
        description={
          <>
            <strong className="font-medium text-text">&ldquo;{deleteTarget?.title}&rdquo;</strong>{" "}
            will be permanently deleted. Generated tasks will be preserved.
          </>
        }
        icon={<AlertTriangle className="size-5 text-red" />}
        confirmLabel={isDeleting ? "Deleting…" : "Delete"}
        variant="destructive"
        onConfirm={() => void confirmDelete()}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
};
