import { cn } from "@/shared/lib/utils";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateVariant = "accent" | "green" | "amber" | "red";

type EmptyStateProps = {
  icon: LucideIcon;
  message: string;
  description?: string;
  variant?: EmptyStateVariant;
  action?: ReactNode;
  className?: string;
};

const VARIANT_CONFIG: Record<EmptyStateVariant, { wrapper: string; icon: string }> = {
  accent: { wrapper: "bg-accent-soft", icon: "text-accent" },
  green: { wrapper: "bg-green-soft", icon: "text-green" },
  amber: { wrapper: "bg-amber-soft", icon: "text-amber" },
  red: { wrapper: "bg-red-soft", icon: "text-red" },
};

export const EmptyState = ({
  icon: Icon,
  message,
  description,
  variant = "accent",
  action,
  className,
}: EmptyStateProps) => {
  const { wrapper, icon } = VARIANT_CONFIG[variant];
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center",
        className,
      )}
    >
      <div className={cn("rounded-2xl p-4", wrapper)}>
        <Icon className={cn("h-8 w-8", icon)} strokeWidth={1.5} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-text">{message}</p>
        {description && <p className="text-[12px] text-text-3">{description}</p>}
      </div>
      {action}
    </div>
  );
};
