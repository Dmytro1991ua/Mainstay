import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { formatUserName } from "@/shared/utils";

import { DOWNTIME_REASON_LABELS } from "../config";
import { formatDowntimeDuration } from "../utils";

import type { DowntimeEvent } from "../api/downtime.api";

const formatDateTime = (iso: string) => format(new Date(iso), "MMM d, yyyy, h:mm a");

type DowntimeEventItemProps = {
  event: DowntimeEvent;
  canDelete: boolean;
  onDelete: (event: DowntimeEvent) => void;
};

export const DowntimeEventItem = ({ event, canDelete, onDelete }: DowntimeEventItemProps) => (
  <li className="flex items-start gap-3 py-3">
    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
      <div className="flex flex-wrap items-center gap-x-2">
        <span
          className={cn(
            "text-sm font-medium",
            event.reason === "BREAKDOWN" ? "text-red" : "text-text",
          )}
        >
          {DOWNTIME_REASON_LABELS[event.reason]}
        </span>
        <span className="text-sm tabular-nums text-text">
          {formatDowntimeDuration(event.durationMinutes)}
        </span>
        {event.endedAt === null && <span className="text-xs font-medium text-red">Ongoing</span>}
      </div>
      <p className="text-xs text-text-3">
        {formatDateTime(event.startedAt)} → {event.endedAt ? formatDateTime(event.endedAt) : "now"}
        {event.creator && ` · ${formatUserName(event.creator.userName)}`}
      </p>
      {event.note && (
        <p className="text-sm break-words whitespace-pre-wrap text-text-2">{event.note}</p>
      )}
      {event.taskId && (
        <Link
          to="/tasks/$taskId"
          params={{ taskId: event.taskId }}
          className="w-fit text-xs font-medium text-accent hover:underline"
        >
          View repair task
        </Link>
      )}
    </div>
    {canDelete && (
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => onDelete(event)}
        className="text-text-3 hover:bg-red-soft hover:text-red"
        aria-label="Delete downtime event"
      >
        <Trash2 className="size-3.5" />
      </Button>
    )}
  </li>
);
