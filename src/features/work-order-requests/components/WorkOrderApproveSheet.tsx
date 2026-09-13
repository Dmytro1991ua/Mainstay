import { Controller } from "react-hook-form";

import { useUsersList } from "@/features/tasks/hooks/use-users-list";
import { InfiniteCombobox } from "@/shared/ui/combobox";
import { ControlledDatePicker } from "@/shared/ui/date-picker";
import { FormField } from "@/shared/ui/form-field";
import { FormSheet, FormSheetFooter } from "@/shared/ui/sheet";

import type { WorkOrderApproveValues } from "../validation";
import type * as React from "react";
import type { UseFormReturn } from "react-hook-form";

type WorkOrderApproveSheetProps = {
  open: boolean;
  form: UseFormReturn<WorkOrderApproveValues>;
  onSave: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
};

export const WorkOrderApproveSheet = ({
  open,
  form,
  onSave,
  onClose,
  isSaving,
}: WorkOrderApproveSheetProps) => {
  const { control, clearErrors } = form;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useUsersList();

  const assigneeOptions =
    data?.pages.flatMap((p) => p.data).map((u) => ({ value: u.id, label: u.userName })) ?? [];

  return (
    <FormSheet
      title="Approve request"
      open={open}
      onClose={onClose}
      footer={
        <FormSheetFooter onSave={onSave} isSaving={isSaving} saveLabel="Approve & create task" />
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-text-2">
          Approving creates a task from this request. Optionally assign it and set a due date now.
        </p>
        <Controller
          name="assignedTo"
          control={control}
          render={({ field }) => (
            <FormField id="approve-assignee" label="Assign to">
              <InfiniteCombobox
                value={field.value}
                onValueChange={field.onChange}
                options={assigneeOptions}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                placeholder="Leave unassigned"
                clearable
              />
            </FormField>
          )}
        />
        <ControlledDatePicker
          name="dueDate"
          control={control}
          label="Due date"
          placeholder="Pick a due date (optional)"
          disablePast
          clearErrors={clearErrors}
        />
      </div>
    </FormSheet>
  );
};
