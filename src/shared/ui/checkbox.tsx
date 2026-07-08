import { Checkbox as CheckboxPrimitive } from "radix-ui";

import { cn } from "@/shared/lib/utils";

export const Checkbox = ({
  className,
  checked,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) => (
  <CheckboxPrimitive.Root
    data-slot="checkbox"
    checked={checked}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-[4px] border border-border shadow-xs",
      "focus-visible:ring-accent/50 focus-visible:ring-[3px] focus-visible:outline-hidden",
      "data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-white",
      "data-[state=indeterminate]:border-accent data-[state=indeterminate]:bg-accent data-[state=indeterminate]:text-white",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "transition-colors",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      {checked === "indeterminate" ? (
        <svg className="h-2 w-2" viewBox="0 0 12 12" fill="none">
          <path d="M3 6h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        <svg className="h-2 w-2" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6l3 3 5-5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);
