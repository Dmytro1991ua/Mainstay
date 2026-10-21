import { Controller, useWatch } from "react-hook-form";

import { useMetersQuery } from "@/features/meters/hooks/use-meters";
import { flattenPages } from "@/shared/hooks/use-crud";
import { InfiniteCombobox } from "@/shared/ui/combobox";
import { ControlledDatePicker } from "@/shared/ui/date-picker";
import { FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";

import { SCHEDULE_TRIGGER_OPTIONS } from "../config";

import type { RecurringTaskFormValues } from "../validation";
import type { UseFormReturn } from "react-hook-form";

type ScheduleTriggerFieldsProps = {
  form: UseFormReturn<RecurringTaskFormValues>;
  /** The trigger type and first due date are chosen on create; the server fixes them afterwards. */
  isAdd: boolean;
};

/** What makes the schedule fire: a number of days, or a meter reaching a reading. */
export const ScheduleTriggerFields = ({ form, isAdd }: ScheduleTriggerFieldsProps) => {
  const {
    register,
    control,
    clearErrors,
    formState: { errors },
  } = form;

  const triggerType = useWatch({ control, name: "triggerType" });
  const meterId = useWatch({ control, name: "meterId" });
  const isMeter = triggerType === "METER";

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useMetersQuery(
    { limit: 50, sortBy: "name", sortOrder: "asc" },
    { enabled: isMeter },
  );

  const meters = flattenPages(data);
  const meterOptions = meters.map((meter) => ({
    value: meter.id,
    label: `${meter.asset.name} · ${meter.name}`,
  }));
  const selectedMeter = meters.find((meter) => meter.id === meterId);
  const unit = selectedMeter?.unit;

  return (
    <>
      {isAdd && (
        <Controller
          name="triggerType"
          control={control}
          render={({ field }) => (
            <FormField id="schedule-trigger" label="Repeat by">
              <Select
                options={SCHEDULE_TRIGGER_OPTIONS}
                value={field.value}
                onValueChange={field.onChange}
              />
            </FormField>
          )}
        />
      )}
      {isMeter ? (
        <>
          <Controller
            name="meterId"
            control={control}
            render={({ field }) => (
              <FormField id="schedule-meter" label="Meter" error={errors.meterId}>
                <InfiniteCombobox
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    clearErrors("meterId");
                  }}
                  options={meterOptions}
                  placeholder="Select a meter"
                  error={!!errors.meterId}
                  fetchNextPage={fetchNextPage}
                  hasNextPage={hasNextPage ?? false}
                  isFetchingNextPage={isFetchingNextPage}
                />
              </FormField>
            )}
          />
          <FormField
            id="schedule-interval-reading"
            label={`Repeat every${unit ? ` (${unit})` : ""}`}
            placeholder="e.g. 250"
            type="text"
            inputMode="numeric"
            registration={register("intervalReading")}
            error={errors.intervalReading}
          />
          <FormField
            id="schedule-first-due-reading"
            label="First due at (optional)"
            placeholder="Defaults to the current reading + interval"
            type="text"
            inputMode="numeric"
            registration={register("firstDueReading")}
            error={errors.firstDueReading}
          />
        </>
      ) : (
        <>
          <FormField id="schedule-interval" label="Repeat every (days)" error={errors.intervalDays}>
            <Input
              id="schedule-interval"
              type="number"
              min={1}
              placeholder="e.g. 30"
              aria-invalid={!!errors.intervalDays}
              {...register("intervalDays", { valueAsNumber: true })}
            />
          </FormField>
          {isAdd && (
            <ControlledDatePicker
              name="nextDueAt"
              control={control}
              label="First due date"
              placeholder="Pick a date"
              error={errors.nextDueAt}
              disablePast
              clearErrors={clearErrors}
            />
          )}
        </>
      )}
    </>
  );
};
