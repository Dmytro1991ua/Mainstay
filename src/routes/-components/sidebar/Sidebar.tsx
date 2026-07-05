import { Link } from "@tanstack/react-router";
import { ChevronLeft, LogOut } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { BrandLogo } from "@/shared/ui/brand-logo";

import { useSidebar } from "./use-sidebar";

export const Sidebar = () => {
  const { collapsed, toggleSidebar, visibleItems, user, initials, logout } = useSidebar();

  return (
    <aside
      className={cn(
        "relative z-10 flex h-screen shrink-0 flex-col",
        "border-r border-border bg-panel",
        "transition-[width] duration-300 ease-in-out",
      )}
      style={{ width: collapsed ? 64 : 220 }}
    >
      <button
        type="button"
        onClick={toggleSidebar}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={cn(
          "absolute -right-3.25 top-11 z-50",
          "flex h-6.5 w-6.5 items-center justify-center rounded-full",
          "border border-border bg-panel text-text-3 shadow-sm",
          "transition-colors hover:border-border-2 hover:text-text",
        )}
      >
        <ChevronLeft
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-300 ease-in-out",
            collapsed && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "flex h-14.25 shrink-0 items-center overflow-x-hidden border-b border-border pl-3.5",
        )}
      >
        <BrandLogo showLabel={!collapsed} className="min-w-0 flex-1" />
      </div>

      <nav className={cn("flex flex-1 flex-col gap-0.5 overflow-x-hidden overflow-y-auto p-2.5")}>
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={cn(
              "flex items-center overflow-hidden rounded-lg py-2 text-sm font-medium text-text-2",
              "transition-colors hover:bg-panel-2 hover:text-text",
            )}
            activeProps={{ className: "bg-accent-soft text-accent" }}
          >
            <span className={cn("relative z-10 flex w-10 shrink-0 items-center justify-center")}>
              <Icon className="h-4.5 w-4.5" />
            </span>
            <span
              className={cn(
                "shrink-0 whitespace-nowrap transition-[opacity,translate] duration-300 ease-in-out",
                collapsed ? "-translate-x-3 opacity-0" : "translate-x-0 opacity-100",
              )}
            >
              {label}
            </span>
          </Link>
        ))}
      </nav>

      <div className={cn("shrink-0 overflow-x-hidden border-t border-border")}>
        <button
          type="button"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          title="Log out"
          aria-label="Log out"
          className={cn(
            "group flex w-full items-center overflow-hidden px-2.5 py-3 text-left outline-none",
            "transition-colors hover:bg-panel-2 focus-visible:bg-panel-2 disabled:opacity-60",
          )}
        >
          <span className={cn("relative z-10 flex w-10 shrink-0 items-center justify-center")}>
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                "bg-accent-soft text-xs font-semibold text-accent",
              )}
            >
              {initials}
            </div>
          </span>
          <div
            className={cn(
              "shrink-0 whitespace-nowrap transition-[opacity,translate] duration-300 ease-in-out",
              collapsed ? "-translate-x-3 opacity-0" : "translate-x-0 opacity-100",
            )}
          >
            <div className={cn("text-[13px] font-semibold leading-tight text-text")}>
              {user?.userName}
            </div>
            <div className={cn("text-[11px] leading-tight text-text-3")}>
              {user?.roles.join(", ")}
            </div>
          </div>
          <LogOut
            className={cn(
              "ml-auto h-4 w-4 shrink-0 text-text-3 transition-[opacity,translate] duration-300 ease-in-out",
              "group-hover:text-destructive",
              collapsed ? "-translate-x-3 opacity-0" : "translate-x-0 opacity-100",
            )}
          />
        </button>
      </div>
    </aside>
  );
};
