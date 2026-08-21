import { useQuery } from "@tanstack/react-query";

import { getChecklistTemplate } from "../api/tasks.api";

import type { TaskCategory } from "../api/tasks.api";

export const useChecklistTemplate = (category: TaskCategory | null | undefined) =>
  useQuery({
    queryKey: ["checklist-template", category],
    queryFn: () => getChecklistTemplate(category!),
    enabled: !!category,
    staleTime: Infinity,
  });
