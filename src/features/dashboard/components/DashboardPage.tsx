import { PageShell } from "@/shared/ui/page-shell";

import { useDashboard } from "../hooks/use-dashboard";

import { DASHBOARD_WIDGETS_CONFIG } from "./configs";
import { SkeletonStatsGrid } from "./DashboardSkeletons";
import { StatsGrid } from "./StatsGrid";
import { WidgetSection } from "./WidgetSection";

export const DashboardPage = () => {
  const data = useDashboard();
  const { isTechnician } = data;

  const widgets = isTechnician
    ? DASHBOARD_WIDGETS_CONFIG.filter((w) => !w.technicianHidden)
    : DASHBOARD_WIDGETS_CONFIG;

  const subtitle = isTechnician
    ? "Your assigned tasks at a glance"
    : "Overview of your maintenance operations";

  return (
    <PageShell title="Dashboard" subtitle={subtitle} variant="plain">
      {data.isLoading ? (
        <SkeletonStatsGrid />
      ) : (
        <StatsGrid stats={data.stats} isTechnician={isTechnician} />
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {widgets.map(({ key, title, skeleton, viewAllTo, badge, fullWidth, render }) => (
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
        ))}
      </div>
    </PageShell>
  );
};
