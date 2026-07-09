import { cn } from "@/shared/lib/utils";

import { PILL_CONFIG, type PillStatus } from "./config";

type PillProps = {
  status: PillStatus;
  className?: string;
};

export const Pill = ({ status, className }: PillProps) => {
  const { className: pillClassName, dotClassName } = PILL_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
        pillClassName,
        className,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", dotClassName)} aria-hidden="true" />
      {status}
    </span>
  );
};
