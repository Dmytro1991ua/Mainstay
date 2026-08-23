import type { RecurringTask } from "./api/recurring-tasks.api";

export type SheetMode = { type: "add" } | { type: "edit"; schedule: RecurringTask };

export type ActiveFilter = "all" | "active" | "paused";
