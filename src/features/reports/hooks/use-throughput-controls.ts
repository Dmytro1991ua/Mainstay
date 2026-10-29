import { useState } from "react";

import type { DateRange } from "@/shared/ui/date-picker";

import { getDefaultRange, toApiDate } from "../utils";

import type { ThroughputGranularity, ThroughputParams } from "../api/reports.api";

export const useThroughputControls = () => {
  const [range, setRange] = useState<DateRange | undefined>(getDefaultRange);
  const [groupBy, setGroupBy] = useState<ThroughputGranularity>("week");

  const params: ThroughputParams = {
    from: range?.from && toApiDate(range.from),
    to: range?.to && toApiDate(range.to),
    groupBy,
  };

  return { range, setRange, groupBy, setGroupBy, params };
};
