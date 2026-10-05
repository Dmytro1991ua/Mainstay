import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";

import { useReorderStatsQuery } from "../hooks/use-reorders";
import { REORDER_STAT_GROUPS } from "../reorder-stats.config";

type StatItemProps = {
  label: string;
  value: string;
  emphasis?: boolean;
  valueClassName?: string;
  hint?: string;
};

const StatItem = ({ label, value, emphasis, valueClassName, hint }: StatItemProps) => (
  <div className="flex flex-col">
    <span className="text-[11px] font-medium uppercase tracking-wide text-text-3">{label}</span>
    <span
      className={cn(
        "text-lg font-semibold tabular-nums",
        emphasis ? "text-text" : "text-text-2",
        valueClassName,
      )}
    >
      {value}
    </span>
    {hint && <span className="text-[11px] text-text-3">{hint}</span>}
  </div>
);

export const ReorderStatsSummary = () => {
  const { data, isPending, isError } = useReorderStatsQuery();

  // Never block the table on the summary — just hide it if stats fail.
  if (isError) return null;

  return (
    <div className="flex flex-wrap gap-x-12 gap-y-4 rounded-xl border border-border bg-panel px-5 py-4 shadow-card">
      {isPending || !data ? (
        <Skeleton className="h-14 w-full max-w-xl" />
      ) : (
        REORDER_STAT_GROUPS.map(({ key, title, items }) => (
          <div key={key} className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-text-3">
              {title}
            </span>
            <div className="flex flex-wrap gap-x-10 gap-y-3">
              {items.map(({ key: itemKey, label, emphasis, getDisplay }) => {
                const { value, className, hint } = getDisplay(data);

                return (
                  <StatItem
                    key={itemKey}
                    label={label}
                    value={value}
                    emphasis={emphasis}
                    valueClassName={className}
                    hint={hint}
                  />
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
