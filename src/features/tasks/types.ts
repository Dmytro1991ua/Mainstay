import type { Task } from "./api/tasks.api";

export type SheetMode = { type: "add" } | { type: "edit"; task: Task };
