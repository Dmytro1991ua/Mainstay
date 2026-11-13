import { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const rejectWith = (status: number, message: string) => (config: InternalAxiosRequestConfig) =>
  Promise.reject(
    new AxiosError("failed", "ERR", config, undefined, {
      status,
      data: { success: false, error: { code: "ERROR", message } },
      statusText: "",
      headers: {},
      config,
    }),
  );

const assign = vi.fn();

let axiosInstance: AxiosInstance;
let useAuthStore: typeof import("@/shared/stores/auth-store").useAuthStore;

beforeEach(async () => {
  // The client signs out only once per page load, so each test needs a fresh copy of it.
  vi.resetModules();
  ({ axiosInstance } = await import("./api-client"));
  ({ useAuthStore } = await import("@/shared/stores/auth-store"));

  assign.mockClear();
  vi.stubGlobal("location", { ...window.location, assign });
  useAuthStore.getState().setSession("token", { id: "u1" } as never);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("deactivated account", () => {
  it("ends the session and sends the user to the login page with the reason", async () => {
    axiosInstance.defaults.adapter = rejectWith(403, "Your account has been deactivated");

    await expect(axiosInstance.get("/tasks")).rejects.toBeDefined();

    expect(useAuthStore.getState().status).toBe("unauthenticated");
    expect(assign).toHaveBeenCalledWith("/login?reason=deactivated");
  });

  it("also signs out when the token refresh is the request that is rejected", async () => {
    axiosInstance.defaults.adapter = rejectWith(403, "Your account has been deactivated");

    await expect(axiosInstance.post("/auth/refresh")).rejects.toBeDefined();

    expect(useAuthStore.getState().status).toBe("unauthenticated");
    expect(assign).toHaveBeenCalledWith("/login?reason=deactivated");
  });

  it("signs out once when several requests fail together", async () => {
    axiosInstance.defaults.adapter = rejectWith(403, "Your account has been deactivated");

    await Promise.allSettled([axiosInstance.get("/tasks"), axiosInstance.get("/assets")]);

    expect(assign).toHaveBeenCalledTimes(1);
  });

  it("stays put on the login page, and can still sign out after a later sign-in", async () => {
    vi.stubGlobal("location", { ...window.location, pathname: "/login", assign });
    axiosInstance.defaults.adapter = rejectWith(403, "Your account has been deactivated");

    await expect(axiosInstance.post("/auth/refresh")).rejects.toBeDefined();

    expect(assign).not.toHaveBeenCalled();

    // Signs in on this page, then is deactivated: the next request must still sign out.
    vi.stubGlobal("location", { ...window.location, pathname: "/tasks", assign });
    useAuthStore.getState().setSession("token", { id: "u2" } as never);

    await expect(axiosInstance.get("/tasks")).rejects.toBeDefined();

    expect(assign).toHaveBeenCalledWith("/login?reason=deactivated");
  });

  it("leaves other 403s alone", async () => {
    axiosInstance.defaults.adapter = rejectWith(403, "ADMIN role required");

    await expect(axiosInstance.get("/users")).rejects.toBeDefined();

    expect(useAuthStore.getState().status).toBe("authenticated");
    expect(assign).not.toHaveBeenCalled();
  });

  it("lets the login form show the message itself", async () => {
    axiosInstance.defaults.adapter = rejectWith(403, "Your account has been deactivated");

    await expect(axiosInstance.post("/auth/login")).rejects.toBeDefined();

    expect(assign).not.toHaveBeenCalled();
  });
});
