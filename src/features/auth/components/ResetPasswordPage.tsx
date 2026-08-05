import { FieldGroup } from "@/shared/ui/field";
import { FormField } from "@/shared/ui/form-field";
import { FormSubmit } from "@/shared/ui/form-submit";

import { useResetPassword } from "../hooks/use-reset-password";

import { AuthCard } from "./AuthCard";
import { RESET_PASSWORD_FIELDS } from "./configs";

type ResetPasswordPageProps = { token: string };

export const ResetPasswordPage = ({ token }: ResetPasswordPageProps) => {
  const { form, onSubmit, isPending } = useResetPassword(token);

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter a new password for your account."
      footerText="Back to "
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      <form onSubmit={onSubmit}>
        <FieldGroup className="gap-3">
          {RESET_PASSWORD_FIELDS.map((field) => (
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
          <FormSubmit isPending={isPending} label="Reset password" pendingLabel="Resetting…" />
        </FieldGroup>
      </form>
    </AuthCard>
  );
};
