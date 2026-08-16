import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Popover as PopoverPrimitive } from "radix-ui";
import InfiniteScroll from "react-infinite-scroll-component";

import { cn } from "@/shared/lib/utils";

import { useCombobox } from "./use-combobox";

import type * as React from "react";

export type ComboboxOption = {
  value: string;
  label: string;
  meta?: Record<string, unknown>;
};

type InfiniteComboboxProps = {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  error?: boolean;
  renderOption?: (opt: ComboboxOption) => React.ReactNode;
};

export const InfiniteCombobox = ({
  options,
  value,
  onValueChange,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  disabled,
  error,
  renderOption,
}: InfiniteComboboxProps) => {
  const {
    open,
    search,
    setSearch,
    scrollContainerId,
    filtered,
    selected,
    handleOpenChange,
    handleSelect,
  } = useCombobox({ options, value, onValueChange });

  const renderOptionItem = (opt: ComboboxOption) => (
    <button
      key={opt.value}
      type="button"
      onClick={() => handleSelect(opt.value)}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-lg py-2 pl-8 pr-2 text-sm text-text-2 outline-none transition-colors",
        "hover:bg-panel-2 hover:text-text",
        value === opt.value && "text-text",
      )}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        {value === opt.value && <Check className="size-3.5 text-accent" />}
      </span>
      {renderOption ? renderOption(opt) : opt.label}
    </button>
  );

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-expanded={open}
          className={cn(
            "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-border bg-panel px-3 py-2 text-sm shadow-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            selected ? "text-text" : "text-text-3",
            error && "border-red focus:ring-red/30",
          )}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <ChevronsUpDown className="size-4 shrink-0 text-text-3" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className={cn(
            "z-50 w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-xl border border-border bg-panel text-text shadow-card-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          )}
        >
          <div className="border-b border-border px-2 py-1.5">
            <input
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent px-1 py-1 text-sm text-text outline-none placeholder:text-text-3"
              autoComplete="off"
            />
          </div>

          <div
            id={scrollContainerId}
            className="max-h-52 overflow-y-auto p-1.5"
            onWheel={(e) => e.stopPropagation()}
          >
            {search ? (
              <>
                {filtered.length === 0 && (
                  <p className="py-2 text-center text-sm text-text-3">No results</p>
                )}
                {filtered.map((opt) => renderOptionItem(opt))}
              </>
            ) : (
              <InfiniteScroll
                dataLength={options.length}
                next={fetchNextPage ?? (() => {})}
                hasMore={hasNextPage ?? false}
                loader={
                  <div className="flex justify-center py-1">
                    <Loader2 className="size-3.5 animate-spin text-text-3" />
                  </div>
                }
                scrollableTarget={scrollContainerId}
                style={{ overflow: "visible" }}
              >
                {options.length === 0 && !isFetchingNextPage && (
                  <p className="py-2 text-center text-sm text-text-3">No results</p>
                )}
                {options.map((opt) => renderOptionItem(opt))}
              </InfiniteScroll>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};
