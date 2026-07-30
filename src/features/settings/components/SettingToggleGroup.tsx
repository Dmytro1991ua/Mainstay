import { cn } from "@/shared/lib/utils";

import type { SettingOption } from "../config";

type SettingToggleGroupProps<T extends string> = {
  options: SettingOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export const SettingToggleGroup = <T extends string>({
  options,
  value,
  onChange,
}: SettingToggleGroupProps<T>) => (
  <div className="inline-flex gap-0.5 rounded-[9px] border border-border-2 bg-panel-3 p-[3px]">
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={cn(
          "rounded-[6px] px-3 py-1.5 text-[13px] font-medium transition-colors",
          opt.value === value
            ? "border border-border bg-panel text-text shadow-sm"
            : "text-text-2 hover:text-text",
        )}
      >
        {opt.label}
      </button>
    ))}
  </div>
);
