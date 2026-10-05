import { formatMoney } from "@/shared/utils";

import { getReorderEstimateDifference } from "./utils";

import type { ReorderStatGroupConfig } from "./types";

// Estimates (open orders) and actuals (received orders) are deliberately separate groups so a
// committed figure is never read as money spent.
export const REORDER_STAT_GROUPS: ReorderStatGroupConfig[] = [
  {
    key: "committed",
    title: "Committed · open orders",
    items: [
      {
        key: "committedSpend",
        label: "Committed spend",
        emphasis: true,
        getDisplay: (stats) => ({ value: formatMoney(stats.committedSpend) }),
      },
      {
        key: "openOrders",
        label: "Open orders",
        getDisplay: (stats) => ({ value: String(stats.openOrders) }),
      },
      {
        key: "unpricedOrders",
        label: "No estimate",
        getDisplay: (stats) => ({ value: String(stats.unpricedOrders) }),
      },
    ],
  },
  {
    key: "actual",
    title: "Actual · received orders",
    items: [
      {
        key: "spent",
        label: "Actual spend",
        emphasis: true,
        getDisplay: (stats) => ({ value: formatMoney(stats.spent) }),
      },
      {
        key: "receivedOrders",
        label: "Received orders",
        getDisplay: (stats) => ({ value: String(stats.receivedOrders) }),
      },
      {
        key: "unrecordedReceived",
        label: "No actual price",
        getDisplay: (stats) => ({ value: String(stats.unrecordedReceived) }),
      },
      {
        key: "variance",
        label: "Over / under estimate",
        getDisplay: (stats) => {
          // Only orders with both an estimate and an actual price can be compared.
          const orders = stats.comparableOrders === 1 ? "order" : "orders";
          const hint = `${stats.comparableOrders} ${orders} compared`;

          // The server returns "0.00" when nothing is comparable; "$0.00" would read as
          // "exactly on estimate", so show a dash instead.
          if (stats.comparableOrders === 0) return { value: "—", hint };

          const { text, className } = getReorderEstimateDifference(stats.variance);

          return { value: text, className, hint };
        },
      },
    ],
  },
];
