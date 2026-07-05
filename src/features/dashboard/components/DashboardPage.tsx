import { useDashboard } from "../hooks/use-dashboard";

import { DASHBOARD_WIDGETS_CONFIG } from "./configs";
import { SkeletonStatsGrid } from "./DashboardSkeletons";
import { StatsGrid } from "./StatsGrid";
import { WidgetSection } from "./WidgetSection";

export const DashboardPage = () => {
  const data = useDashboard();

  return (
    <div className="flex flex-col gap-6">
      {data.isLoading ? <SkeletonStatsGrid /> : <StatsGrid stats={data.stats} />}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {DASHBOARD_WIDGETS_CONFIG.map(({ key, title, skeleton, render }) => (
          <WidgetSection key={key} title={title} loading={data.isLoading} skeleton={skeleton}>
            {render(data)}
          </WidgetSection>
        ))}
      </div>
    </div>
  );
};
