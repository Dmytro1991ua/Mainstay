import { useInventoryQuery } from "@/features/inventory/hooks/use-inventory";
import { InfiniteCombobox } from "@/shared/ui/combobox";
import { FormField } from "@/shared/ui/form-field";
import { FormSheet, FormSheetFooter } from "@/shared/ui/sheet";

type RaiseReorderSheetProps = {
  open: boolean;
  value: string;
  onValueChange: (value: string) => void;
  onSave: () => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
};

export const RaiseReorderSheet = ({
  open,
  value,
  onValueChange,
  onSave,
  onClose,
  isSaving,
}: RaiseReorderSheetProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInventoryQuery({
    limit: 20,
    sortBy: "name",
    sortOrder: "asc",
  });

  const itemOptions =
    data?.pages
      .flatMap((p) => p.data)
      .map((item) => ({
        value: item.id,
        label: item.name,
        meta: { serialNumber: item.serialNumber },
      })) ?? [];

  return (
    <FormSheet
      title="Raise reorder"
      open={open}
      onClose={onClose}
      footer={<FormSheetFooter onSave={onSave} isSaving={isSaving} saveLabel="Raise reorder" />}
    >
      <FormField id="reorder-item" label="Inventory item">
        <InfiniteCombobox
          value={value}
          onValueChange={onValueChange}
          options={itemOptions}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          placeholder="Select an item to reorder"
          renderOption={(opt) => (
            <span className="flex w-full items-center justify-between gap-2">
              <span className="truncate">{opt.label}</span>
              {opt.meta?.serialNumber ? (
                <span className="shrink-0 font-mono text-xs text-text-3">
                  {String(opt.meta.serialNumber)}
                </span>
              ) : null}
            </span>
          )}
        />
      </FormField>
    </FormSheet>
  );
};
