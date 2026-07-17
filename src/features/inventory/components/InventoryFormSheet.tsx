import { Controller } from "react-hook-form";

import { FormField } from "@/shared/ui/form-field";
import { Select } from "@/shared/ui/select";
import { FormSheet, FormSheetFooter } from "@/shared/ui/sheet";

import { INVENTORY_FORM_FIELDS } from "../config";
import { useInventoryCategoriesQuery } from "../hooks/use-inventory";
import { formatCategoryLabel } from "../utils";

import type { SheetMode } from "../types";
import type { InventoryFormValues } from "../validation";
import type { UseFormReturn } from "react-hook-form";

type InventoryFormSheetProps = {
  sheetMode: SheetMode | null;
  form: UseFormReturn<InventoryFormValues>;
  onSave: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
};

export const InventoryFormSheet = ({
  sheetMode,
  form,
  onSave,
  onClose,
  isSaving,
}: InventoryFormSheetProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const mode = sheetMode?.type ?? "add";

  const { data: categories } = useInventoryCategoriesQuery();
  const categoryOptions =
    categories?.map((c) => ({ value: c, label: formatCategoryLabel(c) })) ?? [];

  return (
    <FormSheet
      title={mode === "add" ? "Add inventory item" : "Edit item"}
      open={sheetMode !== null}
      onClose={onClose}
      footer={
        <FormSheetFooter
          onSave={onSave}
          isSaving={isSaving}
          saveLabel={mode === "add" ? "Add item" : "Save changes"}
        />
      }
    >
      <div className="grid grid-cols-2 gap-3">
        {INVENTORY_FORM_FIELDS.map((field) => (
          <div key={field.name} className={field.colSpan === 2 ? "col-span-2" : undefined}>
            {field.isSelect ? (
              <Controller
                name={field.name}
                control={control}
                render={({ field: f }) => (
                  <FormField
                    id={`inv-${field.name}`}
                    label={field.label}
                    error={errors[field.name]}
                  >
                    <Select
                      value={f.value}
                      onValueChange={f.onChange}
                      options={categoryOptions}
                      placeholder={field.placeholder}
                      error={!!errors[field.name]}
                    />
                  </FormField>
                )}
              />
            ) : (
              <FormField
                id={`inv-${field.name}`}
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
                inputClassName={field.inputClassName}
                disabled={field.readonlyInEdit && mode === "edit"}
                registration={register(field.name)}
                error={errors[field.name]}
              />
            )}
          </div>
        ))}
      </div>
    </FormSheet>
  );
};
