import { Ban } from "lucide-react";

import { useCancelReason } from "@/features/tasks/hooks/use-cancel-reason";
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

type WorkOrderRejectDialogProps = {
  open: boolean;
  title: string;
  onConfirm: (reason: string) => Promise<void>;
  onClose: () => void;
  isRejecting: boolean;
};

export const WorkOrderRejectDialog = ({
  open,
  title,
  onConfirm,
  onClose,
  isRejecting,
}: WorkOrderRejectDialogProps) => {
  const { reason, setReason, isValid, handleClose, handleConfirm } = useCancelReason(
    onConfirm,
    onClose,
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent>
        <DialogBody className="flex flex-col items-center gap-3 pb-2 pt-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-panel-2">
            <Ban className="size-5 text-red" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <DialogTitle>Reject request</DialogTitle>
            <DialogDescription>
              <strong className="font-medium text-text">&ldquo;{title}&rdquo;</strong> will be
              rejected. The requester will see the reason below.
            </DialogDescription>
          </div>
          <div className="w-full text-left">
            <label htmlFor="reject-reason" className="mb-1.5 block text-sm font-medium text-text">
              Reason <span className="text-red">*</span>
            </label>
            <textarea
              id="reject-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isRejecting}
              placeholder="Explain why this request is being rejected…"
              maxLength={500}
              rows={3}
              className={cn(
                "w-full resize-none rounded-lg border border-border bg-panel px-3 py-2 text-sm text-text shadow-sm outline-none",
                "placeholder:text-text-3 focus:border-accent focus:ring-2 focus:ring-accent/50",
                "disabled:opacity-60",
              )}
            />
            <p className="mt-1 text-right text-xs text-text-3">{reason.length}/500</p>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose} disabled={isRejecting}>
              Back
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleConfirm} disabled={!isValid || isRejecting}>
            {isRejecting ? "Rejecting…" : "Reject request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
