import { type FieldError as RHFFieldError, type UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import type * as React from "react";

type FormFieldProps = {
  label: string;
  id?: string;
  error?: RHFFieldError | string;
  hint?: string;
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
  hint,
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
    <div className="relative flex flex-col gap-1.5 pb-4">
      <Label htmlFor={id} className={cn(errorMessage && "text-red")}>
        {label}
      </Label>
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
      {errorMessage && (
        <p className="absolute bottom-0 left-0 text-xs leading-none text-red">{errorMessage}</p>
      )}
      {!errorMessage && hint && (
        <p className="absolute bottom-0 left-0 text-xs leading-none text-text-3">{hint}</p>
      )}
    </div>
  );
};
