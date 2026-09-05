import type { ChartConfig } from "@/shared/ui/chart";

export const THROUGHPUT_CHART_CONFIG = {
  created: { label: "Created", color: "var(--accent)" },
  completed: { label: "Completed", color: "var(--green)" },
} satisfies ChartConfig;

export const GROUP_BY_OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];
