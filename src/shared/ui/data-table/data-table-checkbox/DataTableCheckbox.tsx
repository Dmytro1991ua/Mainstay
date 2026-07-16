import { Checkbox } from "@/shared/ui/checkbox";

import type { Table } from "@tanstack/react-table";

type DataTableCheckboxProps<T> = {
  table: Table<T>;
};

export const DataTableCheckbox = <T,>({ table }: DataTableCheckboxProps<T>) => {
  "use no memo";
  let checked: boolean | "indeterminate" = false;

  if (table.getIsAllPageRowsSelected()) checked = true;
  else if (table.getIsSomePageRowsSelected()) checked = "indeterminate";

  return (
    <Checkbox
      checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        table.toggleAllPageRowsSelected(checked !== true);
      }}
      aria-label="Select all rows"
    />
  );
};
