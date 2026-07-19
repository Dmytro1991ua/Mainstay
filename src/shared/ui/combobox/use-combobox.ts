import { useId, useState } from "react";

import type { ComboboxOption } from "./InfiniteCombobox";

type UseComboboxOptions = {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
};

export const useCombobox = ({ options, value, onValueChange }: UseComboboxOptions) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const uid = useId().replaceAll(":", "");
  const scrollContainerId = `combobox-scroll-${uid}`;

  const filtered = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const selected = options.find((o) => o.value === value);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);

    if (!next) setSearch("");
  };

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue);
    setOpen(false);
    setSearch("");
  };

  return {
    open,
    search,
    setSearch,
    scrollContainerId,
    filtered,
    selected,
    handleOpenChange,
    handleSelect,
  };
};
