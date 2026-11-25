import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ASSETS_KEY } from "@/features/assets/hooks/use-assets";

import { fetchDowntime } from "../api/downtime.api";

import { useDowntime } from "./use-downtime";

import type { DowntimeReport } from "../api/downtime.api";
import type { ReactNode } from "react";

vi.mock("../api/downtime.api", () => ({ fetchDowntime: vi.fn() }));

const report = { events: [] } as unknown as DowntimeReport;

describe("useDowntime", () => {
  it("refetches when an asset is edited, because the server syncs downtime with status", async () => {
    vi.mocked(fetchDowntime).mockResolvedValue(report);
    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    renderHook(() => useDowntime("asset-1"), { wrapper });
    await waitFor(() => expect(fetchDowntime).toHaveBeenCalledTimes(1));

    // What saving the asset form does.
    await queryClient.invalidateQueries({ queryKey: [ASSETS_KEY] });

    await waitFor(() => expect(fetchDowntime).toHaveBeenCalledTimes(2));
  });
});
