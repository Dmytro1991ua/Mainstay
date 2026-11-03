import { formatEnumLabel } from "@/shared/utils";

import { SpendBreakdownCard } from "./SpendBreakdownCard";

import type { SpendReport } from "../api/reports.api";

type SpendBreakdownsProps = {
  bySupplier: SpendReport["bySupplier"];
  byCategory: SpendReport["byCategory"];
};

export const SpendBreakdowns = ({ bySupplier, byCategory }: SpendBreakdownsProps) => (
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
    <SpendBreakdownCard
      title="By supplier"
      rows={bySupplier.map((row) => ({
        // A null supplier means none was set on the item when the order was received.
        key: row.supplier ?? "none",
        label: row.supplier ?? "No supplier",
        spent: Number(row.spent),
        receivedOrders: row.receivedOrders,
      }))}
    />
    <SpendBreakdownCard
      title="By category"
      rows={byCategory.map((row) => ({
        key: row.category,
        label: formatEnumLabel(row.category),
        spent: Number(row.spent),
        receivedOrders: row.receivedOrders,
      }))}
    />
  </div>
);
