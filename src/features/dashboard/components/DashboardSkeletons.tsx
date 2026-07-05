import { Skeleton } from "@/shared/ui/skeleton";

const CARD_KEYS = ["c1", "c2", "c3", "c4"] as const;
const ROW_KEYS = ["r1", "r2", "r3", "r4", "r5"] as const;
const LEGEND_KEYS = ["l1", "l2", "l3"] as const;

export const SkeletonStatsGrid = () => (
  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
    {CARD_KEYS.map((k) => (
      <div
        key={k}
        className="rounded-xl border border-border border-l-4 border-l-accent bg-panel p-5 shadow-card"
      >
        <div className="flex items-start gap-4">
          <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-7 w-16" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonWidget = () => (
  <div className="flex-1 rounded-xl border border-accent bg-bg p-4 shadow-card">
    <div className="divide-y divide-border">
      {ROW_KEYS.map((k) => (
        <div key={k} className="flex items-center justify-between gap-3 py-2.5">
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-3.5 w-20" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonChart = () => (
  <div className="flex-1 rounded-xl border border-accent bg-bg p-4 shadow-card">
    <div className="flex flex-col items-center gap-4 py-3">
      <Skeleton className="h-30 w-30 rounded-full" />
      <div className="w-full space-y-2">
        {LEGEND_KEYS.map((k) => (
          <div key={k} className="flex items-center justify-between gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
