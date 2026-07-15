import { type FieldError as RHFFieldError, type UseFormRegisterReturn } from "react-hook-form";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import type * as React from "react";

type FormFieldProps = {
  label: string;
  id?: string;
  error?: RHFFieldError | string;
  /** Render any custom control (Select, Checkbox, etc.) instead of the default Input */
  children?: React.ReactNode;
  // Input-specific — ignored when children is provided
  type?: string;
  placeholder?: string;
  inputClassName?: string;
  autoComplete?: string;
  disabled?: boolean;
  // Controlled mode
  value?: string;
  onChange?: (value: string) => void;
  // RHF mode
  registration?: UseFormRegisterReturn;
};

export const FormField = ({
  label,
  id,
  error,
  children,
  type,
  placeholder,
  inputClassName,
  autoComplete,
  disabled,
  value,
  onChange,
  registration,
}: FormFieldProps) => {
  const errorMessage = typeof error === "string" ? error : error?.message;

  const inputProps = registration
    ? { ...registration }
    : {
        value,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value),
      };

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children ?? (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className={inputClassName}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          disabled={disabled}
          {...inputProps}
        />
      )}
      {errorMessage && <p className="text-xs text-red">{errorMessage}</p>}
    </div>
  );
};
