import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { useFormState } from "@/shared/hooks/use-form-state";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/ui/toast";

import { toUpdateSchedulePayload, isMeterSchedule } from "../utils";
import {
  RECURRING_TASK_FORM_DEFAULTS,
  recurringTaskFormSchema,
  type RecurringTaskFormValues,
} from "../validation";

import { useCreateRecurringTask, useUpdateRecurringTask } from "./use-recurring-tasks";

import type {
  CreateRecurringTaskInput,
  RecurringTask,
  RecurringTaskCategory,
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
      // Meter schedules have no day interval or due date, and their meter fields are read-only.
      triggerType: isMeterSchedule(schedule) ? "METER" : "TIME",
      intervalDays: schedule.intervalDays ?? RECURRING_TASK_FORM_DEFAULTS.intervalDays,
      nextDueAt: schedule.nextDueAt?.split("T")[0] ?? "",
      meterId: schedule.meterId ?? "",
      intervalReading: schedule.intervalReading?.toString() ?? "",
      firstDueReading: "",
    });

    setSheetMode({ type: "edit", schedule });
  };

  const buildCreateInput = (values: RecurringTaskFormValues): CreateRecurringTaskInput => {
    const common = {
      title: values.title,
      description: values.description || undefined,
      assignedTo: values.assignedTo || undefined,
      priority: values.priority,
      category: (values.category as RecurringTaskCategory) || undefined,
    };

    if (values.triggerType === "METER") {
      return {
        ...common,
        meterId: values.meterId,
        intervalReading: Number(values.intervalReading),
        firstDueReading: values.firstDueReading ? Number(values.firstDueReading) : undefined,
      };
    }

    return {
      ...common,
      intervalDays: values.intervalDays,
      firstDueAt: new Date(values.nextDueAt).toISOString(),
    };
  };

  const saveAdd = async (values: RecurringTaskFormValues) => {
    try {
      await createMutation.mutateAsync(buildCreateInput(values));

      toast.success("Schedule created", {
        description:
          values.triggerType === "METER"
            ? `"${values.title}" will create a task every ${values.intervalReading} units.`
            : `"${values.title}" will run every ${values.intervalDays} day(s).`,
      });

      closeSheet();
    } catch (error) {
      toast.error("Failed to create schedule", { description: getApiErrorMessage(error) });
    }
  };

  const saveEdit = async (values: RecurringTaskFormValues, id: string) => {
    try {
      const update = toUpdateSchedulePayload(values);
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
