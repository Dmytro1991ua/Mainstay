import { useState } from "react";

import type { DateRange } from "@/shared/ui/date-picker";

import { getDefaultSpendRange, toApiDate } from "../utils";

import type { SpendGranularity, SpendParams } from "../api/reports.api";

export const useSpendControls = () => {
  const [range, setRange] = useState<DateRange | undefined>(getDefaultSpendRange);
  const [groupBy, setGroupBy] = useState<SpendGranularity>("month");

  const params: SpendParams = {
    from: range?.from && toApiDate(range.from),
    to: range?.to && toApiDate(range.to),
    groupBy,
  };

  return { range, setRange, groupBy, setGroupBy, params };
};
