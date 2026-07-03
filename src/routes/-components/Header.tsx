import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { ThemeToggleCycle } from "@/shared/ui/theme-toggle-cycle";

import { useHeader } from "./use-header";

export const Header = () => {
  const { title, logout } = useHeader();

  return (
    <header
      className={cn("flex h-14.25 shrink-0 items-center gap-3 border-b border-border bg-bg px-pad")}
    >
      <h1 className={cn("text-[15.5px] font-semibold")}>{title}</h1>
      <div className={cn("flex-1")} />
      <ThemeToggleCycle />
      <Button
        variant="default"
        className="bg-accent text-on-accent hover:bg-accent/85"
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
      >
        Log out
      </Button>
    </header>
  );
};
