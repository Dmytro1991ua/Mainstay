import { describe, expect, it } from "vitest";

import { hourlyRateSchema } from "./validation";

const error = (hourlyRate: string) =>
  hourlyRateSchema.safeParse({ hourlyRate }).error?.issues[0]?.message;

describe("hourlyRateSchema", () => {
  it("accepts an empty value, which clears the rate", () => {
    expect(error("")).toBeUndefined();
    expect(error("   ")).toBeUndefined();
  });

  it("accepts whole amounts and up to 2 decimals", () => {
    expect(error("25")).toBeUndefined();
    expect(error("25.5")).toBeUndefined();
    expect(error("25.50")).toBeUndefined();
    expect(error("0")).toBeUndefined();
  });

  it("accepts the largest amount the server allows", () => {
    expect(error("99999.99")).toBeUndefined();
  });

  it("rejects more than 5 digits before the decimal point", () => {
    expect(error("100000")).toBeDefined();
  });

  it("rejects more than 2 decimals, negatives and text", () => {
    expect(error("25.555")).toBeDefined();
    expect(error("-5")).toBeDefined();
    expect(error("abc")).toBeDefined();
    expect(error("25,50")).toBeDefined();
  });
});
