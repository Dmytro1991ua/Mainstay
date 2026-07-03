import { Navigate, Outlet } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/stores/auth-store";
import { BrandLogo } from "@/shared/ui/brand-logo";
import { ThemeToggleCycle } from "@/shared/ui/theme-toggle-cycle";

const FEATURES = [
  "Live low-stock alerts with reorder thresholds",
  "Overdue maintenance, surfaced before it fails",
  "Role-based access for your whole team",
];

const CURRENT_YEAR = new Date().getFullYear();

export const AuthLayout = () => {
  const status = useAuthStore((s) => s.status);

  if (status === "authenticated") return <Navigate to="/dashboard" />;

  return (
    <main className={cn("flex min-h-screen")}>
      <section
        className={cn(
          "relative hidden min-h-140 flex-[1.15_1_440px] flex-col",
          "justify-between overflow-hidden p-13 text-white lg:flex",
        )}
        style={{
          background: "radial-gradient(135% 130% at 0% 0%, #3B82F6 0%, #1E40AF 42%, #0B1220 100%)",
        }}
      >
        <div
          className={cn("pointer-events-none absolute inset-0 opacity-50")}
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
            WebkitMaskImage: "radial-gradient(120% 90% at 10% 0%, #000, transparent 75%)",
          }}
        />
        <div
          className={cn("pointer-events-none absolute -top-22.5 -right-15 h-90 w-90 rounded-full")}
          style={{ background: "rgba(96,165,250,.4)", filter: "blur(90px)" }}
        />
        <BrandLogo variant="inverted" className="relative" />
        <div className={cn("relative max-w-120")}>
          <div
            className={cn(
              "mb-5.5 inline-flex items-center gap-1.5 rounded-full border",
              "border-white/18 bg-white/10 px-2.75 py-1.25 text-xs font-medium",
            )}
          >
            Operations Platform
          </div>
          <h1
            className={cn(
              "mb-4.5 text-[38px] leading-[1.12] font-semibold tracking-tight text-balance",
            )}
          >
            Keep every asset running. Catch every shortage.
          </h1>
          <p className={cn("mb-7 text-[15.5px] leading-relaxed text-white/82")}>
            One workspace for the maintenance crew to track inventory levels and stay ahead of
            overdue work — before small gaps turn into real downtime.
          </p>
          <div className={cn("flex flex-col gap-3.25")}>
            {FEATURES.map((feature) => (
              <div key={feature} className={cn("flex items-center gap-2.75 text-sm")}>
                <span
                  className={cn(
                    "flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md bg-white/16",
                  )}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 12 4.5 4.5L19 7" />
                  </svg>
                </span>
                {feature}
              </div>
            ))}
          </div>
        </div>
        <div
          className={cn(
            "-mx-13 flex items-center justify-between border-t",
            "border-white/14 px-13 pt-6.5 text-xs text-white/60",
          )}
        >
          <div className={cn("flex items-center gap-1.5")}>
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
            <span>Role-based access. Your data stays in your organization.</span>
          </div>
          <span>© {CURRENT_YEAR} Mainstay</span>
        </div>
      </section>
      <section className={cn("relative flex flex-1 items-center justify-center p-11 px-6.5")}>
        <div className={cn("absolute top-6 right-6")}>
          <ThemeToggleCycle />
        </div>
        <div className={cn("w-full max-w-[384px]")}>
          <Outlet />
        </div>
      </section>
    </main>
  );
};
