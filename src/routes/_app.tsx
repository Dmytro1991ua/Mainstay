import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/stores/auth-store";

import { Header } from "./-components/Header";
import { Sidebar } from "./-components/Sidebar";

const AppLayout = () => {
  const status = useAuthStore((s) => s.status);
  if (status !== "authenticated") return <Navigate to="/login" />;

  return (
    <div className={cn("flex min-h-screen bg-bg")}>
      <Sidebar />
      <div className={cn("flex min-w-0 flex-1 flex-col bg-panel")}>
        <Header />
        <main className={cn("flex-1 p-pad")}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});
