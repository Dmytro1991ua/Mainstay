import { FieldGroup } from "@/shared/ui/field";
import { FormField } from "@/shared/ui/form-field";
import { FormSubmit } from "@/shared/ui/form-submit";

import { useRegisterForm } from "../hooks/use-register-form";

import { REGISTER_FORM_FIELDS } from "./configs";

export const RegisterForm = () => {
  const { register, onSubmit, errors, isPending, isError, error } = useRegisterForm();

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup className="gap-3">
        {REGISTER_FORM_FIELDS.map((field) => (
          <FormField
            key={field.name}
            id={field.name}
            label={field.label}
            type={field.type}
            autoComplete={field.autoComplete}
            placeholder={field.placeholder}
            error={errors[field.name]}
            registration={register(field.name)}
          />
        ))}
        <FormSubmit
          isPending={isPending}
          isError={isError}
          error={error}
          label="Create account"
          pendingLabel="Creating account…"
        />
      </FieldGroup>
    </form>
  );
};
