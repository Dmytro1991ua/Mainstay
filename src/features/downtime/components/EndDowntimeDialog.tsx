import { Power } from "lucide-react";

import { FormDialog } from "@/shared/ui/dialog";
import { FormField } from "@/shared/ui/form-field";

import type { DowntimeEvent } from "../api/downtime.api";
import type { EndDowntimeFormValues } from "../validation";
import type * as React from "react";
import type { UseFormReturn } from "react-hook-form";

type EndDowntimeDialogProps = {
  target: DowntimeEvent | null;
  form: UseFormReturn<EndDowntimeFormValues>;
  onSave: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
};

export const EndDowntimeDialog = ({
  target,
  form,
  onSave,
  onClose,
  isSaving,
}: EndDowntimeDialogProps) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <FormDialog
      open={target !== null}
      onClose={onClose}
      onSubmit={onSave}
      icon={<Power className="size-5 text-accent" />}
      title="Back in service"
      description="The asset will be marked as operational."
      submitLabel="Back in service"
      savingLabel="Saving…"
      isSaving={isSaving}
    >
      <FormField
        id="downtime-ended-at"
        label="Back in service at"
        type="datetime-local"
        registration={register("endedAt")}
        error={errors.endedAt}
        disabled={isSaving}
        hint="Leave empty for now."
      />
    </FormDialog>
  );
};
