import type { LucideIcon } from "lucide-react";

export type CommandItem = {
  /** Stable unique id (used for keys + scroll-into-view targeting). */
  id: string;
  label: string;
  /** Heading this item is bucketed under (e.g. "Navigation", "Actions"). */
  group: string;
  icon?: LucideIcon;
  /** Small muted text on the right (e.g. "Jump to"). */
  hint?: string;
  /** Extra text folded into the search match but not shown. */
  keywords?: string;
  onSelect: () => void;
};

export type CommandMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  placeholder?: string;
  emptyMessage?: string;
};
