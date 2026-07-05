/** A single choosable value within a filter dimension. */
export type FilterOption = {
  label: string;
  value: string;
};

/** checkbox = multi-select; radio = single-select (choosing an option replaces). */
export type FilterType = "checkbox" | "radio";

/** Declarative description of one filter dimension shown in the Filters popover. */
export type FilterConfig = {
  /** Stable key — also the URL param / query field this filter maps to. */
  key: string;
  label: string;
  type: FilterType;
  options: FilterOption[];
};

/** Selected values per filter key. Radio filters hold 0–1 values, checkbox 0–n. */
export type FilterValues = Record<string, string[]>;

/** Everything the Filters UI needs — passed as one `filters` prop to BaseTable. */
export type FiltersProp = {
  config: FilterConfig[];
  values: FilterValues;
  /** Toggle a value for a filter dimension (add/remove for checkbox, replace for radio). */
  onToggle: (key: string, value: string, type: FilterType) => void;
  onClear: (key: string) => void;
  onClearAll: () => void;
};
