import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";

import { ASSET_STAT_CARDS } from "../config";
import { useAssetStatsQuery } from "../hooks/use-assets";

export const AssetStats = () => {
  const { data: stats, isPending, isError } = useAssetStatsQuery();

  if (isError) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {ASSET_STAT_CARDS.map(({ key, label, icon: Icon, soft, iconColor, border }) => (
        <div
          key={key}
          className={cn(
            "flex items-start gap-3 rounded-xl border border-border border-l-4 bg-panel p-4 shadow-card",
            border,
          )}
        >
          <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", soft)}>
            <Icon className={cn("size-4", iconColor)} strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-text-3">{label}</p>
            {isPending ? (
              <Skeleton className="mt-1 h-6 w-10" />
            ) : (
              <p className="mt-0.5 text-xl font-semibold tabular-nums text-text">{stats[key]}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
