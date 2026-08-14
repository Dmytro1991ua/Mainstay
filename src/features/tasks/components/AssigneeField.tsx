import { Mail } from "lucide-react";

import { InfiniteCombobox } from "@/shared/ui/combobox";
import { FormField } from "@/shared/ui/form-field";

import type { SheetMode } from "../types";
import type { TaskFormValues } from "../validation";
import type { FieldError, ControllerRenderProps } from "react-hook-form";

type AssigneeFieldProps = {
  field: ControllerRenderProps<TaskFormValues, "assignedTo">;
  error: FieldError | undefined;
  sheetMode: SheetMode | null;
  isAdd: boolean;
  options: { value: string; label: string }[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  canManage: boolean;
};

export const AssigneeField = ({
  field,
  error,
  sheetMode,
  isAdd,
  options,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  canManage,
}: AssigneeFieldProps) => {
  const originalAssigneeId = sheetMode?.type === "edit" ? sheetMode.task.assignedTo : null;
  const willNotify = !!field.value && (isAdd || field.value !== originalAssigneeId);

  return (
    <FormField
      id="task-assignee"
      label="Assigned to"
      error={error}
      hint={
        willNotify ? (
          <span className="flex items-center gap-1">
            <Mail className="size-3 shrink-0" />
            An email notification will be sent to the assignee.
          </span>
        ) : undefined
      }
    >
      <InfiniteCombobox
        value={field.value ?? ""}
        onValueChange={field.onChange}
        options={options}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        placeholder="Select assignee"
        disabled={!canManage}
      />
    </FormField>
  );
};
