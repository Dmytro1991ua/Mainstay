import { Mail } from "lucide-react";

import { UserAvailabilityBadge } from "@/features/users/components/UserAvailabilityBadge";
import type { UserAvailability } from "@/features/users/config";
import type { ComboboxOption } from "@/shared/ui/combobox";
import { InfiniteCombobox, toComboboxOption } from "@/shared/ui/combobox";
import { FormField } from "@/shared/ui/form-field";
import { getEditState } from "@/shared/utils";

import type { SheetMode } from "../types";
import type { TaskFormValues } from "../validation";
import type { FieldError, ControllerRenderProps } from "react-hook-form";

export type AssigneeOption = ComboboxOption & { availability?: UserAvailability | null };

type AssigneeFieldProps = {
  field: ControllerRenderProps<TaskFormValues, "assignedTo">;
  error: FieldError | undefined;
  sheetMode: SheetMode | null;
  isAdd: boolean;
  options: AssigneeOption[];
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
  const editTask = getEditState(sheetMode)?.task;
  const willNotify = !!field.value && (isAdd || field.value !== editTask?.assignedTo);
  const selectedOption = toComboboxOption(editTask?.assignee, (u) => u.userName);

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
        selectedOption={selectedOption}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        placeholder="Select assignee"
        disabled={!canManage}
        renderOption={(opt) => (
          <span className="flex w-full items-center justify-between gap-2">
            <span>{opt.label}</span>
            <UserAvailabilityBadge availability={(opt as AssigneeOption).availability ?? null} />
          </span>
        )}
      />
    </FormField>
  );
};
