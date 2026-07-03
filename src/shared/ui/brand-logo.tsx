import { ClipboardCheck } from "lucide-react";

import { cn } from "@/shared/lib/utils";

type BrandLogoProps = {
  /**
   * "inverted" — glass-effect icon box, white text: for dark/gradient backgrounds (auth panel).
   * "default"  — accent-colored icon box, themed text: for light surfaces (sidebar).
   */
  variant?: "default" | "inverted";
  showLabel?: boolean;
  className?: string;
};

export const BrandLogo = ({ variant = "default", showLabel = true, className }: BrandLogoProps) => {
  const isInverted = variant === "inverted";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "relative z-10 flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-[9px]",
          isInverted ? "border border-white/25 bg-white/15" : "bg-accent",
        )}
      >
        <ClipboardCheck
          className={cn("h-4.75 w-4.75", isInverted ? "text-white" : "text-on-accent")}
          strokeWidth={2}
        />
      </div>
      <span
        className={cn(
          "shrink-0 whitespace-nowrap text-lg font-semibold tracking-tight",
          "transition-[opacity,translate] duration-300 ease-in-out",
          isInverted ? "text-white" : "text-text",
          showLabel ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0",
        )}
      >
        Mainstay
      </span>
    </div>
  );
};
