import { isTaskClosedStatus } from "../tasks/utils";

import type { Task } from "./api/dashboard-api";

export { isTaskClosedStatus };

export const isTaskOverdue = (task: Task) =>
  !isTaskClosedStatus(task.status) && !!task.dueDate && new Date(task.dueDate) < new Date();

export const calculateStockStatus = (quantity: number, minStockLevel: number) => {
  const fillPercent =
    minStockLevel > 0 ? Math.min((quantity / (minStockLevel * 2)) * 100, 100) : 100;

  const isLowStock = quantity <= minStockLevel;

  return { fillPercent, isLowStock };
};

// Which stat cards a role sees — single source so the grid and its skeleton
// count agree without hard-coded numbers. Generic + arg-passed to avoid importing
// the card config here (that would create a configs → components → utils cycle).
export const getVisibleStatCards = <T extends { technicianHidden?: true }>(
  cards: readonly T[],
  isTechnician?: boolean,
): readonly T[] => (isTechnician ? cards.filter((c) => !c.technicianHidden) : cards);
