import { describe, expect, it } from "vitest";

import { login } from "./auth-api";

describe("login", () => {
  it("should unwrap the success envelope and returns the access token + roles", async () => {
    const result = await login({ email: "jordan@northwind-fac.com", password: "Password123" });

    expect(result).toEqual({ accessToken: "test-access-token", roles: ["TECHNICIAN"] });
  });
});
