import { beforeEach, describe, expect, it, vi } from "vitest";

const getCurrentUser = vi.fn();

vi.mock("../api/auth-api", () => ({ getCurrentUser }));

let refreshCurrentUser: typeof import("./refresh-current-user").refreshCurrentUser;
let useAuthStore: typeof import("@/shared/stores/auth-store").useAuthStore;

beforeEach(async () => {
  // The throttle lives in module state, so each test starts from a fresh copy.
  vi.resetModules();
  getCurrentUser.mockReset();
  ({ refreshCurrentUser } = await import("./refresh-current-user"));
  ({ useAuthStore } = await import("@/shared/stores/auth-store"));
  useAuthStore.getState().setSession("token", { id: "u1", roles: ["MANAGER"] } as never);
});

describe("refreshCurrentUser", () => {
  it("stores the new roles and reports that they changed", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1", roles: ["TECHNICIAN"] });

    expect(await refreshCurrentUser(0)).toBe(true);
    expect(useAuthStore.getState().user?.roles).toEqual(["TECHNICIAN"]);
  });

  it("keeps the session token, and reports no change when the roles match", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1", roles: ["MANAGER"], userName: "new_name" });

    expect(await refreshCurrentUser(0)).toBe(false);
    expect(useAuthStore.getState().accessToken).toBe("token");
    expect(useAuthStore.getState().user?.userName).toBe("new_name");
  });

  it("does not ask again within the minimum interval", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1", roles: ["MANAGER"] });

    await refreshCurrentUser(60_000);
    await refreshCurrentUser(60_000);

    expect(getCurrentUser).toHaveBeenCalledTimes(1);
  });

  it("does not start a second request while one is running", async () => {
    getCurrentUser.mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({ id: "u1", roles: ["MANAGER"] }), 10)),
    );

    await Promise.all([refreshCurrentUser(0), refreshCurrentUser(0)]);

    expect(getCurrentUser).toHaveBeenCalledTimes(1);
  });

  it("leaves the session as it was when the request fails", async () => {
    getCurrentUser.mockRejectedValue(new Error("network"));

    expect(await refreshCurrentUser(0)).toBe(false);
    expect(useAuthStore.getState().user?.roles).toEqual(["MANAGER"]);
  });
});
