import { cn } from "@/shared/lib/utils";
import { ThemeToggleCycle } from "@/shared/ui/theme-toggle-cycle";

import { useHeader } from "./use-header";
import { UserMenu } from "./UserMenu";

export const Header = () => {
  const { title } = useHeader();

  return (
    <header
      className={cn(
        "flex h-14.25 shrink-0 items-center gap-3 border-b border-border bg-panel px-pad",
      )}
    >
      <h1 className={cn("text-[15.5px] font-semibold")}>{title}</h1>
      <div className={cn("flex-1")} />
      <ThemeToggleCycle />
      <UserMenu />
    </header>
  );
};
