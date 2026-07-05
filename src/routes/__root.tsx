import { createRootRoute, Outlet } from "@tanstack/react-router";

import { bootstrapAuth } from "@/features/auth";
import { useThemeAttributes } from "@/shared/hooks/use-theme-attributes";
import { cn } from "@/shared/lib/utils";

const RootPending = () => (
  <div className={cn("flex h-screen items-center justify-center text-text-2")}>Loading…</div>
);

const RootComponent = () => {
  useThemeAttributes();
  return <Outlet />;
};

export const Route = createRootRoute({
  beforeLoad: () => bootstrapAuth(),
  pendingComponent: RootPending,
  pendingMs: 0,
  component: RootComponent,
});
