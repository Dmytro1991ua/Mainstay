import { ChevronDown, Loader2 } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";

import { cn } from "@/shared/lib/utils";
import { SelectContent, SelectItem } from "@/shared/ui/select";

import { ROLE_BADGE_CONFIG, ROLE_OPTIONS } from "../config";
import { useInlineRole } from "../hooks/use-inline-role";

import type { UserRole } from "../api/users-api";

type Props = { userId: string; role: UserRole };

export const InlineRoleSelect = ({ userId, role }: Props) => {
  const { current, isPending, handleChange } = useInlineRole(userId, role);

  const { label, classes } = ROLE_BADGE_CONFIG[current];

  return (
    <SelectPrimitive.Root value={current} onValueChange={handleChange} disabled={isPending}>
      <SelectPrimitive.Trigger
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1 rounded-[7px] border px-2.5 py-1 text-[11.5px] font-semibold",
          "transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
          "disabled:pointer-events-none disabled:opacity-70",
          classes,
        )}
      >
        {isPending && (
          <span className="flex size-3 shrink-0 items-center justify-center" aria-hidden>
            <Loader2 className="size-3 animate-spin" />
          </span>
        )}
        <SelectPrimitive.Value>{label}</SelectPrimitive.Value>
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="size-3 shrink-0 opacity-60" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectContent>
        {ROLE_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectPrimitive.Root>
  );
};
