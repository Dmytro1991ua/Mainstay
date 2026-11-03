import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/ui/chart";
import { formatMoney } from "@/shared/utils";

import { SPEND_CHART_CONFIG } from "../config";
import { formatBucketLabel, formatCompactMoney } from "../utils";

import type { SpendGranularity, SpendReport } from "../api/reports.api";

type SpendChartProps = {
  series: SpendReport["series"];
  groupBy: SpendGranularity;
};

export const SpendChart = ({ series, groupBy }: SpendChartProps) => {
  // Money arrives as a string; the chart needs a number to size the bars.
  const data = series.map((bucket) => ({
    spent: Number(bucket.spent),
    label: formatBucketLabel(bucket.bucket, groupBy),
  }));

  return (
    <ChartContainer config={SPEND_CHART_CONFIG} className="h-64 w-full">
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={48} tickFormatter={formatCompactMoney} />
        <ChartTooltip
          content={<ChartTooltipContent formatter={(value) => formatMoney(Number(value))} />}
        />
        <Bar dataKey="spent" fill="var(--color-spent)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};
