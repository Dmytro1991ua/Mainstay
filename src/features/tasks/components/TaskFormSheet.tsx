import { Controller } from "react-hook-form";

import { useAssetsQuery } from "@/features/assets";
import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/stores/auth-store";
import { ControlledDatePicker } from "@/shared/ui/date-picker";
import { FormField } from "@/shared/ui/form-field";
import { Select } from "@/shared/ui/select";
import { FormSheet, FormSheetFooter } from "@/shared/ui/sheet";

import { TASK_CATEGORY_OPTIONS, TASK_PRIORITY_OPTIONS } from "../config";
import { useUsersList } from "../hooks/use-users-list";

import { AssetField } from "./AssetField";
import { AssigneeField } from "./AssigneeField";

import type { SheetMode } from "../types";
import type { TaskFormValues } from "../validation";
import type * as React from "react";
import type { UseFormReturn } from "react-hook-form";

type TaskFormSheetProps = {
  sheetMode: SheetMode | null;
  form: UseFormReturn<TaskFormValues>;
  canManage: boolean;
  onSave: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
};

export const TaskFormSheet = ({
  sheetMode,
  form,
  canManage,
  onSave,
  onClose,
  isSaving,
}: TaskFormSheetProps) => {
  const {
    register,
    control,
    clearErrors,
    formState: { errors },
  } = form;

  const isAdd = sheetMode?.type === "add";
  const currentUserId = useAuthStore((s) => s.user?.id);
  const {
    data: usersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUsersList({
    availableOnly: isAdd,
  });

  const assigneeOptions =
    usersData?.pages
      .flatMap((p) => p.data)
      .filter((u) => u.id !== currentUserId)
      .map((u) => ({ value: u.id, label: u.userName, availability: u.availability })) ?? [];

  const {
    data: assetsData,
    fetchNextPage: fetchAssetsNextPage,
    hasNextPage: hasAssetsNextPage,
    isFetchingNextPage: isFetchingAssetsNextPage,
  } = useAssetsQuery({ limit: 20, sortBy: "name", sortOrder: "asc" });

  const assetOptions =
    assetsData?.pages
      .flatMap((p) => p.data)
      .map((a) => ({
        value: a.id,
        label: a.name,
        meta: { serialNumber: a.serialNumber },
      })) ?? [];

  return (
    <FormSheet
      title={isAdd ? "New task" : "Edit task"}
      open={sheetMode !== null}
      onClose={onClose}
      footer={
        <FormSheetFooter
          onSave={onSave}
          isSaving={isSaving}
          saveLabel={isAdd ? "Create task" : "Save changes"}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <FormField
          id="task-title"
          label="Title"
          placeholder="e.g. Replace HVAC rooftop unit air filters"
          registration={register("title")}
          error={errors.title}
          disabled={!canManage}
        />
        <FormField id="task-description" label="Description" error={errors.description}>
          <textarea
            id="task-description"
            {...register("description")}
            placeholder="Optional notes or context…"
            disabled={!canManage}
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
            <FormField id="task-priority" label="Priority">
              <Select
                options={TASK_PRIORITY_OPTIONS}
                value={field.value}
                onValueChange={field.onChange}
                disabled={!canManage}
              />
            </FormField>
          )}
        />
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <FormField id="task-category" label="Category" error={errors.category}>
              <Select
                options={TASK_CATEGORY_OPTIONS}
                value={field.value ?? ""}
                onValueChange={field.onChange}
                placeholder="Select a category"
                disabled={!canManage}
              />
            </FormField>
          )}
        />
        <Controller
          name="assignedTo"
          control={control}
          render={({ field }) => (
            <AssigneeField
              field={field}
              error={errors.assignedTo}
              sheetMode={sheetMode}
              isAdd={isAdd}
              options={assigneeOptions}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              canManage={canManage}
            />
          )}
        />
        <Controller
          name="assetId"
          control={control}
          render={({ field }) => (
            <AssetField
              field={field}
              options={assetOptions}
              fetchNextPage={fetchAssetsNextPage}
              hasNextPage={hasAssetsNextPage}
              isFetchingNextPage={isFetchingAssetsNextPage}
              disabled={!canManage}
            />
          )}
        />
        <ControlledDatePicker
          name="dueDate"
          control={control}
          label="Due date"
          placeholder="Pick a due date"
          disabled={!canManage}
          error={errors.dueDate}
          disablePast={isAdd}
          clearErrors={clearErrors}
        />
      </div>
    </FormSheet>
  );
};
