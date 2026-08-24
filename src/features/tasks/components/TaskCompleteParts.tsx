import { AlertTriangle, Plus, Trash2 } from "lucide-react";

import type { InventoryItem } from "@/features/inventory/api/inventory.api";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

import type { PartEntry } from "../hooks/use-task-complete-sheet";

type TaskCompletePartsProps = {
  parts: PartEntry[];
  selectableItems: InventoryItem[];
  pickerItemId: string;
  pickerQty: number;
  onPickerItemChange: (id: string) => void;
  onPickerQtyChange: (qty: number) => void;
  onAddPart: () => void;
  onRemovePart: (idx: number) => void;
};

export const TaskCompleteParts = ({
  parts,
  selectableItems,
  pickerItemId,
  pickerQty,
  onPickerItemChange,
  onPickerQtyChange,
  onAddPart,
  onRemovePart,
}: TaskCompletePartsProps) => (
  <>
    <div className="flex min-w-0 gap-2">
      <select
        value={pickerItemId}
        onChange={(e) => onPickerItemChange(e.target.value)}
        className={cn(
          "min-w-0 flex-1 truncate rounded-lg border border-border bg-panel px-2.5 py-2 text-sm shadow-sm transition-colors outline-none",
          "focus:border-accent focus:ring-2 focus:ring-accent/50",
          !pickerItemId && "text-text-3",
        )}
      >
        <option value="">Select a part…</option>
        {selectableItems.map((item) => {
          const isLowStock = item.quantity > 0 && item.quantity <= item.minStockLevel;
          return (
            <option key={item.id} value={item.id}>
              {isLowStock ? `${item.name} ⚠️ Low stock` : item.name}
            </option>
          );
        })}
      </select>
      <input
        type="number"
        min={1}
        value={pickerQty}
        onChange={(e) => onPickerQtyChange(Math.max(1, Number(e.target.value)))}
        className={cn(
          "w-16 shrink-0 rounded-lg border border-border bg-panel px-2.5 py-2 text-sm shadow-sm outline-none",
          "focus:border-accent focus:ring-2 focus:ring-accent/50",
        )}
        placeholder="Qty"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAddPart}
        disabled={!pickerItemId}
        className="h-auto shrink-0 py-2"
      >
        <Plus className="size-3.5" />
        Add
      </Button>
    </div>

    {parts.length > 0 && (
      <ul className="mt-3 flex flex-col gap-1">
        {parts.map((part, idx) => (
          <li
            key={`${part.inventoryItemId}-${idx}`}
            className="flex items-center gap-2 rounded-lg bg-panel-2 px-3 py-2 text-sm"
          >
            <span className="flex-1 truncate text-text">{part.name}</span>
            {part.isLowStock && (
              <span className="flex shrink-0 items-center gap-1 text-xs text-amber">
                <AlertTriangle className="size-3" />
                Low stock
              </span>
            )}
            <span className="shrink-0 text-text-3">× {part.quantityUsed}</span>
            <button
              type="button"
              onClick={() => onRemovePart(idx)}
              className="flex size-5 shrink-0 items-center justify-center rounded text-text-3 transition-colors hover:bg-red-soft hover:text-red"
            >
              <Trash2 className="size-3" />
            </button>
          </li>
        ))}
      </ul>
    )}
  </>
);
