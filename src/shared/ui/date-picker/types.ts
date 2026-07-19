import type { DateRange } from "react-day-picker";

export type { DateRange };

export type DatePickerBaseProps = {
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  disablePast?: boolean;
};

export type SingleProps = {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
};

export type RangeProps = {
  mode: "range";
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
};

export type DatePickerProps = DatePickerBaseProps & (SingleProps | RangeProps);
