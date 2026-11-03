import { formatMoney } from "@/shared/utils";

import { getBarPercent } from "../utils";

export type SpendBreakdownRow = {
  key: string;
  label: string;
  spent: number;
  receivedOrders: number;
};

type SpendBreakdownCardProps = {
  title: string;
  rows: SpendBreakdownRow[];
};

/** Rows arrive biggest first; each bar is sized against the largest. */
export const SpendBreakdownCard = ({ title, rows }: SpendBreakdownCardProps) => {
  const max = Math.max(0, ...rows.map((row) => row.spent));

  return (
    <div className="rounded-xl border border-border bg-panel p-5 shadow-card">
      <h3 className="mb-3 text-sm font-semibold text-text">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-text-3">Nothing to show for this range.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((row) => (
            <li key={row.key}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate text-text">{row.label}</span>
                <span className="shrink-0 tabular-nums text-text">{formatMoney(row.spent)}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-panel-2">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${getBarPercent(row.spent, max)}%` }}
                />
              </div>
              <p className="mt-0.5 text-xs text-text-3">
                {row.receivedOrders} {row.receivedOrders === 1 ? "order" : "orders"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
