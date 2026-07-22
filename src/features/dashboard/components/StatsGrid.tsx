import { STATS_CARDS_CONFIG } from "./configs";
import { StatCard } from "./StatCard";

import type { Stats } from "./configs";

export const StatsGrid = ({ stats }: { stats: Stats }) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
    {STATS_CARDS_CONFIG.map(({ key, label, icon, variant, subtext }) => {
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
