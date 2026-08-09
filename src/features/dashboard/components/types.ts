import type { TASK_CHART_LEGEND_CONFIG } from "./configs";
import type { useDashboard } from "../hooks/use-dashboard";
import type { ReactNode } from "react";

export type StatCardVariant = "default" | "accent" | "amber" | "red" | "green";

type DashboardData = ReturnType<typeof useDashboard>;

export type DashboardWidgetConfig = {
  key: string;
  title: string;
  skeleton: ReactNode;
  fullWidth?: boolean;
  viewAllTo?: string;
  technicianHidden?: true;
  badge?: (data: DashboardData) => number | undefined;
  render: (data: DashboardData) => ReactNode;
};

export type TaskChartLegendKey = (typeof TASK_CHART_LEGEND_CONFIG)[number]["key"];
