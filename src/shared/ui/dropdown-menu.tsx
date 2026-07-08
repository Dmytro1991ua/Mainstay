import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";

import { cn } from "@/shared/lib/utils";

import type * as React from "react";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export function DropdownMenuContent({
  className,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[210px] overflow-hidden rounded-xl border border-border bg-panel p-1.5 text-text shadow-lg",
          "origin-[--radix-dropdown-menu-content-transform-origin]",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-text-2 outline-none select-none",
        "transition-colors focus:bg-panel-2 focus:text-text",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-text-3",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "px-2.5 py-1.5 text-xs font-medium text-text-3 uppercase tracking-wide",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn("-mx-1.5 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}
