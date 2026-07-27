import { Skeleton } from "@/shared/ui/skeleton";

export const NotificationRowSkeleton = () => (
  <div className="flex items-start gap-3 border-b border-border px-4 py-3.5 last:border-0">
    <Skeleton className="mt-0.5 h-8 w-8 shrink-0 rounded-lg" />
    <div className="flex-1 space-y-1.5">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3.5 w-3/4" />
    </div>
  </div>
);
