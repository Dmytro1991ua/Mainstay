import { Controller } from "react-hook-form";

import { FormField } from "@/shared/ui/form-field";
import { Select } from "@/shared/ui/select";
import { FormSheet, FormSheetFooter } from "@/shared/ui/sheet";

import type { InviteUserFormValues } from "../validation";
import type { UseFormReturn } from "react-hook-form";

const INVITE_ROLE_OPTIONS = [
  { value: "MANAGER", label: "Manager" },
  { value: "TECHNICIAN", label: "Technician" },
];

type InviteUserSheetProps = {
  open: boolean;
  form: UseFormReturn<InviteUserFormValues>;
  onSave: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
};

export const InviteUserSheet = ({
  open,
  form,
  onSave,
  onClose,
  isSaving,
}: InviteUserSheetProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <FormSheet
      title="Invite user"
      open={open}
      onClose={onClose}
      footer={<FormSheetFooter onSave={onSave} isSaving={isSaving} saveLabel="Send invite" />}
    >
      <div className="flex flex-col gap-4">
        <FormField
          id="invite-email"
          label="Email"
          type="email"
          placeholder="e.g. john@example.com"
          autoComplete="off"
          registration={register("email")}
          error={errors.email}
        />
        <FormField id="invite-role" label="Role" error={errors.role}>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                options={INVITE_ROLE_OPTIONS}
                value={field.value}
                onValueChange={field.onChange}
                error={!!errors.role}
              />
            )}
          />
        </FormField>
      </div>
    </FormSheet>
  );
};
