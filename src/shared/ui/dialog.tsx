import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/shared/lib/utils";

import { Button } from "./button";

import type * as React from "react";

// ─── Primitives ──────────────────────────────────────────────────────────────

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

// ─── Overlay ─────────────────────────────────────────────────────────────────

export function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/40",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        "data-[state=open]:duration-150 data-[state=closed]:duration-200",
        className,
      )}
      {...props}
    />
  );
}

// ─── Content ─────────────────────────────────────────────────────────────────

export function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col",
          "rounded-xl border border-border bg-panel shadow-card-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
          "data-[state=open]:duration-200 data-[state=closed]:duration-150",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className={cn(
            "absolute top-4 right-4 flex size-7 shrink-0 items-center justify-center rounded-lg text-text-3",
            "transition-colors hover:bg-panel-2 hover:text-text",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
          )}
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

// ─── Layout slots ─────────────────────────────────────────────────────────────

export function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-1 border-b border-border px-5 py-4", className)}
      {...props}
    />
  );
}

export function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-5 py-4", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2.5 border-t border-border px-5 py-4",
        className,
      )}
      {...props}
    />
  );
}

// ─── ConfirmDialog ────────────────────────────────────────────────────────────

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  /** May be async; a rejected promise is swallowed here (callers surface their own error toast). */
  onConfirm: () => void | Promise<unknown>;
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  icon,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
}: ConfirmDialogProps) {
  const centered = !!icon;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogBody
          className={cn("flex flex-col gap-3 pb-2 pt-8", centered && "items-center text-center")}
        >
          {icon && (
            <div className="flex size-12 items-center justify-center rounded-full bg-panel-2">
              {icon}
            </div>
          )}
          <div className={cn("flex flex-col gap-1", centered && "items-center")}>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={() => void Promise.resolve(onConfirm()).catch(() => {})}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Title / Description ──────────────────────────────────────────────────────

export function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-[15px] font-semibold text-text", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description className={cn("text-sm text-text-3", className)} {...props} />
  );
}
