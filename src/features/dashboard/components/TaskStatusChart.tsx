import { PieChart as PieChartIcon } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/ui/chart";
import { EmptyState } from "@/shared/ui/empty-state";

import { TASK_CHART_CONFIG, TASK_CHART_LEGEND_CONFIG } from "./configs";

export type TaskStatusData = {
  open: number;
  inprogress: number;
  done: number;
};

export type TaskStatusChartProps = {
  data: TaskStatusData;
};

type DonutCenterLabelProps = {
  viewBox?: { cx?: number; cy?: number };
  total: number;
};

const DonutCenterLabel = ({ viewBox, total }: DonutCenterLabelProps) => {
  if (viewBox?.cx == null || viewBox?.cy == null) return null;
  const { cx, cy } = viewBox;
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
      <tspan x={cx} y={cy} style={{ fill: "var(--text)", fontSize: "1.5rem", fontWeight: 700 }}>
        {total}
      </tspan>
      <tspan x={cx} y={cy + 22} style={{ fill: "var(--text-3)", fontSize: "0.75rem" }}>
        total
      </tspan>
    </text>
  );
};

export const TaskStatusChart = ({ data }: TaskStatusChartProps) => {
  const total = data.open + data.inprogress + data.done;

  if (total === 0) {
    return (
      <EmptyState
        icon={PieChartIcon}
        message="No tasks to display."
        description="Task breakdown will appear once tasks are created."
      />
    );
  }

  const segments = TASK_CHART_LEGEND_CONFIG.map(({ key }) => ({
    status: key,
    count: data[key],
    fill: `var(--color-${key})`,
  }));

  return (
    <div>
      <ChartContainer config={TASK_CHART_CONFIG} className="mx-auto aspect-square max-h-45">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={segments}
            dataKey="count"
            nameKey="status"
            innerRadius={52}
            outerRadius={72}
            strokeWidth={0}
          >
            <Label content={<DonutCenterLabel total={total} />} />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="mt-2 flex flex-col divide-y divide-border">
        {TASK_CHART_LEGEND_CONFIG.map(({ key, label }) => {
          const count = data[key];
          const color = TASK_CHART_CONFIG[key].color;
          const pct = Math.round((count / total) * 100);
          return (
            <div key={key} className="flex items-center gap-3 py-2">
              <div className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: color }} />
              <span className="flex-1 text-[12px] text-text-2">{label}</span>
              <div className="h-1 w-16 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
              <span
                className="w-6 text-right text-[12px] font-semibold tabular-nums"
                style={{ color }}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
