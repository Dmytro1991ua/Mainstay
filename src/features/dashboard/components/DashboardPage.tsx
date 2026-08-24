import { PageShell } from "@/shared/ui/page-shell";

import { useDashboard } from "../hooks/use-dashboard";

import { DashboardError } from "./DashboardError";
import { DashboardStats } from "./DashboardStats";
import { DashboardWidgets } from "./DashboardWidgets";

export const DashboardPage = () => {
  const data = useDashboard();
  const { isTechnician, isLoading, isError, stats } = data;

  const subtitle = isTechnician
    ? "Your assigned tasks at a glance"
    : "Overview of your maintenance operations";

  return (
    <PageShell title="Dashboard" subtitle={subtitle} variant="plain">
      {isError ? (
        <DashboardError onRetry={data.refetch} />
      ) : (
        <>
          <DashboardStats isLoading={isLoading} isTechnician={isTechnician} stats={stats} />
          <DashboardWidgets data={data} isTechnician={isTechnician} />
        </>
      )}
    </PageShell>
  );
};
