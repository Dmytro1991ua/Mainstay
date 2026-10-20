import { Gauge } from "lucide-react";
import { useState } from "react";

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
import { formatReading } from "@/shared/utils";

import { getReadingError } from "../validation";

import type { Meter } from "../api/meters.api";

type RecordReadingDialogProps = {
  target: Meter | null;
  onConfirm: (value: number) => Promise<void>;
  onClose: () => void;
  isRecording: boolean;
};

export const RecordReadingDialog = ({
  target,
  onConfirm,
  onClose,
  isRecording,
}: RecordReadingDialogProps) => {
  const [value, setValue] = useState("");

  const trimmed = value.trim();
  const error = target ? getReadingError(value, target.currentReading, target.unit) : undefined;
  const canSubmit = trimmed !== "" && !error;

  const handleClose = () => {
    setValue("");
    onClose();
  };

  // The server does not coerce strings, so send a real number.
  const handleConfirm = () => onConfirm(Number(trimmed));

  return (
    <Dialog open={target !== null} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent>
        <DialogBody className="flex flex-col items-center gap-3 pb-2 pt-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-panel-2">
            <Gauge className="size-5 text-accent" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <DialogTitle>Record reading</DialogTitle>
            <DialogDescription>
              {target
                ? `${target.name} — current reading ${formatReading(target.currentReading, target.unit)}`
                : null}
            </DialogDescription>
          </div>
          <div className="w-full text-left">
            <FormField
              id="meter-new-reading"
              label={`New reading${target ? ` (${target.unit})` : ""}`}
              type="text"
              inputMode="numeric"
              placeholder={target ? String(target.currentReading) : undefined}
              value={value}
              onChange={setValue}
              disabled={isRecording}
              error={error}
              hint="Readings can only go up."
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose} disabled={isRecording}>
              Back
            </Button>
          </DialogClose>
          <Button onClick={handleConfirm} disabled={!canSubmit || isRecording}>
            {isRecording ? "Recording…" : "Record reading"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
