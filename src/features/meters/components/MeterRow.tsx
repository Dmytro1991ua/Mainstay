import { ChevronDown, ChevronRight, Gauge } from "lucide-react";
import { useState } from "react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { RowActions } from "@/shared/ui/row-actions";
import { BASE_BTN } from "@/shared/ui/row-actions/config";
import { formatReading, formatTimeAgo } from "@/shared/utils";

import { MeterReadingHistory } from "./MeterReadingHistory";

import type { Meter } from "../api/meters.api";

type MeterRowProps = {
  meter: Meter;
  canManage: boolean;
  /** What this meter is driving, e.g. "Oil change · due at 1,250 hours · 10 hours to go". */
  serviceLines: string[];
  onRecord: (meter: Meter) => void;
  onEdit: (meter: Meter) => void;
  onDelete: (meter: Meter) => void;
};

export const MeterRow = ({
  meter,
  canManage,
  serviceLines,
  onRecord,
  onEdit,
  onDelete,
}: MeterRowProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const ToggleIcon = isOpen ? ChevronDown : ChevronRight;

  return (
    <li>
      <div className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-panel-2">
        <button
          type="button"
          aria-expanded={isOpen}
          title={`${isOpen ? "Hide" : "Show"} reading history`}
          onClick={() => setIsOpen((open) => !open)}
          // BASE_BTN hides the button until hover (for row actions); the expand arrow must always show.
          className={cn(BASE_BTN, "visible hover:bg-panel-2 hover:text-text")}
        >
          <ToggleIcon className="size-3.5" />
          <span className="sr-only">
            {isOpen ? "Hide" : "Show"} reading history for {meter.name}
          </span>
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-text">{meter.name}</p>
          <p className="text-xs text-text-3">Last reading {formatTimeAgo(meter.lastReadingAt)}</p>
          {serviceLines.map((line) => (
            <p key={line} className="truncate text-xs text-text-2">
              {line}
            </p>
          ))}
        </div>
        <span className="shrink-0 text-sm font-medium tabular-nums text-text">
          {formatReading(meter.currentReading, meter.unit)}
        </span>
        <Button variant="outline" size="sm" onClick={() => onRecord(meter)}>
          <Gauge className="size-3.5" />
          Record reading
        </Button>
        {canManage && (
          <RowActions
            label={meter.name}
            onEdit={() => onEdit(meter)}
            onDelete={() => onDelete(meter)}
          />
        )}
      </div>
      {isOpen && <MeterReadingHistory meter={meter} />}
    </li>
  );
};
