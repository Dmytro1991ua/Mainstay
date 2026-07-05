import { Popover as PopoverPrimitive } from "radix-ui";

import { cn } from "@/shared/lib/utils";

import type * as React from "react";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;

export function PopoverContent({
  className,
  align = "start",
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 rounded-xl border border-border bg-panel p-2 text-text shadow-lg outline-none",
          "origin-[--radix-popover-content-transform-origin]",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
