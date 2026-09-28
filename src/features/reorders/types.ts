import type { buttonVariants } from "@/shared/ui/button";

import type { Reorder } from "./api/reorders.api";
import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

export type ReorderActionType = "order" | "receive" | "cancel";

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
