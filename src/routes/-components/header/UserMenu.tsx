import { Link } from "@tanstack/react-router";
import { ChevronDown, LogOut, Settings } from "lucide-react";

import { useLogout } from "@/features/auth";
import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/stores/auth-store";
import { Avatar } from "@/shared/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export const UserMenu = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  const initials = user?.userName.slice(0, 2).toUpperCase() ?? "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-lg border border-border-2 bg-panel py-1 pr-2 pl-1 text-left outline-none",
            "transition-colors hover:bg-panel-2 focus-visible:ring-2 focus-visible:ring-ring/50",
            "aria-expanded:bg-panel-2",
          )}
        >
          <Avatar initials={initials} className="size-7" />
          <span className="hidden max-w-30 truncate text-[13px] font-medium text-text sm:block">
            {user?.userName}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-text-3" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <div className="px-2.5 py-1.5">
          <div className="truncate text-[13px] font-semibold text-text">{user?.userName}</div>
          <div className="truncate text-[11px] text-text-3">{user?.roles.join(", ")}</div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <Settings />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => logout.mutate()}
          disabled={logout.isPending}
          className="text-destructive focus:bg-destructive/10 focus:text-destructive [&_svg]:text-destructive"
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
