import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { Controller } from "react-hook-form";

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
    formState: { control, handleSubmit, reset },
  } = useFormState<TimeEntryFormValues>({
    initialValues: getTimeEntryDefaults(),
    resolver: zodResolver(timeEntryFormSchema),
  });

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
        <Controller
          name="hours"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              id="time-hours"
              label="Hours"
              inputMode="numeric"
              placeholder="0"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error}
              disabled={isSubmitting}
            />
          )}
        />
        <Controller
          name="minutes"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              id="time-minutes"
              label="Minutes"
              inputMode="numeric"
              placeholder="0"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error}
              disabled={isSubmitting}
            />
          )}
        />
        <Controller
          name="workedOn"
          control={control}
          render={({ field, fieldState }) => (
            <FormField id="time-worked-on" label="Date" error={fieldState.error}>
              <Input
                id="time-worked-on"
                type="date"
                value={field.value}
                onChange={field.onChange}
                aria-invalid={!!fieldState.error}
                disabled={isSubmitting}
              />
            </FormField>
          )}
        />
      </div>
      <Controller
        name="note"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            id="time-note"
            label="Note"
            placeholder="Optional"
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error}
            disabled={isSubmitting}
          />
        )}
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
