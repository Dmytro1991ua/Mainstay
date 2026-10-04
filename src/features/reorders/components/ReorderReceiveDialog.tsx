import { useState } from "react";

import { cn } from "@/shared/lib/utils";
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
import { FormField } from "@/shared/ui/form-field";
import { formatMoney, isValidMoneyInput, MONEY_INPUT_ERROR } from "@/shared/utils";

import { REORDER_ACTIONS } from "../config";

import type { ReceiveReorderInput, Reorder } from "../api/reorders.api";

type ReorderReceiveDialogProps = {
  target: Reorder | null;
  onConfirm: (payload: ReceiveReorderInput) => Promise<void>;
  onClose: () => void;
  isReceiving: boolean;
};

export const ReorderReceiveDialog = ({
  target,
  onConfirm,
  onClose,
  isReceiving,
}: ReorderReceiveDialogProps) => {
  const [price, setPrice] = useState("");

  const { icon: Icon, iconClass, title, confirmLabel, describe } = REORDER_ACTIONS.receive;

  // Optional field: blank is fine (receive without recording a price), but a typed value must be valid.
  const trimmed = price.trim();
  const isInvalid = trimmed !== "" && !isValidMoneyInput(trimmed);

  const handleClose = () => {
    setPrice("");
    onClose();
  };

  const handleConfirm = () => onConfirm(trimmed ? { receivedUnitCost: trimmed } : {});

  return (
    <Dialog open={target !== null} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent>
        <DialogBody className="flex flex-col items-center gap-3 pb-2 pt-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-panel-2">
            <Icon className={cn("size-5", iconClass)} />
          </div>
          <div className="flex flex-col items-center gap-1">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{target ? describe(target) : null}</DialogDescription>
          </div>
          <div className="w-full text-left">
            <FormField
              id="receive-unit-cost"
              label="Actual unit cost (optional)"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 8.50"
              value={price}
              onChange={setPrice}
              disabled={isReceiving}
              error={isInvalid ? MONEY_INPUT_ERROR : undefined}
              hint={
                target?.unitCostAtRaise != null
                  ? `Estimated at raise: ${formatMoney(target.unitCostAtRaise)} per unit`
                  : "No estimate was captured for this order."
              }
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose} disabled={isReceiving}>
              Back
            </Button>
          </DialogClose>
          <Button onClick={handleConfirm} disabled={isInvalid || isReceiving}>
            {isReceiving ? "Receiving…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
