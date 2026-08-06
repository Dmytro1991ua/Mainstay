import { PackagePlus } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";

import type { InventoryItem } from "../api/inventory.api";

type RestockDialogProps = {
  target: InventoryItem | null;
  quantityToAdd: number;
  onQuantityChange: (value: number) => void;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isRestocking: boolean;
};

export const RestockDialog = ({
  target,
  quantityToAdd,
  onQuantityChange,
  onConfirm,
  onClose,
  isRestocking,
}: RestockDialogProps) => (
  <Dialog open={target !== null} onOpenChange={(open) => !open && onClose()}>
    <DialogContent>
      <DialogBody className="flex flex-col items-center gap-3 pb-2 pt-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-panel-2">
          <PackagePlus className="size-5 text-accent" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <DialogTitle>Restock &ldquo;{target?.name}&rdquo;</DialogTitle>
          <DialogDescription>
            Current quantity: <strong className="font-medium text-text">{target?.quantity}</strong>.
            Enter the amount to add.
          </DialogDescription>
        </div>
        <Input
          type="number"
          min={1}
          value={quantityToAdd}
          onChange={(e) => onQuantityChange(Math.max(1, Number(e.target.value)))}
          className="mt-1 w-32 text-center"
          disabled={isRestocking}
        />
      </DialogBody>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" onClick={onClose} disabled={isRestocking}>
            Cancel
          </Button>
        </DialogClose>
        <Button onClick={onConfirm} disabled={isRestocking || quantityToAdd < 1}>
          {isRestocking ? "Restocking…" : "Restock"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
