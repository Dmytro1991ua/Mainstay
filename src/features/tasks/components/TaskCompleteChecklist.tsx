import { AlertTriangle, Loader2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";

type TaskCompleteChecklistProps = {
  items: string[];
  checkedItems: Set<string>;
  allChecked: boolean;
  isLoading: boolean;
  onToggle: (item: string) => void;
};

export const TaskCompleteChecklist = ({
  items,
  checkedItems,
  allChecked,
  isLoading,
  onToggle,
}: TaskCompleteChecklistProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-text-3">
        <Loader2 className="size-3.5 animate-spin" />
        Loading checklist…
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="text-sm text-text-3">No checklist items for this category.</p>;
  }

  return (
    <>
      <ul className="flex flex-col gap-1">
        {items.map((item) => {
          const checked = checkedItems.has(item);
          return (
            <li key={item}>
              <label className="flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-panel-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(item)}
                  className="mt-0.5 size-4 shrink-0 cursor-pointer accent-accent"
                />
                <span className={cn("text-sm", checked && "text-text-3 line-through")}>{item}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {!allChecked && (
        <p className="mt-2 flex items-center gap-1 text-xs text-amber">
          <AlertTriangle className="size-3.5 shrink-0" />
          All items must be checked before completing.
        </p>
      )}
    </>
  );
};
