import { FormField } from "@/shared/ui/form-field";
import { FormSheet, FormSheetFooter } from "@/shared/ui/sheet";

import { METER_UNIT_SUGGESTIONS } from "../config";

import type { SheetMode } from "../types";
import type { MeterFormValues } from "../validation";
import type { UseFormReturn } from "react-hook-form";

type MeterFormSheetProps = {
  sheetMode: SheetMode | null;
  form: UseFormReturn<MeterFormValues>;
  onSave: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
};

export const MeterFormSheet = ({
  sheetMode,
  form,
  onSave,
  onClose,
  isSaving,
}: MeterFormSheetProps) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = form;

  const isEdit = sheetMode?.type === "edit";

  return (
    <FormSheet
      title={isEdit ? "Rename meter" : "Add meter"}
      open={sheetMode !== null}
      onClose={onClose}
      footer={
        <FormSheetFooter
          onSave={onSave}
          isSaving={isSaving}
          saveLabel={isEdit ? "Save name" : "Add meter"}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <FormField
          id="meter-name"
          label="Name"
          placeholder="e.g. Engine hours"
          registration={register("name")}
          error={errors.name}
        />
        <div className="flex flex-col gap-2">
          <FormField
            id="meter-unit"
            label="Unit"
            placeholder="e.g. hours"
            registration={register("unit")}
            error={errors.unit}
            disabled={isEdit}
            hint="The unit can't be changed after the meter is created."
          />
          {!isEdit && (
            <div className="flex flex-wrap gap-1.5">
              {METER_UNIT_SUGGESTIONS.map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => setValue("unit", unit, { shouldValidate: true })}
                  className="rounded-md border border-border px-2 py-0.5 text-xs text-text-2 transition-colors hover:bg-panel-2 hover:text-text"
                >
                  {unit}
                </button>
              ))}
            </div>
          )}
        </div>
        {!isEdit && (
          <FormField
            id="meter-initial-reading"
            label="Current reading"
            placeholder="0"
            type="text"
            inputMode="numeric"
            registration={register("initialReading")}
            error={errors.initialReading}
            hint="The meter's reading right now. It can only go up."
          />
        )}
      </div>
    </FormSheet>
  );
};
