import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/stores/auth-store";

import { Header } from "./-components/Header";
import { Sidebar } from "./-components/Sidebar";

const AppLayout = () => (
  <div className={cn("flex min-h-screen")}>
    <Sidebar />
    <div className={cn("flex min-w-0 flex-1 flex-col")}>
      <Header />
      <main className={cn("flex-1 p-pad bg-bg")}>
        <Outlet />
      </main>
    </div>
  </div>
);

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (useAuthStore.getState().status !== "authenticated") {
      throw redirect({ to: "/login" });
    }
  },
  component: AppLayout,
});
