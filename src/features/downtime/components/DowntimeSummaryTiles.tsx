import { formatAvailability, formatDowntimeDuration } from "../utils";

import type { DowntimeSummary } from "../api/downtime.api";

const getTiles = (summary: DowntimeSummary) => [
  { label: "Availability", value: formatAvailability(summary.availabilityPercent) },
  { label: "Downtime", value: formatDowntimeDuration(summary.downtimeMinutes) },
  { label: "Breakdowns", value: String(summary.breakdowns) },
  {
    label: "MTTR",
    value: formatDowntimeDuration(summary.mttrMinutes),
    hint: "Mean time to repair",
  },
  {
    label: "MTBF",
    value: formatDowntimeDuration(summary.mtbfMinutes),
    hint: "Mean time between breakdowns",
  },
];

export const DowntimeSummaryTiles = ({ summary }: { summary: DowntimeSummary }) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
    {getTiles(summary).map(({ label, value, hint }) => (
      <div key={label} className="rounded-lg bg-panel-2 px-3 py-2.5" title={hint}>
        <p className="text-xs font-medium text-text-3">{label}</p>
        <p className="mt-0.5 text-base font-semibold tabular-nums text-text">{value}</p>
      </div>
    ))}
  </div>
);
