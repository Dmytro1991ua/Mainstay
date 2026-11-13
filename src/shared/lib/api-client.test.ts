import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/shared/stores/auth-store";

import { axiosInstance } from "./api-client";

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

beforeEach(() => {
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
