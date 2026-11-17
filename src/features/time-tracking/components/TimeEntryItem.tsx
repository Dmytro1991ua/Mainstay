import { Trash2 } from "lucide-react";

import { formatCalendarDate } from "@/shared/ui/date-picker";
import { formatMoney, formatUserName } from "@/shared/utils";

import { formatMinutes } from "../utils";

import type { TimeEntry } from "../api/time-entries.api";

type TimeEntryItemProps = {
  entry: TimeEntry;
  canDelete: boolean;
  onDelete: (entry: TimeEntry) => void;
};

export const TimeEntryItem = ({ entry, canDelete, onDelete }: TimeEntryItemProps) => (
  <li className="flex items-start gap-3 py-3">
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-x-2">
        <span className="text-sm font-medium text-text tabular-nums">
          {formatMinutes(entry.minutes)}
        </span>
        <span className="truncate text-xs text-text-3">
          {entry.user ? formatUserName(entry.user.userName) : "Removed user"} ·{" "}
          {formatCalendarDate(entry.workedOn)}
        </span>
        {entry.cost != null && (
          <span className="ml-auto text-xs text-text-2 tabular-nums">
            {formatMoney(entry.cost)}
          </span>
        )}
      </div>
      {entry.note && (
        <p className="mt-0.5 text-sm break-words whitespace-pre-wrap text-text-2">{entry.note}</p>
      )}
    </div>
    {canDelete && (
      <button
        type="button"
        onClick={() => onDelete(entry)}
        className="flex size-6 shrink-0 items-center justify-center rounded text-text-3 transition-colors hover:bg-red-soft hover:text-red"
        aria-label="Delete time entry"
      >
        <Trash2 className="size-3.5" />
      </button>
    )}
  </li>
);
