import { CalendarIcon } from "lucide-react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { useState } from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/shared/lib/utils";

import { calendarClassNames } from "./constants";
import { getDatePickerLabel, hasDatePickerValue } from "./utils";

import type { DatePickerProps, DateRange, RangeProps, SingleProps } from "./types";

export const DatePicker = ({
  mode = "single",
  selected,
  onSelect,
  disabled,
  error,
  disablePast,
  placeholder = "Pick a date",
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  const label = getDatePickerLabel(mode, selected, placeholder);
  const valued = hasDatePickerValue(mode, selected);
  const disabledMatcher = disablePast ? { before: new Date() } : undefined;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-expanded={open}
          className={cn(
            "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-border bg-panel px-3 py-2 text-sm shadow-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            valued ? "text-text" : "text-text-3",
            error && "border-red focus:ring-red/30",
          )}
        >
          <span className="truncate">{label}</span>
          <CalendarIcon className="size-4 shrink-0 text-text-3" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          style={{ minWidth: "var(--radix-popover-trigger-width)" }}
          className={cn(
            "z-50 rounded-xl border border-border bg-panel p-3 text-text shadow-card-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          )}
        >
          {mode === "range" ? (
            <DayPicker
              mode="range"
              selected={selected as DateRange | undefined}
              onSelect={(range) => (onSelect as RangeProps["onSelect"])?.(range)}
              numberOfMonths={2}
              disabled={disabledMatcher}
              classNames={calendarClassNames}
            />
          ) : (
            <DayPicker
              mode="single"
              selected={selected as Date | undefined}
              onSelect={(date) => {
                (onSelect as SingleProps["onSelect"])?.(date);
                setOpen(false);
              }}
              disabled={disabledMatcher}
              classNames={calendarClassNames}
            />
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};
