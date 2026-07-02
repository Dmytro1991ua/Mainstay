import { FieldGroup } from "@/shared/ui/field";
import { FormField } from "@/shared/ui/form-field";
import { FormSubmit } from "@/shared/ui/form-submit";

import { useLoginForm } from "../hooks/use-login-form";

import { LOGIN_FORM_FIELDS } from "./configs";

export const LoginForm = () => {
  const { register, onSubmit, errors, isPending, isError, error } = useLoginForm();

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup className="gap-3">
        {LOGIN_FORM_FIELDS.map((field) => (
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
          label="Sign in"
          pendingLabel="Signing in…"
        />
      </FieldGroup>
    </form>
  );
};
