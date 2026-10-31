import { cn } from "@/shared/lib/utils";
import { formatMoney } from "@/shared/utils";

import { formatVariance } from "../utils";

import type { SpendReport } from "../api/reports.api";

type SpendSummaryCardsProps = {
  summary: SpendReport["summary"];
};

export const SpendSummaryCards = ({ summary }: SpendSummaryCardsProps) => {
  const variance = Number(summary.variance);
  const hasComparison = summary.comparableOrders > 0;

  const cards = [
    { label: "Total spent", value: formatMoney(summary.spent) },
    { label: "Received orders", value: summary.receivedOrders.toLocaleString("en-US") },
    {
      label: "Vs estimate",
      value: hasComparison ? formatVariance(summary.variance) : "—",
      // Over the estimate is the one to notice; under it is good news.
      valueClass:
        hasComparison && variance !== 0 ? (variance > 0 ? "text-amber" : "text-green") : "",
      hint: hasComparison
        ? `Across ${summary.comparableOrders.toLocaleString("en-US")} priced orders`
        : "No orders with both prices",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-border bg-panel p-4 shadow-card">
          <p className="text-[13px] font-medium text-text-3">{card.label}</p>
          <p
            className={cn("mt-0.5 text-2xl font-semibold tabular-nums text-text", card.valueClass)}
          >
            {card.value}
          </p>
          {card.hint && <p className="mt-0.5 text-xs text-text-3">{card.hint}</p>}
        </div>
      ))}
    </div>
  );
};
