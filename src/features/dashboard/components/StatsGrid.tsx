import { cn } from "@/shared/lib/utils";

import { getVisibleStatCards } from "../utils";

import { STATS_CARDS_CONFIG } from "./configs";
import { StatCard } from "./StatCard";
import { getStatsColClass } from "./stats-grid-cols";

import type { Stats } from "./configs";

type StatsGridProps = {
  stats: Stats;
  isTechnician?: boolean;
};

export const StatsGrid = ({ stats, isTechnician }: StatsGridProps) => {
  const cards = getVisibleStatCards(STATS_CARDS_CONFIG, isTechnician);

  return (
    <div className={cn("grid gap-4", getStatsColClass(cards.length))}>
      {cards.map(({ key, label, icon, variant, subtext }) => {
        const value = stats[key];
        return (
          <StatCard
            key={key}
            label={label}
            value={value}
            icon={icon}
            variant={variant?.(value)}
            subtext={subtext?.(value, stats)}
          />
        );
      })}
    </div>
  );
};
