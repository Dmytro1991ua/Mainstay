import { Tooltip as TooltipPrimitive } from "radix-ui";

import { cn } from "@/shared/lib/utils";

import type * as React from "react";

type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
};

export const Tooltip = ({ content, children, side = "top", className }: TooltipProps) => (
  <TooltipPrimitive.Root>
    <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        side={side}
        sideOffset={6}
        className={cn(
          "z-50 max-w-xs rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg",
          "animate-in fade-in-0 zoom-in-95 duration-100",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
          className,
        )}
      >
        {content}
        <TooltipPrimitive.Arrow className="fill-gray-900" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  </TooltipPrimitive.Root>
);

export const TooltipProvider = TooltipPrimitive.Provider;
