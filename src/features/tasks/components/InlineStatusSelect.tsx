import { ChevronDown, Loader2 } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";

import { cn } from "@/shared/lib/utils";
import { SelectContent, SelectItem } from "@/shared/ui/select";

import { TASK_STATUS_OPTIONS } from "../config";
import { useInlineStatus } from "../hooks/use-inline-status";

import type { Task } from "../api/tasks.api";

export const InlineStatusSelect = ({ task }: { task: Task }) => {
  const { current, pillStatus, pillClass, dotClassName, isPending, handleChange } =
    useInlineStatus(task);

  return (
    <SelectPrimitive.Root value={current} onValueChange={handleChange} disabled={isPending}>
      <SelectPrimitive.Trigger
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "inline-flex w-30 cursor-pointer items-center justify-between rounded-full px-2 py-1 text-xs font-medium",
          "transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
          "disabled:pointer-events-none disabled:opacity-70",
          pillClass,
        )}
      >
        <span className="flex items-center gap-1 whitespace-nowrap">
          <span className="flex size-3 shrink-0 items-center justify-center" aria-hidden>
            {isPending ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <span className={cn("size-1.5 rounded-full", dotClassName)} />
            )}
          </span>
          {pillStatus}
        </span>
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="size-3 shrink-0 opacity-60" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectContent>
        {TASK_STATUS_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectPrimitive.Root>
  );
};
