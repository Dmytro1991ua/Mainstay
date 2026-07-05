import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { queryClient } from "@/shared/lib/query-client";

import { routeTree } from "./routeTree.gen";
import "./styles/index.css";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found");

async function bootstrap() {
  // Local dev has no backend in-repo, so an MSW mock serves /api/v1 (auth +
  // inventory) — enabled in dev by default, opt out with VITE_ENABLE_MOCKS=false.
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCKS !== "false") {
    const { worker } = await import("./mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }

  createRoot(rootElement!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  );
}

void bootstrap();
