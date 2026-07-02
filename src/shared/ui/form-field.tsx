import { type FieldError as RHFFieldError, type UseFormRegisterReturn } from "react-hook-form";

import { Field, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

type FormFieldProps = {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  error?: RHFFieldError;
  registration: UseFormRegisterReturn;
};

export const FormField = ({
  id,
  label,
  type,
  autoComplete,
  placeholder,
  error,
  registration,
}: FormFieldProps) => (
  <div className="relative pb-5">
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        {...registration}
      />
    </Field>
    <span className="absolute bottom-0 left-0 text-sm text-destructive">{error?.message}</span>
  </div>
);
