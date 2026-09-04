import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { useFormState } from "@/shared/hooks/use-form-state";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import {
  RECURRING_TASK_FORM_DEFAULTS,
  recurringTaskFormSchema,
  type RecurringTaskFormValues,
} from "../validation";

import { useCreateRecurringTask, useUpdateRecurringTask } from "./use-recurring-tasks";

import type {
  RecurringTask,
  RecurringTaskCategory,
  UpdateRecurringTaskInput,
} from "../api/recurring-tasks.api";
import type { SheetMode } from "../types";

export const useRecurringTaskForm = () => {
  const createMutation = useCreateRecurringTask();
  const updateMutation = useUpdateRecurringTask();

  const [sheetMode, setSheetMode] = useState<SheetMode | null>(null);

  const closeModal = () => setSheetMode(null);

  const { formState: form, onReset: closeSheet } = useFormState({
    initialValues: RECURRING_TASK_FORM_DEFAULTS,
    resolver: zodResolver(recurringTaskFormSchema),
    onCloseModal: closeModal,
  });

  const openAdd = () => {
    form.reset(RECURRING_TASK_FORM_DEFAULTS);
    setSheetMode({ type: "add" });
  };

  const openEdit = (schedule: RecurringTask) => {
    form.reset({
      title: schedule.title,
      description: schedule.description ?? "",
      assignedTo: schedule.assignedTo ?? "",
      priority: schedule.priority,
      category: schedule.category ?? "",
      intervalDays: schedule.intervalDays,
      nextDueAt: schedule.nextDueAt.split("T")[0],
    });

    setSheetMode({ type: "edit", schedule });
  };

  const saveAdd = async (values: RecurringTaskFormValues) => {
    try {
      await createMutation.mutateAsync({
        title: values.title,
        description: values.description || undefined,
        assignedTo: values.assignedTo || undefined,
        priority: values.priority,
        category: (values.category as RecurringTaskCategory) || undefined,
        intervalDays: values.intervalDays,
        firstDueAt: new Date(values.nextDueAt).toISOString(),
      });

      toast.success("Schedule created", {
        description: `"${values.title}" will run every ${values.intervalDays} day(s).`,
      });

      closeSheet();
    } catch (error) {
      toast.error("Failed to create schedule", { description: getApiErrorMessage(error) });
    }
  };

  const saveEdit = async (values: RecurringTaskFormValues, id: string) => {
    try {
      // The server derives the next due date from intervalDays; update no longer accepts a date.
      const update: UpdateRecurringTaskInput = {
        title: values.title,
        description: values.description || undefined,
        assignedTo: values.assignedTo || null,
        priority: values.priority,
        category: (values.category as RecurringTaskCategory) || undefined,
        intervalDays: values.intervalDays,
      };
      await updateMutation.mutateAsync({ id, data: update });
      toast.success("Schedule updated", { description: `"${values.title}" was saved.` });
      closeSheet();
    } catch (error) {
      toast.error("Failed to update schedule", { description: getApiErrorMessage(error) });
    }
  };

  const handleSave = form.handleSubmit(async (values) => {
    if (!sheetMode) return;
    if (sheetMode.type === "add") await saveAdd(values);
    else await saveEdit(values, sheetMode.schedule.id);
  });

  return {
    sheetMode,
    form,
    openAdd,
    openEdit,
    closeSheet,
    handleSave,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
};
