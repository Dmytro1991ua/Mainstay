import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ClipboardList, Plus, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/shared/ui/button";
import type { OnSetTableState, RowHighlightInfo, TableUrlState } from "@/shared/ui/data-table";
import { DataTable } from "@/shared/ui/data-table";
import { EmptyState } from "@/shared/ui/empty-state";
import { toast } from "@/shared/ui/toast";

import { useTaskColumns } from "../hooks/use-task-columns";
import { useTaskDelete } from "../hooks/use-task-delete";
import { useTaskForm } from "../hooks/use-task-form";
import { useTaskStartSheet } from "../hooks/use-task-start-sheet";
import { useTasksData } from "../hooks/use-tasks-data";
import { isTaskOverdue } from "../utils";

import { TaskDeleteDialog } from "./TaskDeleteDialog";
import { TaskFormSheet } from "./TaskFormSheet";
import { TaskStartSheet } from "./TaskStartSheet";

import type { Task } from "../api/tasks.api";
import type { TaskTab } from "../hooks/use-tasks-tab";

const getTaskRowHighlight = (task: Task): RowHighlightInfo => {
  if (task.status === "DONE") return { isHighlighted: true, highlightStyles: "bg-row-green" };
  if (task.status === "CANCELLED") return { isHighlighted: true, highlightStyles: "bg-row-red" };
  if (isTaskOverdue(task)) return { isHighlighted: true, highlightStyles: "bg-row-amber" };
  return { isHighlighted: false, highlightStyles: "" };
};

// Rendered outside DataTable so its portal events never bubble to any <tr> onClick.
const TaskStartSheetContainer = ({ task, onClose }: { task: Task; onClose: () => void }) => {
  const {
    photoUrl,
    isUploading,
    uploadProgress,
    isStarting,
    handlePhotoUpload,
    handleStart: startTask,
  } = useTaskStartSheet(task);

  const handleStart = async () => {
    if (!photoUrl) return;
    try {
      await startTask();
      toast.success("Task started");
      onClose();
    } catch {
      toast.error("Failed to start task");
    }
  };

  return (
    <TaskStartSheet
      isOpen
      taskTitle={task.title}
      photoUrl={photoUrl}
      isUploading={isUploading}
      uploadProgress={uploadProgress}
      isStarting={isStarting}
      onClose={onClose}
      onPhotoUpload={handlePhotoUpload}
      onStart={handleStart}
    />
  );
};

type TasksTableProps = {
  tableState: TableUrlState;
  onSetTableState: OnSetTableState;
  activeTab?: TaskTab;
};

export const TasksTable = ({ tableState, onSetTableState, activeTab = "all" }: TasksTableProps) => {
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
  } = useTasksData(tableState, activeTab);

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

  const navigate = useNavigate();
  const [startTask, setStartTask] = useState<Task | null>(null);
  // Radix Select fires onValueChange during pointerup. The click event fires after,
  // still in the same browser task. Setting this ref synchronously in onRequestStart
  // ensures handleRowClick sees it before the click lands.
  const suppressRowClickRef = useRef(false);

  const columns = useTaskColumns({
    canManage,
    canDelete,
    isTechnician,
    currentUserId,
    onEdit: openEdit,
    onDelete: openDelete,
    onRequestStart: (task) => {
      suppressRowClickRef.current = true;
      setStartTask(task);
    },
  });

  const handleRowClick = (task: Task) => {
    if (suppressRowClickRef.current) {
      suppressRowClickRef.current = false;
      return;
    }
    navigate({ to: "/tasks/$taskId", params: { taskId: task.id } });
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
        enableRowSelection
        actions={
          canManage ? (
            <Button onClick={openAdd} disabled={isError}>
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
        onRowClick={handleRowClick}
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
      {startTask && (
        <TaskStartSheetContainer
          key={startTask.id}
          task={startTask}
          onClose={() => setStartTask(null)}
        />
      )}
    </>
  );
};
