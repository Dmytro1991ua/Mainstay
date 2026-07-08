import { Checkbox } from "@/shared/ui/checkbox";

import type { Table } from "@tanstack/react-table";

type DataTableCheckboxProps<T> = {
  table: Table<T>;
};

export const DataTableCheckbox = <T,>({ table }: DataTableCheckboxProps<T>) => {
  let checked: boolean | "indeterminate" = false;

  if (table.getIsAllPageRowsSelected()) checked = true;
  else if (table.getIsSomePageRowsSelected()) checked = "indeterminate";

  return (
    <div className="flex w-full items-center justify-center">
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all rows"
      />
    </div>
  );
};
