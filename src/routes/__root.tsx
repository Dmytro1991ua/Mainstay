import { createRootRoute, Outlet } from "@tanstack/react-router";

import { useBootstrapAuth } from "@/features/auth";
import { useThemeAttributes } from "@/shared/hooks/use-theme-attributes";
import { cn } from "@/shared/lib/utils";

const RootComponent = () => {
  const status = useBootstrapAuth();

  useThemeAttributes();

  if (status === "pending") {
    return (
      <div className={cn("flex h-screen items-center justify-center text-text-2")}>Loading…</div>
    );
  }

  return <Outlet />;
};

export const Route = createRootRoute({
  component: RootComponent,
});
