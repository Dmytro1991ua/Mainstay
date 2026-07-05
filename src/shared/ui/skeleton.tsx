import { cn } from "@/shared/lib/utils";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("sk", className)} />
);
