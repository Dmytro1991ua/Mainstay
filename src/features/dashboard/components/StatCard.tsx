import { cn } from "@/shared/lib/utils";

import { STAT_CARD_VARIANT_CONFIG } from "./configs";

import type { StatCardVariant } from "./types";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: number | string;
  icon: LucideIcon;
  variant?: StatCardVariant;
  subtext?: string;
};

export const StatCard = ({
  label,
  value,
  icon: Icon,
  variant = "default",
  subtext,
}: StatCardProps) => {
  const { soft, icon, leftBorder } = STAT_CARD_VARIANT_CONFIG[variant];

  return (
    <div
      className={cn(
        "group flex items-start gap-4 rounded-xl border border-border border-l-4 bg-panel p-5 shadow-card",
        "transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg",
        leftBorder,
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          "transition-transform duration-200 ease-out group-hover:scale-110",
          soft,
        )}
      >
        <Icon className={cn("h-5 w-5", icon)} strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-text-3">{label}</p>
        <p className="mt-0.5 text-2xl font-semibold tabular-nums text-text">{value}</p>
        {subtext && <p className="mt-0.5 text-[12px] text-text-3">{subtext}</p>}
      </div>
    </div>
  );
};
