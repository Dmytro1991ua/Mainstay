import { AxiosError } from "axios";
import { describe, expect, it } from "vitest";

import { isAccountDeactivatedError } from "./api-error";

const apiError = (status: number, message: string) =>
  new AxiosError("failed", "ERR", undefined, undefined, {
    status,
    data: { success: false, error: { code: "ERROR", message } },
  } as never);

describe("isAccountDeactivatedError", () => {
  it("recognises the deactivated-account response", () => {
    expect(isAccountDeactivatedError(apiError(403, "Your account has been deactivated"))).toBe(
      true,
    );
  });

  it("ignores other 403s, such as a missing role", () => {
    expect(isAccountDeactivatedError(apiError(403, "ADMIN role required"))).toBe(false);
  });

  it("ignores the same text on another status", () => {
    expect(isAccountDeactivatedError(apiError(401, "Your account has been deactivated"))).toBe(
      false,
    );
  });

  it("ignores errors that are not API responses", () => {
    expect(isAccountDeactivatedError(new Error("boom"))).toBe(false);
    expect(isAccountDeactivatedError(undefined)).toBe(false);
  });
});
