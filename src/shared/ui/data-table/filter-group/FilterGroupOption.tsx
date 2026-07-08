import { cn } from "@/shared/lib/utils";
import { Checkbox } from "@/shared/ui/checkbox";

import { RadioIndicator } from "./RadioIndicator";

import type { FilterOption } from "../types";

type FilterGroupOptionProps = {
  option: FilterOption;
  isSelected: boolean;
  type: "single" | "multi";
  onChange: (value: string) => void;
};

type IndicatorProps = { isSelected: boolean };

const SingleIndicator = ({ isSelected }: IndicatorProps) => (
  <RadioIndicator isSelected={isSelected} />
);

const MultiIndicator = ({ isSelected }: IndicatorProps) => (
  <Checkbox checked={isSelected} tabIndex={-1} aria-hidden="true" className="pointer-events-none" />
);

const FILTER_OPTION_INDICATOR: Record<"single" | "multi", React.ComponentType<IndicatorProps>> = {
  single: SingleIndicator,
  multi: MultiIndicator,
};

export const FilterGroupOption = ({
  option,
  isSelected,
  type,
  onChange,
}: FilterGroupOptionProps) => {
  const FilterOptionIndicator = FILTER_OPTION_INDICATOR[type];

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-left text-sm hover:bg-panel-2",
        isSelected && "text-accent",
      )}
      onClick={() => onChange(option.value)}
    >
      <FilterOptionIndicator isSelected={isSelected} />
      {option.label}
    </button>
  );
};
