import { getVisibleStatCards } from "../utils";

import { STATS_CARDS_CONFIG } from "./configs";
import { SkeletonStatsGrid } from "./DashboardSkeletons";
import { StatsGrid } from "./StatsGrid";

import type { Stats } from "./configs";

type DashboardStatsProps = {
  isLoading: boolean;
  isTechnician: boolean;
  stats: Stats;
};

export const DashboardStats = ({ isLoading, isTechnician, stats }: DashboardStatsProps) =>
  isLoading ? (
    <SkeletonStatsGrid count={getVisibleStatCards(STATS_CARDS_CONFIG, isTechnician).length} />
  ) : (
    <StatsGrid stats={stats} isTechnician={isTechnician} />
  );
