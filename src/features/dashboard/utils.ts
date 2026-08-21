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
