import { X } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";

import { cn } from "@/shared/lib/utils";

import type * as React from "react";

// ─── Primitives ──────────────────────────────────────────────────────────────

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;

// ─── Overlay ─────────────────────────────────────────────────────────────────

export function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
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

type SheetSide = "right" | "left" | "top" | "bottom";

const sideClasses: Record<SheetSide, string> = {
  right:
    "top-0 right-0 h-full w-[420px] max-w-[92vw] border-l border-border data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
  left: "top-0 left-0 h-full w-[420px] max-w-[92vw] border-r border-border data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
  top: "top-0 inset-x-0 border-b border-border data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
  bottom:
    "bottom-0 inset-x-0 border-t border-border data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
};

export function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & { side?: SheetSide }) {
  return (
    <SheetPrimitive.Portal>
      <SheetOverlay />
      <SheetPrimitive.Content
        className={cn(
          "fixed z-50 flex flex-col bg-panel shadow-card-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:duration-[240ms] data-[state=closed]:duration-200",
          sideClasses[side],
          className,
        )}
        {...props}
      >
        {children}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

// ─── Layout slots ─────────────────────────────────────────────────────────────

export function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-between border-b border-border px-5 py-[17px]",
        className,
      )}
      {...props}
    />
  );
}

export function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex-1 overflow-y-auto p-5", className)} {...props} />;
}

export function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-2.5 border-t border-border px-5 py-[15px]",
        className,
      )}
      {...props}
    />
  );
}

// ─── Title / Description ──────────────────────────────────────────────────────

export function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      className={cn("text-[15.5px] font-semibold text-text", className)}
      {...props}
    />
  );
}

export function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return <SheetPrimitive.Description className={cn("text-sm text-text-3", className)} {...props} />;
}

// ─── Close button ─────────────────────────────────────────────────────────────

export function SheetCloseButton({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <SheetPrimitive.Close asChild>
      <button
        className={cn(
          "flex size-[30px] shrink-0 items-center justify-center rounded-lg text-text-3",
          "transition-colors hover:bg-panel-2 hover:text-text",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
          className,
        )}
        {...props}
      >
        <X className="size-[17px]" />
        <span className="sr-only">Close</span>
      </button>
    </SheetPrimitive.Close>
  );
}

// ─── FormSheet ────────────────────────────────────────────────────────────────

type FormSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  side?: SheetSide;
};

export function FormSheet({ open, onClose, title, children, footer, side }: FormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetCloseButton />
        </SheetHeader>
        <SheetBody>{children}</SheetBody>
        <SheetFooter>{footer}</SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
