import { Save } from "lucide-react";

import { useIsDemoAccount } from "@/shared/hooks/use-is-demo-account";
import { useAuthStore } from "@/shared/stores/auth-store";
import { FormField } from "@/shared/ui/form-field";

import { PROFILE_EDIT_FIELDS } from "../config";
import { useUpdateProfile, type ProfileFormValues } from "../hooks/use-update-profile";

import { SettingCard } from "./SettingCard";

export const ProfileEditCard = () => {
  const email = useAuthStore((s) => s.user?.email);
  const isDemo = useIsDemoAccount();

  const { form, onSubmit, isPending } = useUpdateProfile();

  const {
    register,
    formState: { errors, isDirty },
  } = form;

  return (
    <SettingCard>
      <h3 className="mb-4 text-[14px] font-semibold">Account details</h3>
      <form onSubmit={onSubmit} className="flex flex-1 flex-col">
        {PROFILE_EDIT_FIELDS.map((field) =>
          field.readOnly ? (
            <FormField
              key={field.name}
              id={`profile-${field.name}`}
              label={field.label}
              type={field.type}
              autoComplete={field.autoComplete}
              value={field.name === "email" ? email : undefined}
              disabled
            />
          ) : (
            <FormField
              key={field.name}
              id={`profile-${field.name}`}
              label={field.label}
              type={field.type}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              error={errors[field.name as keyof ProfileFormValues]}
              registration={register(field.name as keyof ProfileFormValues)}
              disabled={isDemo}
            />
          ),
        )}
        <div className="mt-auto flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={!isDirty || isPending || isDemo}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-accent px-3.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Save className="size-3.5" />
            {isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </SettingCard>
  );
};
