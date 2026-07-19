import { format } from "date-fns";
import { Controller } from "react-hook-form";

import { FormField } from "@/shared/ui/form-field";

import { DatePicker } from "./DatePicker";
import { parseDateString } from "./utils";

import type { Control, FieldError, FieldValues, Path, UseFormClearErrors } from "react-hook-form";

type ControlledDatePickerProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  error?: FieldError;
  disablePast?: boolean;
  clearErrors?: UseFormClearErrors<T>;
};

export const ControlledDatePicker = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  disabled,
  error,
  disablePast,
  clearErrors,
}: ControlledDatePickerProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => {
      const dateValue = field.value ? parseDateString(field.value) : undefined;

      const handleSelect = (date: Date | undefined) => {
        field.onChange(date ? format(date, "yyyy-MM-dd") : "");
        clearErrors?.(name);
      };

      return (
        <FormField label={label} error={error}>
          <DatePicker
            mode="single"
            selected={dateValue}
            onSelect={handleSelect}
            placeholder={placeholder}
            disabled={disabled}
            error={!!error}
            disablePast={disablePast}
          />
        </FormField>
      );
    }}
  />
);
