import type { buttonVariants } from "@/shared/ui/button";

import type { Reorder, ReorderStats } from "./api/reorders.api";
import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

export type ReorderActionType = "order" | "receive" | "cancel";

/**
 * How the price actually paid compares to the estimate captured when the reorder was raised.
 * The API calls the difference `variance` (actual total − estimate total).
 */
export type ReorderEstimateComparison = "overEstimate" | "underEstimate" | "asEstimated";

export type ReorderEstimateComparisonConfig = {
  /** Text color class. */
  className: string;
  /** Prefix so direction reads without color; negatives already carry "-" from the formatter. */
  sign: string;
};

/** The difference from the estimate, ready to render (e.g. "+$10.00" in red). */
export type ReorderEstimateDifference = { text: string; className: string };

/** One figure in the reorders stats strip. */
export type ReorderStatItemConfig = {
  key: string;
  label: string;
  emphasis?: boolean;
  /** Derives what to show from the stats payload. */
  getDisplay: (stats: ReorderStats) => { value: string; className?: string; hint?: string };
};

export type ReorderStatGroupConfig = {
  key: string;
  title: string;
  items: ReorderStatItemConfig[];
};

/** Everything the UI needs to render one lifecycle action: the row button and its confirm dialog. */
export type ReorderActionConfig = {
  icon: LucideIcon;
  // Row button
  buttonLabel: string;
  buttonVariant: VariantProps<typeof buttonVariants>["variant"];
  // Confirm dialog
  title: string;
  confirmLabel: string;
  dialogVariant: "default" | "destructive";
  iconClass: string;
  describe: (reorder: Reorder) => string;
};
