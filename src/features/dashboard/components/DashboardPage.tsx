import { PageShell } from "@/shared/ui/page-shell";

import { useDashboard } from "../hooks/use-dashboard";

import { DASHBOARD_WIDGETS_CONFIG } from "./configs";
import { SkeletonStatsGrid } from "./DashboardSkeletons";
import { StatsGrid } from "./StatsGrid";
import { WidgetSection } from "./WidgetSection";

export const DashboardPage = () => {
  const data = useDashboard();

  return (
    <PageShell title="Dashboard" subtitle="Overview of your maintenance operations" variant="plain">
      {data.isLoading ? <SkeletonStatsGrid /> : <StatsGrid stats={data.stats} />}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {DASHBOARD_WIDGETS_CONFIG.map(
          ({ key, title, skeleton, viewAllTo, badge, fullWidth, render }) => (
            <WidgetSection
              key={key}
              title={title}
              loading={data.isLoading}
              skeleton={skeleton}
              viewAllTo={viewAllTo}
              badge={!data.isLoading ? badge?.(data) : undefined}
              className={fullWidth ? "sm:col-span-2" : undefined}
            >
              {render(data)}
            </WidgetSection>
          ),
        )}
      </div>
    </PageShell>
  );
};
