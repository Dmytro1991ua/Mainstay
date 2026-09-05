import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/ui/chart";

import { THROUGHPUT_CHART_CONFIG } from "../config";
import { formatBucketLabel } from "../utils";

import type { ThroughputBucket, ThroughputGranularity } from "../api/reports.api";

type ThroughputChartProps = {
  series: ThroughputBucket[];
  groupBy: ThroughputGranularity;
};

export const ThroughputChart = ({ series, groupBy }: ThroughputChartProps) => {
  const data = series.map((bucket) => ({
    ...bucket,
    label: formatBucketLabel(bucket.bucket, groupBy),
  }));

  return (
    <ChartContainer config={THROUGHPUT_CHART_CONFIG} className="h-64 w-full">
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={28} allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="created" fill="var(--color-created)" radius={4} />
        <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};
