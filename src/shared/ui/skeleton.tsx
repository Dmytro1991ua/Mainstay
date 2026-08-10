import { cn } from "@/shared/lib/utils";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("sk", className)} />
);

type DetailShellSkeletonProps = { skeletonKeys: string[] };

export const DetailShellSkeleton = ({ skeletonKeys }: DetailShellSkeletonProps) => (
  <div className="flex flex-1 flex-col gap-4 min-h-0">
    <div className="flex items-center gap-4 rounded-xl border border-border bg-panel px-5 py-4 shadow-card">
      <Skeleton className="size-9 shrink-0 rounded-lg" />
      <Skeleton className="h-5 w-48 flex-1" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
    <div className="rounded-xl border border-border bg-panel shadow-card">
      {skeletonKeys.map((key) => (
        <div key={key} className="flex gap-6 border-t border-border px-6 py-4 first:border-t-0">
          <Skeleton className="h-4 w-28 shrink-0" />
          <Skeleton className="h-4 w-40" />
        </div>
      ))}
    </div>
  </div>
);
