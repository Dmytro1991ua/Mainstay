import { cn } from "@/shared/lib/utils";
import { ThemeToggleCycle } from "@/shared/ui/theme-toggle-cycle";

import { Breadcrumbs } from "./Breadcrumbs";
import { HeaderSearch } from "./HeaderSearch";
import { UserMenu } from "./UserMenu";

export const Header = () => {
  return (
    <header
      className={cn("flex h-14.25 shrink-0 items-center gap-3 border-b border-border bg-bg px-pad")}
    >
      <Breadcrumbs />
      <div className={cn("flex flex-1 justify-center")}>
        <HeaderSearch />
      </div>
      <ThemeToggleCycle />
      <UserMenu />
    </header>
  );
};
