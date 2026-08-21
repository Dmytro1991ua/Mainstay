import { useState } from "react";

import type { Task } from "../api/tasks.api";

export const useTaskComplete = () => {
  const [taskToComplete, setTaskToComplete] = useState<Task | null>(null);

  return {
    taskToComplete,
    openComplete: (task: Task) => setTaskToComplete(task),
    closeComplete: () => setTaskToComplete(null),
  };
};
