import { AlertTriangle, ClipboardList, Plus, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { DataTable } from "@/shared/ui/data-table";
import type { OnSetTableState, RowHighlightInfo, TableUrlState } from "@/shared/ui/data-table";
import { EmptyState } from "@/shared/ui/empty-state";

import { useTaskColumns } from "../hooks/use-task-columns";
import { useTaskDelete } from "../hooks/use-task-delete";
import { useTaskForm } from "../hooks/use-task-form";
import { useTasksData } from "../hooks/use-tasks-data";

import { TaskDeleteDialog } from "./TaskDeleteDialog";
import { TaskFormSheet } from "./TaskFormSheet";

import type { Task } from "../api/tasks.api";

const getTaskRowHighlight = (task: Task): RowHighlightInfo => ({
  isHighlighted: task.status === "DONE",
  highlightStyles: "bg-row-green",
});

type TasksTableProps = {
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
};

export const TasksTable = ({ tableState, onSetTableState }: TasksTableProps) => {
  const {
    tasks,
    isLoading,
    isError,
    refetch,
    canManage,
    canDelete,
    isTechnician,
    currentUserId,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    filterConfig,
  } = useTasksData(tableState);

  const {
    openEdit,
    openAdd,
    form,
    isSaving,
    handleSave,
    sheetMode,
    closeSheet,
    canManage: formCanManage,
  } = useTaskForm();
  const { isDeleting, openDelete, deleteTarget, handleDelete, closeDelete } = useTaskDelete();

  const columns = useTaskColumns({
    canManage,
    canDelete,
    isTechnician,
    currentUserId,
    onEdit: openEdit,
    onDelete: openDelete,
  });

  const handleRowClick = (task: Task) => {
    openEdit(task);
  };

  return (
    <>
      <DataTable
        tableId="tasks"
        columns={columns}
        data={tasks}
        isPending={isLoading}
        isError={isError}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        filterConfig={filterConfig}
        enableRowSelection={false}
        actions={
          canManage ? (
            <Button onClick={openAdd}>
              <Plus />
              New task
            </Button>
          ) : null
        }
        emptyState={
          <EmptyState
            icon={ClipboardList}
            message="No tasks found"
            description="Try adjusting your filters."
          />
        }
        errorState={
          <EmptyState
            icon={AlertTriangle}
            message="Couldn't load tasks"
            description="The server didn't respond."
            variant="red"
            action={
              <Button onClick={() => refetch()}>
                <RotateCcw className="size-3.5" />
                Retry
              </Button>
            }
          />
        }
        getRowHighlightInfo={getTaskRowHighlight}
        onRowClick={canManage ? handleRowClick : undefined}
        getRowId={(row) => row.id}
        tableState={tableState}
        onSetTableState={onSetTableState}
        exportFilename="tasks"
      />
      <TaskFormSheet
        sheetMode={sheetMode}
        form={form}
        canManage={formCanManage}
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
    </>
  );
};
