import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { useFormState } from "@/shared/hooks/use-form-state";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { useAuthStore } from "@/shared/stores/auth-store";
import { toast } from "@/shared/ui/toast";

import { TASK_FORM_DEFAULTS, taskFormSchema, type TaskFormValues } from "../validation";

import { useCreateTask, useUpdateTask } from "./use-tasks";

import type { Task, UpdateTaskInput } from "../api/tasks.api";
import type { SheetMode } from "../types";

export const useTaskForm = () => {
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const user = useAuthStore((s) => s.user);

  const [sheetMode, setSheetMode] = useState<SheetMode | null>(null);

  const canManage = user?.roles.some((r) => r === "ADMIN" || r === "MANAGER") ?? false;

  const closeModal = () => setSheetMode(null);

  const { formState: form, onReset: closeSheet } = useFormState({
    initialValues: TASK_FORM_DEFAULTS,
    resolver: zodResolver(taskFormSchema),
    onCloseModal: closeModal,
  });

  const openAdd = () => {
    form.reset(TASK_FORM_DEFAULTS);

    setSheetMode({ type: "add" });
  };

  const openEdit = (task: Task) => {
    form.reset({
      title: task.title,
      description: task.description ?? "",
      assignedTo: task.assignedTo ?? "",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      priority: task.priority,
    });

    setSheetMode({ type: "edit", task });
  };

  const handleAssigneeConflict = (error: unknown): boolean => {
    const status = (error as { response?: { status?: number } })?.response?.status;

    if (status === 409) {
      form.setError("assignedTo", { message: getApiErrorMessage(error) });
      return true;
    }

    return false;
  };

  const saveAdd = async (values: TaskFormValues) => {
    try {
      await createMutation.mutateAsync({
        title: values.title,
        description: values.description || undefined,
        assignedTo: values.assignedTo || undefined,
        dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
        priority: values.priority,
      });
      toast.success("Task created", { description: `"${values.title}" was added.` });
      closeSheet();
    } catch (error) {
      if (!handleAssigneeConflict(error)) {
        toast.error("Failed to create task", { description: getApiErrorMessage(error) });
      }
    }
  };

  const saveEdit = async (values: TaskFormValues, id: string) => {
    try {
      const update: UpdateTaskInput = {
        title: values.title,
        description: values.description || undefined,
        assignedTo: values.assignedTo || null,
        dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
        priority: values.priority,
      };
      await updateMutation.mutateAsync({ id, data: update });
      toast.success("Task updated", { description: `"${values.title}" was saved.` });
      closeSheet();
    } catch (error) {
      if (!handleAssigneeConflict(error)) {
        toast.error("Failed to update task", { description: getApiErrorMessage(error) });
      }
    }
  };

  const handleSave = form.handleSubmit(async (values) => {
    if (!sheetMode) return;

    if (sheetMode.type === "add") await saveAdd(values);
    else await saveEdit(values, sheetMode.task.id);
  });

  return {
    sheetMode,
    form,
    canManage,
    openAdd,
    openEdit,
    closeSheet,
    handleSave,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
};
