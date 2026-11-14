import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ROLE_DENIED_EVENT } from "@/shared/lib/api-client";
import { queryClient } from "@/shared/lib/query-client";
import { toast } from "@/shared/ui/toast";

import { refreshCurrentUser } from "../lib/refresh-current-user";

import { useSyncRoles } from "./use-sync-roles";

vi.mock("../lib/refresh-current-user", () => ({ refreshCurrentUser: vi.fn() }));
vi.mock("@/shared/ui/toast", () => ({ toast: { info: vi.fn() } }));

const refresh = vi.mocked(refreshCurrentUser);

const denyARequest = async () => {
  window.dispatchEvent(new Event(ROLE_DENIED_EVENT));
  // The reload is async; let it settle.
  await vi.waitFor(() => expect(refresh).toHaveBeenCalled());
  await Promise.resolve();
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue();
});

describe("useSyncRoles", () => {
  it("refetches cached data and says so when the roles changed", async () => {
    refresh.mockResolvedValue(true);
    renderHook(() => useSyncRoles());

    await denyARequest();

    await vi.waitFor(() =>
      expect(toast.info).toHaveBeenCalledWith("Your permissions changed", expect.anything()),
    );
    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(1);
  });

  it("does nothing visible when the roles are the same", async () => {
    refresh.mockResolvedValue(false);
    renderHook(() => useSyncRoles());

    await denyARequest();

    expect(toast.info).not.toHaveBeenCalled();
    expect(queryClient.invalidateQueries).not.toHaveBeenCalled();
  });

  it("stops listening when it unmounts", () => {
    const { unmount } = renderHook(() => useSyncRoles());
    unmount();

    window.dispatchEvent(new Event(ROLE_DENIED_EVENT));

    expect(refresh).not.toHaveBeenCalled();
  });
});
