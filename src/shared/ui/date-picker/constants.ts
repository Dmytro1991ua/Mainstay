import { cn } from "@/shared/lib/utils";

const NAV_BUTTON =
  "inline-flex size-7 items-center justify-center rounded-md border border-border bg-panel text-text-3 transition-colors hover:bg-panel-2 hover:text-text disabled:pointer-events-none disabled:opacity-40";

/**
 * react-day-picker v10 renders a real HTML table for the month grid:
 *   <div.months>
 *     <nav.nav>                    ← sibling of month divs (default layout)
 *     <div.month>
 *       <div.month_caption>
 *       <table.month_grid>
 *         <thead><tr.weekdays><th.weekday>
 *         <tbody.weeks><tr.week><td.day><button.day_button>
 *
 * Never apply flex/grid to <tr> or <td> — it overrides display:table-row/table-cell.
 * State classes (selected, today, …) land on the <td>, so use [&>button] to reach the button.
 */
export const calendarClassNames = {
  root: "w-full select-none",
  months: "flex flex-col",
  nav: "flex items-center justify-between mb-2",
  button_previous: NAV_BUTTON,
  button_next: NAV_BUTTON,
  chevron: "size-4 fill-current",
  month: "flex flex-col gap-3",
  month_caption: "text-center",
  caption_label: "text-sm font-medium text-text",
  month_grid: "w-full border-collapse",
  weekdays: "",
  weeks: "",
  weekday: "pb-1.5 text-center text-[11px] font-normal text-text-3",
  week: "",
  day: "p-0.5 text-center align-middle",
  day_button: cn(
    "inline-flex w-full h-9 items-center justify-center rounded-lg text-sm text-text-2 transition-colors cursor-pointer",
    "hover:bg-panel-2 hover:text-text",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
  ),
  // today uses :not([disabled]) → higher specificity than [&>button]; use text-white! to override
  selected: "[&>button]:bg-accent [&>button]:text-white! [&>button]:hover:bg-accent/90",
  today: "[&>button:not([disabled])]:font-semibold [&>button:not([disabled])]:text-accent",
  outside: "opacity-40 pointer-events-none",
  disabled: "[&>button]:pointer-events-none [&>button]:opacity-30",
  range_start: "[&>button]:rounded-r-none",
  range_end: "[&>button]:rounded-l-none",
  range_middle:
    "bg-accent/10 [&>button]:rounded-none [&>button]:text-text [&>button]:hover:bg-accent/15",
  hidden: "invisible",
  focused: "[&>button]:ring-2 [&>button]:ring-accent/50",
};
