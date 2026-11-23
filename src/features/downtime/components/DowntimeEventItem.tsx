import { Link } from "@tanstack/react-router";
import { format } from "date-fns";

import { cn } from "@/shared/lib/utils";
import { formatUserName } from "@/shared/utils";

import { DOWNTIME_REASON_LABELS } from "../config";
import { formatDowntimeDuration } from "../utils";

import type { DowntimeEvent } from "../api/downtime.api";

const formatDateTime = (iso: string) => format(new Date(iso), "MMM d, yyyy, h:mm a");

export const DowntimeEventItem = ({ event }: { event: DowntimeEvent }) => (
  <li className="flex flex-col gap-0.5 py-3">
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
  </li>
);
