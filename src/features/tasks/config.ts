import { PillStatus } from "@/shared/ui/pill";

export const TASK_STATUS_PILL: Record<"OPEN" | "IN_PROGRESS" | "DONE", PillStatus> = {
  OPEN: PillStatus.Open,
  IN_PROGRESS: PillStatus.InProgress,
  DONE: PillStatus.Done,
};
