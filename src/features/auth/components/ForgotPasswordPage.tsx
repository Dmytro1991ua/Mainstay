import { CheckCircle2 } from "lucide-react";

import { FieldGroup } from "@/shared/ui/field";
import { FormField } from "@/shared/ui/form-field";
import { FormSubmit } from "@/shared/ui/form-submit";

import { useForgotPassword } from "../hooks/use-forgot-password";

import { AuthCard } from "./AuthCard";
import { FORGOT_PASSWORD_FIELDS } from "./configs";

export const ForgotPasswordPage = () => {
  const { form, onSubmit, isPending, isSuccess } = useForgotPassword();

  const {
    register,
    formState: { errors },
  } = form;

  if (isSuccess) {
    return (
      <AuthCard
        title="Check your email"
        subtitle="If an account with that email exists, we've sent a reset link. It expires in 1 hour."
        footerText="Back to "
        footerLinkText="Sign in"
        footerLinkTo="/login"
      >
        <div className="flex justify-center py-8">
          <CheckCircle2 className="size-16 text-green" strokeWidth={1.5} />
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset link."
      footerText="Remember it? "
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      <form onSubmit={onSubmit}>
        <FieldGroup className="gap-3">
          {FORGOT_PASSWORD_FIELDS.map((field) => (
            <FormField
              key={field.name}
              id={field.name}
              label={field.label}
              type={field.type}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              registration={register(field.name)}
              error={errors[field.name]}
            />
          ))}
          <FormSubmit isPending={isPending} label="Send reset link" pendingLabel="Sending…" />
        </FieldGroup>
      </form>
    </AuthCard>
  );
};
