import type { buttonVariants } from "@/shared/ui/button";

import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

export type TriageActionKey = "reject" | "approve";

export type TriageAction = {
  key: TriageActionKey;
  label: string;
  icon: LucideIcon;
  variant?: VariantProps<typeof buttonVariants>["variant"];
};
