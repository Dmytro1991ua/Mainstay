import { Controller } from "react-hook-form";

import { useUsersList } from "@/features/tasks/hooks/use-users-list";
import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/stores/auth-store";
import { InfiniteCombobox } from "@/shared/ui/combobox";
import { ControlledDatePicker } from "@/shared/ui/date-picker";
import { FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { FormSheet, FormSheetFooter } from "@/shared/ui/sheet";

import { SCHEDULE_CATEGORY_OPTIONS, SCHEDULE_PRIORITY_OPTIONS } from "../config";

import type { SheetMode } from "../types";
import type { RecurringTaskFormValues } from "../validation";
import type * as React from "react";
import type { UseFormReturn } from "react-hook-form";

type RecurringTaskFormSheetProps = {
  sheetMode: SheetMode | null;
  form: UseFormReturn<RecurringTaskFormValues>;
  onSave: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
};

export const RecurringTaskFormSheet = ({
  sheetMode,
  form,
  onSave,
  onClose,
  isSaving,
}: RecurringTaskFormSheetProps) => {
  const {
    register,
    control,
    clearErrors,
    formState: { errors },
  } = form;

  const currentUserId = useAuthStore((s) => s.user?.id);

  const { data: usersData, fetchNextPage, hasNextPage, isFetchingNextPage } = useUsersList();

  const isAdd = sheetMode?.type === "add";

  const assigneeOptions =
    usersData?.pages
      .flatMap((p) => p.data)
      .filter((u) => u.id !== currentUserId)
      .map((u) => ({ value: u.id, label: u.userName })) ?? [];

  return (
    <FormSheet
      title={isAdd ? "New schedule" : "Edit schedule"}
      open={sheetMode !== null}
      onClose={onClose}
      footer={
        <FormSheetFooter
          onSave={onSave}
          isSaving={isSaving}
          saveLabel={isAdd ? "Create schedule" : "Save changes"}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <FormField
          id="schedule-title"
          label="Title"
          placeholder="e.g. Monthly HVAC filter replacement"
          registration={register("title")}
          error={errors.title}
        />
        <FormField id="schedule-description" label="Description" error={errors.description}>
          <textarea
            id="schedule-description"
            {...register("description")}
            placeholder="Optional notes or context…"
            rows={3}
            className={cn(
              "w-full resize-none rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm text-text transition-colors placeholder:text-muted-foreground outline-none",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              "disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
              "dark:bg-input/30 dark:disabled:bg-input/80",
            )}
          />
        </FormField>
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <FormField id="schedule-priority" label="Priority">
              <Select
                options={SCHEDULE_PRIORITY_OPTIONS}
                value={field.value}
                onValueChange={field.onChange}
              />
            </FormField>
          )}
        />
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <FormField id="schedule-category" label="Category">
              <Select
                options={SCHEDULE_CATEGORY_OPTIONS}
                value={field.value ?? ""}
                onValueChange={field.onChange}
                placeholder="Select a category"
              />
            </FormField>
          )}
        />
        <Controller
          name="assignedTo"
          control={control}
          render={({ field }) => (
            <FormField id="schedule-assignee" label="Default assignee">
              <InfiniteCombobox
                value={field.value ?? ""}
                onValueChange={field.onChange}
                options={assigneeOptions}
                placeholder="Select assignee"
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage ?? false}
                isFetchingNextPage={isFetchingNextPage}
              />
            </FormField>
          )}
        />
        <FormField id="schedule-interval" label="Repeat every (days)" error={errors.intervalDays}>
          <Input
            id="schedule-interval"
            type="number"
            min={1}
            placeholder="e.g. 30"
            aria-invalid={!!errors.intervalDays}
            {...register("intervalDays", { valueAsNumber: true })}
          />
        </FormField>
        <ControlledDatePicker
          name="nextDueAt"
          control={control}
          label={isAdd ? "First due date" : "Next due date"}
          placeholder="Pick a date"
          error={errors.nextDueAt}
          disablePast={isAdd}
          clearErrors={clearErrors}
        />
      </div>
    </FormSheet>
  );
};
