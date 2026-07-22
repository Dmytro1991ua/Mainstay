import { Package } from "lucide-react";

import { EmptyState } from "@/shared/ui/empty-state";

import type { CategoryStatsEntry, InventoryCategory } from "../api/dashboard-api";

const CATEGORY_LABELS: Record<InventoryCategory, string> = {
  ELECTRICAL: "Electrical",
  PLUMBING: "Plumbing",
  HVAC: "HVAC",
  TOOLS: "Tools",
  FASTENERS: "Fasteners",
  CHEMICALS: "Chemicals",
  SAFETY: "Safety",
  BUILDING_MATERIALS: "Building Materials",
};

const CategoryRow = ({
  category,
  stats,
  max,
}: {
  category: InventoryCategory;
  stats: CategoryStatsEntry;
  max: number;
}) => {
  const fillPct = max > 0 ? Math.round((stats.total / max) * 100) : 0;

  return (
    <div className="flex items-center gap-3 py-2.5">
      <p className="w-36 shrink-0 truncate text-sm font-medium text-text">
        {CATEGORY_LABELS[category]}
      </p>
      <div className="flex-1">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full bg-accent" style={{ width: `${fillPct}%` }} />
        </div>
      </div>
      <span className="w-14 shrink-0 text-right text-[12px] text-text-3">
        {stats.total} {stats.total === 1 ? "item" : "items"}
      </span>
    </div>
  );
};

type Props = {
  breakdown: Partial<Record<InventoryCategory, CategoryStatsEntry>>;
};

export const InventoryCategoryBreakdown = ({ breakdown }: Props) => {
  const entries = Object.entries(breakdown) as [InventoryCategory, CategoryStatsEntry][];

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Package}
        message="No inventory data."
        description="Add items to see category breakdown."
      />
    );
  }

  const sorted = entries.toSorted(([, a], [, b]) => b.total - a.total);
  const max = sorted[0]?.[1].total ?? 1;

  return (
    <div className="divide-y divide-border">
      {sorted.map(([category, stats]) => (
        <CategoryRow key={category} category={category} stats={stats} max={max} />
      ))}
    </div>
  );
};
