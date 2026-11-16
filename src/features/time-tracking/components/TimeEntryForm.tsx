import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";

import { useFormState } from "@/shared/hooks/use-form-state";
import { Button } from "@/shared/ui/button";
import { FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";

import { toTotalMinutes } from "../utils";
import { getTimeEntryDefaults, timeEntryFormSchema, type TimeEntryFormValues } from "../validation";

import type { CreateTimeEntryInput } from "../api/time-entries.api";

type TimeEntryFormProps = {
  isSubmitting: boolean;
  /** Resolves true when the entry was saved; false keeps the fields for a retry. */
  onSubmit: (data: CreateTimeEntryInput) => Promise<boolean>;
};

export const TimeEntryForm = ({ isSubmitting, onSubmit }: TimeEntryFormProps) => {
  const {
    formState: { register, handleSubmit, reset, formState },
  } = useFormState<TimeEntryFormValues>({
    initialValues: getTimeEntryDefaults(),
    resolver: zodResolver(timeEntryFormSchema),
  });
  const { errors } = formState;

  const save = handleSubmit(async ({ hours, minutes, workedOn, note }) => {
    const saved = await onSubmit({
      minutes: toTotalMinutes(hours, minutes),
      workedOn,
      note: note || undefined,
    });

    if (saved) reset(getTimeEntryDefaults());
  });

  return (
    <form onSubmit={save} noValidate className="flex flex-col gap-1">
      <div className="grid grid-cols-3 gap-3">
        <FormField
          id="time-hours"
          label="Hours"
          inputMode="numeric"
          placeholder="0"
          registration={register("hours")}
          error={errors.hours}
          disabled={isSubmitting}
        />
        <FormField
          id="time-minutes"
          label="Minutes"
          inputMode="numeric"
          placeholder="0"
          registration={register("minutes")}
          error={errors.minutes}
          disabled={isSubmitting}
        />
        <FormField id="time-worked-on" label="Date" error={errors.workedOn}>
          <Input
            id="time-worked-on"
            type="date"
            aria-invalid={!!errors.workedOn}
            disabled={isSubmitting}
            {...register("workedOn")}
          />
        </FormField>
      </div>
      <FormField
        id="time-note"
        label="Note"
        placeholder="Optional"
        registration={register("note")}
        error={errors.note}
        disabled={isSubmitting}
      />
      <Button type="submit" size="sm" className="self-end" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Plus className="size-3.5" />
        )}
        Log time
      </Button>
    </form>
  );
};
