import { PowerOff } from "lucide-react";
import { Controller } from "react-hook-form";

import { FormDialog } from "@/shared/ui/dialog";
import { FormField } from "@/shared/ui/form-field";
import { Select } from "@/shared/ui/select";

import { DOWNTIME_REASON_OPTIONS } from "../config";

import type { StartDowntimeFormValues } from "../validation";
import type * as React from "react";
import type { UseFormReturn } from "react-hook-form";

type StartDowntimeDialogProps = {
  open: boolean;
  form: UseFormReturn<StartDowntimeFormValues>;
  onSave: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
};

export const StartDowntimeDialog = ({
  open,
  form,
  onSave,
  onClose,
  isSaving,
}: StartDowntimeDialogProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={onSave}
      icon={<PowerOff className="size-5 text-red" />}
      title="Record downtime"
      description="The asset will be marked as down."
      submitLabel="Record downtime"
      savingLabel="Recording…"
      submitVariant="destructive"
      isSaving={isSaving}
    >
      <Controller
        name="reason"
        control={control}
        render={({ field }) => (
          <FormField id="downtime-reason" label="Reason">
            <Select
              options={DOWNTIME_REASON_OPTIONS}
              value={field.value}
              onValueChange={field.onChange}
            />
          </FormField>
        )}
      />
      <FormField
        id="downtime-started-at"
        label="Started"
        type="datetime-local"
        registration={register("startedAt")}
        error={errors.startedAt}
        disabled={isSaving}
        hint="Leave empty for now."
      />
      <FormField
        id="downtime-note"
        label="Note"
        placeholder="Optional, e.g. compressor tripped"
        registration={register("note")}
        error={errors.note}
        disabled={isSaving}
      />
    </FormDialog>
  );
};
