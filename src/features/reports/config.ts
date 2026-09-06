import type { ChartConfig } from "@/shared/ui/chart";

import type { ReportTab } from "./types";

export const REPORT_TABS: { key: ReportTab; label: string }[] = [
  { key: "throughput", label: "Throughput" },
  { key: "reliability", label: "Asset reliability" },
];

export const THROUGHPUT_CHART_CONFIG = {
  created: { label: "Created", color: "var(--accent)" },
  completed: { label: "Completed", color: "var(--green)" },
} satisfies ChartConfig;

export const GROUP_BY_OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];
