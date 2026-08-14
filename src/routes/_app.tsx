import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/stores/auth-store";

import { CommandMenu } from "./-components/command-menu/CommandMenu";
import { CommandMenuProvider } from "./-components/command-menu/provider";
import { Header } from "./-components/header/Header";
import { Sidebar } from "./-components/sidebar/Sidebar";

const AppLayout = () => (
  <CommandMenuProvider>
    <div className={cn("flex h-screen overflow-hidden")}>
      <Sidebar />
      <div className={cn("flex min-w-0 flex-1 flex-col overflow-hidden")}>
        <Header />
        <main
          className={cn("flex flex-col flex-1 overflow-hidden p-pad")}
          style={{
            background: "linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg) 65%)",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
    <CommandMenu />
  </CommandMenuProvider>
);

export const Route = createFileRoute("/_app")({
  beforeLoad: ({ location }) => {
    if (useAuthStore.getState().status !== "authenticated") {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  component: AppLayout,
});
