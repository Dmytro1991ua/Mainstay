import { Controller } from "react-hook-form";

import { FormField } from "@/shared/ui/form-field";
import { Select } from "@/shared/ui/select";
import { FormSheet, FormSheetFooter } from "@/shared/ui/sheet";

import { ASSET_FORM_FIELDS, ASSET_STATUS_OPTIONS } from "../config";
import { useAssetCategoriesQuery } from "../hooks/use-assets";
import { formatCategoryLabel } from "../utils";

import type { SheetMode } from "../types";
import type { AssetFormValues } from "../validation";
import type { UseFormReturn } from "react-hook-form";

type AssetFormSheetProps = {
  sheetMode: SheetMode | null;
  form: UseFormReturn<AssetFormValues>;
  onSave: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
};

export const AssetFormSheet = ({
  sheetMode,
  form,
  onSave,
  onClose,
  isSaving,
}: AssetFormSheetProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const mode = sheetMode?.type ?? "add";

  const { data: categories } = useAssetCategoriesQuery();
  const categoryOptions =
    categories?.map((c) => ({ value: c, label: formatCategoryLabel(c) })) ?? [];

  return (
    <FormSheet
      title={mode === "add" ? "Add asset" : "Edit asset"}
      open={sheetMode !== null}
      onClose={onClose}
      footer={
        <FormSheetFooter
          onSave={onSave}
          isSaving={isSaving}
          saveLabel={mode === "add" ? "Add asset" : "Save changes"}
        />
      }
    >
      <div className="grid grid-cols-2 gap-3">
        {ASSET_FORM_FIELDS.map((field) => (
          <div key={field.name} className={field.colSpan === 2 ? "col-span-2" : undefined}>
            {field.select ? (
              <Controller
                name={field.name}
                control={control}
                render={({ field: f }) => (
                  <FormField
                    id={`asset-${field.name}`}
                    label={field.label}
                    error={errors[field.name]}
                  >
                    <Select
                      value={f.value}
                      onValueChange={f.onChange}
                      options={field.select === "category" ? categoryOptions : ASSET_STATUS_OPTIONS}
                      placeholder={field.placeholder}
                      error={!!errors[field.name]}
                    />
                  </FormField>
                )}
              />
            ) : (
              <FormField
                id={`asset-${field.name}`}
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
