import { Controller } from "react-hook-form";

import { useAssetsQuery } from "@/features/assets";
import { TASK_CATEGORY_OPTIONS, TASK_PRIORITY_OPTIONS } from "@/features/tasks/config";
import { cn } from "@/shared/lib/utils";
import { InfiniteCombobox } from "@/shared/ui/combobox";
import { FormField } from "@/shared/ui/form-field";
import { Select } from "@/shared/ui/select";
import { FormSheet, FormSheetFooter } from "@/shared/ui/sheet";

import type { WorkOrderRequestFormValues } from "../validation";
import type * as React from "react";
import type { UseFormReturn } from "react-hook-form";

type WorkOrderRequestFormSheetProps = {
  open: boolean;
  form: UseFormReturn<WorkOrderRequestFormValues>;
  onSave: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
};

export const WorkOrderRequestFormSheet = ({
  open,
  form,
  onSave,
  onClose,
  isSaving,
}: WorkOrderRequestFormSheetProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const {
    data: assetsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAssetsQuery({ limit: 20, sortBy: "name", sortOrder: "asc" });

  const assetOptions =
    assetsData?.pages
      .flatMap((p) => p.data)
      .map((a) => ({ value: a.id, label: a.name, meta: { serialNumber: a.serialNumber } })) ?? [];

  return (
    <FormSheet
      title="New request"
      open={open}
      onClose={onClose}
      footer={<FormSheetFooter onSave={onSave} isSaving={isSaving} saveLabel="Submit request" />}
    >
      <div className="flex flex-col gap-4">
        <FormField
          id="wor-title"
          label="Title"
          placeholder="e.g. AC in Room 204 is leaking"
          registration={register("title")}
          error={errors.title}
        />
        <FormField id="wor-description" label="Description" error={errors.description}>
          <textarea
            id="wor-description"
            {...register("description")}
            placeholder="Describe the problem or request…"
            rows={3}
            className={cn(
              "w-full resize-none rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm text-text transition-colors placeholder:text-muted-foreground outline-none",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              "dark:bg-input/30",
            )}
          />
        </FormField>
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <FormField id="wor-priority" label="Priority">
              <Select
                options={TASK_PRIORITY_OPTIONS}
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
            <FormField id="wor-category" label="Category">
              <Select
                options={TASK_CATEGORY_OPTIONS}
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Select a category (optional)"
              />
            </FormField>
          )}
        />
        <Controller
          name="assetId"
          control={control}
          render={({ field }) => (
            <FormField id="wor-asset" label="Asset">
              <InfiniteCombobox
                value={field.value}
                onValueChange={field.onChange}
                options={assetOptions}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                placeholder="Link an asset (optional)"
                clearable
                renderOption={(opt) => (
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="truncate">{opt.label}</span>
                    {opt.meta?.serialNumber ? (
                      <span className="shrink-0 font-mono text-xs text-text-3">
                        {String(opt.meta.serialNumber)}
                      </span>
                    ) : null}
                  </span>
                )}
              />
            </FormField>
          )}
        />
      </div>
    </FormSheet>
  );
};
