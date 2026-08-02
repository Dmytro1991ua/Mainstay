import { getApiErrorMessage } from "@/shared/lib/api-error";
import { cn } from "@/shared/lib/utils";
import { Alert } from "@/shared/ui/alert";
import { FieldGroup } from "@/shared/ui/field";
import { FormField } from "@/shared/ui/form-field";
import { FormSubmit } from "@/shared/ui/form-submit";

import { useLoginForm } from "../hooks/use-login-form";

import { DEMO_ACCOUNTS, LOGIN_FORM_FIELDS } from "./configs";

export const LoginForm = () => {
  const { register, onSubmit, errors, isPending, isError, error, fillDemo } = useLoginForm();

  return (
    <>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isError ? "mb-4 max-h-20 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <Alert variant="error">{getApiErrorMessage(error)}</Alert>
      </div>
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
          <FormSubmit isPending={isPending} label="Sign in" pendingLabel="Signing in…" />
        </FieldGroup>
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-center text-[12px] text-text-3">Try a demo account</p>
          <div className="flex gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.label}
                type="button"
                onClick={() => fillDemo(acc.email, acc.pass)}
                className="flex-1 rounded-lg border border-border-2 bg-panel px-3 py-2 text-[12.5px] font-medium text-text-2 transition-colors hover:border-accent hover:text-accent"
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </>
  );
};
