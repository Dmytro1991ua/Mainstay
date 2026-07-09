import { Check, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";

import { cn } from "@/shared/lib/utils";

import type * as React from "react";

// ─── Option types ────────────────────────────────────────────────────────────

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type SelectOptionGroup = {
  label: string;
  options: SelectOption[];
  /** Render a separator after this group */
  separator?: boolean;
};

// ─── Primitives ──────────────────────────────────────────────────────────────

export const SelectRoot = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({
  className,
  size = "default",
  error,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default" | "lg";
  error?: boolean;
}) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-panel text-sm text-text shadow-sm transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[placeholder]:text-text-3",
        error && "border-red focus:ring-red/30",
        size === "sm" && "h-8 px-3 py-1.5 text-xs",
        size === "default" && "h-10 px-3 py-2",
        size === "lg" && "h-11 px-4 py-2.5",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronsUpDown className="size-4 shrink-0 text-text-3" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn("flex cursor-default items-center justify-center py-1 text-text-3", className)}
      {...props}
    >
      <ChevronUp className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

export function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn("flex cursor-default items-center justify-center py-1 text-text-3", className)}
      {...props}
    >
      <ChevronDown className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        className={cn(
          "relative z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-border bg-panel text-text shadow-card-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
          className,
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1.5",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn(
        "px-2 py-1.5 text-xs font-semibold tracking-wide text-text-3 uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-lg py-2 pl-8 pr-2 text-sm text-text-2 outline-none",
        "transition-colors focus:bg-panel-2 focus:text-text",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        "data-[state=checked]:text-text",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-3.5 text-accent" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={cn("-mx-1.5 my-1.5 h-px bg-border", className)}
      {...props}
    />
  );
}

// ─── Convenience wrapper ──────────────────────────────────────────────────────

type SelectProps = {
  options?: SelectOption[];
  groups?: SelectOptionGroup[];
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
  name?: string;
};

export function Select({
  options,
  groups,
  value,
  onValueChange,
  defaultValue,
  placeholder = "Select an option",
  disabled,
  error,
  size,
  className,
  name,
}: SelectProps) {
  return (
    <SelectRoot
      value={value}
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      disabled={disabled}
      name={name}
    >
      <SelectTrigger size={size} error={error} className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options?.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </SelectItem>
        ))}

        {groups?.map((group, i) => (
          <SelectPrimitive.Root key={group.label}>
            <SelectGroup>
              <SelectLabel>{group.label}</SelectLabel>
              {group.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
            {group.separator && i < groups.length - 1 && <SelectSeparator />}
          </SelectPrimitive.Root>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
