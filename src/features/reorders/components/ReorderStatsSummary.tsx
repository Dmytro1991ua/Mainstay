import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";
import { formatMoney } from "@/shared/utils";

import { useReorderStatsQuery } from "../hooks/use-reorders";

const StatItem = ({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) => (
  <div className="flex flex-col">
    <span className="text-[11px] font-medium uppercase tracking-wide text-text-3">{label}</span>
    <span
      className={cn("text-lg font-semibold tabular-nums", emphasis ? "text-text" : "text-text-2")}
    >
      {value}
    </span>
  </div>
);

export const ReorderStatsSummary = () => {
  const { data, isPending, isError } = useReorderStatsQuery();

  // Never block the table on the summary — just hide it if stats fail.
  if (isError) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-10 gap-y-3 rounded-xl border border-border bg-panel px-5 py-3.5 shadow-card">
      {isPending || !data ? (
        <Skeleton className="h-9 w-72" />
      ) : (
        <>
          <StatItem label="Committed spend" value={formatMoney(data.committedSpend)} emphasis />
          <StatItem label="Open orders" value={String(data.openOrders)} />
          <StatItem label="Unpriced orders" value={String(data.unpricedOrders)} />
        </>
      )}
    </div>
  );
};
