import { STATS_CARDS_CONFIG } from "./configs";
import { StatCard } from "./StatCard";

import type { Stats } from "./configs";

type StatsGridProps = {
  stats: Stats;
  isTechnician?: boolean;
};

export const StatsGrid = ({ stats, isTechnician }: StatsGridProps) => {
  const cards = isTechnician
    ? STATS_CARDS_CONFIG.filter((c) => !c.technicianHidden)
    : STATS_CARDS_CONFIG;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
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
