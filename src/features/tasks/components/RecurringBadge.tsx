import { Tooltip } from "@/shared/ui/tooltip";

export const RecurringBadge = () => (
  <Tooltip content="Auto-generated from a recurring schedule">
    <span className="shrink-0 rounded-md border border-border bg-panel-2 px-1.5 py-px text-[11px] font-semibold text-text-2">
      Recurring
    </span>
  </Tooltip>
);
