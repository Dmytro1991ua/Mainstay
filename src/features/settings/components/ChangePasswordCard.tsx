import { Save } from "lucide-react";

import { useIsDemoAccount } from "@/shared/hooks/use-is-demo-account";
import { FormField } from "@/shared/ui/form-field";
import { PasswordInput } from "@/shared/ui/password-input";

import { CHANGE_PASSWORD_FIELDS } from "../config";
import { useChangePassword } from "../hooks/use-change-password";

import { SettingCard } from "./SettingCard";

export const ChangePasswordCard = () => {
  const isDemo = useIsDemoAccount();

  const { form, onSubmit, isPending } = useChangePassword();
  const {
    register,
    formState: { errors, isDirty },
  } = form;

  return (
    <SettingCard>
      <h3 className="mb-4 text-[14px] font-semibold">Change password</h3>
      <form onSubmit={onSubmit} className="flex flex-1 flex-col">
        {CHANGE_PASSWORD_FIELDS.map((field) => (
          <FormField key={field.name} label={field.label} error={errors[field.name]}>
            <PasswordInput
              id={field.id}
              placeholder={field.placeholder}
              registration={register(field.name)}
              disabled={isDemo}
            />
          </FormField>
        ))}
        <div className="mt-auto flex items-center justify-between gap-4">
          <p className="text-[11px] text-text-3">
            All active sessions will be signed out after changing your password.
          </p>
          <button
            type="submit"
            disabled={!isDirty || isPending || isDemo}
            className="flex shrink-0 h-8 items-center gap-1.5 rounded-lg bg-accent px-3.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Save className="size-3.5" />
            {isPending ? "Saving…" : "Save password"}
          </button>
        </div>
      </form>
    </SettingCard>
  );
};
