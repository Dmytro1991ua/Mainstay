import type { ComboboxOption } from "@/shared/ui/combobox";
import { InfiniteCombobox } from "@/shared/ui/combobox";
import { FormField } from "@/shared/ui/form-field";

import type { TaskFormValues } from "../validation";
import type { ControllerRenderProps } from "react-hook-form";

type AssetFieldProps = {
  field: ControllerRenderProps<TaskFormValues, "assetId">;
  options: ComboboxOption[];
  selectedOption?: ComboboxOption;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  disabled: boolean;
};

export const AssetField = ({
  field,
  options,
  selectedOption,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  disabled,
}: AssetFieldProps) => (
  <FormField id="task-asset" label="Asset">
    <InfiniteCombobox
      value={field.value ?? ""}
      onValueChange={field.onChange}
      options={options}
      selectedOption={selectedOption}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      placeholder="Link an asset (optional)"
      disabled={disabled}
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
);
