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
          "flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-[9px]",
          isInverted ? "border border-white/25 bg-white/15" : "bg-accent",
        )}
      >
        <ClipboardCheck
          className={cn("h-[19px] w-[19px]", isInverted ? "text-white" : "text-on-accent")}
          strokeWidth={2}
        />
      </div>
      {showLabel && (
        <span
          className={cn(
            "text-lg font-semibold tracking-tight",
            isInverted ? "text-white" : "text-text",
          )}
        >
          Mainstay
        </span>
      )}
    </div>
  );
};
