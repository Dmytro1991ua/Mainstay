import { createFileRoute } from "@tanstack/react-router";

import { ReportsPage } from "@/features/reports";
import { REPORT_TABS } from "@/features/reports/config";
import type { ReportTab } from "@/features/reports/types";
import { validateTableSearch } from "@/shared/ui/data-table";
import type { OnSetTableState, TableUrlState } from "@/shared/ui/data-table";

type ReportsSearch = TableUrlState & { tab?: ReportTab };

const isReportTab = (value: unknown): value is ReportTab =>
  REPORT_TABS.some((t) => t.key === value);

const validateReportsSearch = (raw: Record<string, unknown>): ReportsSearch => ({
  ...validateTableSearch(raw),
  tab: isReportTab(raw.tab) ? raw.tab : undefined,
});

const ReportsRoute = () => {
  const navigate = Route.useNavigate();
  const { tab, ...tableState } = Route.useSearch();

  const activeTab: ReportTab = tab ?? "throughput";

  // Preserve the active tab as table sort/search/filters change.
  const onSetTableState: OnSetTableState = (updater) => {
    navigate({ search: (prev) => ({ ...updater(prev), tab: prev.tab }) });
  };

  // Switching tabs drops the previous table state so a sort/search from one
  // report can't apply to another (whose sort ids differ). Clicking the active
  // tab is a no-op so it doesn't wipe the current report's table state.
  const onTabChange = (nextTab: ReportTab) => {
    if (nextTab === activeTab) return;

    navigate({ search: { tab: nextTab } });
  };

  return (
    <ReportsPage
      activeTab={activeTab}
      onTabChange={onTabChange}
      tableState={tableState}
      onSetTableState={onSetTableState}
    />
  );
};

export const Route = createFileRoute("/_app/reports/")({
  validateSearch: validateReportsSearch,
  component: ReportsRoute,
});
