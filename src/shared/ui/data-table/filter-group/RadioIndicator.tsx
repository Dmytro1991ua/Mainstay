import { cn } from "@/shared/lib/utils";

export const RadioIndicator = ({ isSelected }: { isSelected: boolean }) => (
  <span
    className={cn(
      "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-border",
      isSelected && "border-accent bg-accent",
    )}
  >
    {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
  </span>
);
