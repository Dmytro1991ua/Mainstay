import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/stores/auth-store";

import { CommandMenu } from "./-components/command-menu/CommandMenu";
import { CommandMenuProvider } from "./-components/command-menu/provider";
import { Header } from "./-components/header/Header";
import { Sidebar } from "./-components/sidebar/Sidebar";

const AppLayout = () => (
  <CommandMenuProvider>
    <div className={cn("flex min-h-screen")}>
      <Sidebar />
      <div className={cn("flex min-w-0 flex-1 flex-col")}>
        <Header />
        <main className={cn("flex-1 p-pad bg-accent-soft")}>
          <Outlet />
        </main>
      </div>
    </div>
    <CommandMenu />
  </CommandMenuProvider>
);

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (useAuthStore.getState().status !== "authenticated") {
      throw redirect({ to: "/login" });
    }
  },
  component: AppLayout,
});
