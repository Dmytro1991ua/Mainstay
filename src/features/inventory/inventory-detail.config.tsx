import { format, formatDistanceToNow } from "date-fns";
import { Hash } from "lucide-react";

import type { DetailField } from "@/shared/ui/detail-shell";
import { Pill } from "@/shared/ui/pill";

import { formatCategoryLabel, getInventoryStatus } from "./utils";

import type { InventoryItem } from "./api/inventory.api";

export const getInventoryDetailFields = (item: InventoryItem): DetailField[] => {
  const status = getInventoryStatus(item.quantity, item.minStockLevel);

  const fields: DetailField[] = [
    {
      label: "Stock level",
      value: <Pill status={status} />,
    },
    {
      label: "Serial number",
      value: (
        <span className="flex items-center gap-1.5 font-mono text-xs text-text">
          <Hash className="size-3 shrink-0 text-text-3" />
          {item.serialNumber}
        </span>
      ),
    },
    {
      label: "Category",
      value: <span className="text-text">{formatCategoryLabel(item.category)}</span>,
    },
    {
      label: "Quantity",
      value: (
        <span className="font-medium text-text">
          {item.quantity}{" "}
          <span className="font-normal text-text-3">(min: {item.minStockLevel})</span>
        </span>
      ),
    },
  ];

  if (item.supplier) {
    fields.push({ label: "Supplier", value: <span className="text-text">{item.supplier}</span> });
  }

  if (item.reorderPoint != null) {
    fields.push({
      label: "Reorder point",
      value: <span className="text-text">{item.reorderPoint}</span>,
    });
  }

  if (item.reorderQuantity != null) {
    fields.push({
      label: "Reorder quantity",
      value: <span className="text-text">{item.reorderQuantity}</span>,
    });
  }

  fields.push(
    {
      label: "Added",
      value: <span className="text-text-2">{format(new Date(item.createdAt), "MMM d, yyyy")}</span>,
    },
    {
      label: "Last updated",
      value: (
        <span className="text-text-2">
          {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
        </span>
      ),
    },
  );

  return fields;
};
