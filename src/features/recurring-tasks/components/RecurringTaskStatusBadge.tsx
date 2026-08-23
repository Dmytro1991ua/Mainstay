type RecurringTaskStatusBadgeProps = {
  isActive: boolean;
};

export const RecurringTaskStatusBadge = ({ isActive }: RecurringTaskStatusBadgeProps) =>
  isActive ? (
    <span className="rounded-md border border-green-border bg-green-soft px-1.5 py-px text-[11px] font-semibold text-green">
      Active
    </span>
  ) : (
    <span className="rounded-md border border-border bg-panel-2 px-1.5 py-px text-[11px] font-semibold text-text-3">
      Paused
    </span>
  );
