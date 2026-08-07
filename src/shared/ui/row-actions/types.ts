import type { LucideIcon } from "lucide-react";

export type RowActionsProps = {
  label: string;
  onEdit?: () => void;
  onRestock?: () => void;
  onDelete?: () => void;
};

export type ActionSpec = {
  prop: keyof Omit<RowActionsProps, "label">;
  verb: string;
  icon: LucideIcon;
  hoverClass: string;
};
