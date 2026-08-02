import { CheckCircle2 } from "lucide-react";

import { FieldGroup } from "@/shared/ui/field";
import { FormField } from "@/shared/ui/form-field";
import { FormSubmit } from "@/shared/ui/form-submit";

import { useAcceptInvite } from "../hooks/use-accept-invite";

import { AuthCard } from "./AuthCard";
import { ACCEPT_INVITE_FIELDS } from "./configs";

type AcceptInvitePageProps = { token: string };

export const AcceptInvitePage = ({ token }: AcceptInvitePageProps) => {
  const { form, onSubmit, isPending, isSuccess, isError, error } = useAcceptInvite(token);

  const {
    register,
    formState: { errors },
  } = form;

  if (isSuccess) {
    return (
      <AuthCard
        title="Account created!"
        subtitle="Your account is ready. Sign in with your new credentials to get started."
        footerText="Ready? "
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
    <AuthCard title="Set up your account" subtitle="Choose a username and password to get started.">
      <form onSubmit={onSubmit}>
        <FieldGroup className="gap-3">
          {ACCEPT_INVITE_FIELDS.map((field) => (
            <FormField
              key={field.name}
              id={field.name}
              label={field.label}
              type={field.type}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              hint={field.hint}
              registration={register(field.name)}
              error={errors[field.name]}
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
    </AuthCard>
  );
};
