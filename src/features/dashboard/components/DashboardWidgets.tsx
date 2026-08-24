import { DASHBOARD_WIDGETS_CONFIG } from "./configs";
import { WidgetSection } from "./WidgetSection";

import type { DashboardData } from "./types";

type DashboardWidgetsProps = {
  data: DashboardData;
  isTechnician: boolean;
};

export const DashboardWidgets = ({ data, isTechnician }: DashboardWidgetsProps) => {
  const widgets = isTechnician
    ? DASHBOARD_WIDGETS_CONFIG.filter((w) => !w.technicianHidden)
    : DASHBOARD_WIDGETS_CONFIG;

  return (
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
  );
};
