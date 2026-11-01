import { describe, expect, it } from "vitest";

import { formatCompactMoney, formatVariance, getBarPercent, toApiDate } from "./utils";

describe("toApiDate", () => {
  it("keeps the picked day, whatever the time zone offset", () => {
    // Local midnight and local end of day are the same calendar day.
    expect(toApiDate(new Date(2026, 9, 29, 0, 0, 0))).toBe("2026-10-29");
    expect(toApiDate(new Date(2026, 9, 29, 23, 59, 59))).toBe("2026-10-29");
  });

  it("pads single-digit months and days", () => {
    expect(toApiDate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("formatVariance", () => {
  it("signs spend over and under the estimate", () => {
    expect(formatVariance("120.00")).toBe("+$120.00");
    expect(formatVariance("-50.50")).toBe("-$50.50");
  });

  it("shows no sign when spend matches the estimate", () => {
    expect(formatVariance("0.00")).toBe("$0.00");
  });

  it("falls back to a dash for a value that isn't a number", () => {
    expect(formatVariance("abc")).toBe("—");
  });
});

describe("formatCompactMoney", () => {
  it("shortens large amounts for chart axes", () => {
    expect(formatCompactMoney(9800)).toBe("$9.8K");
    expect(formatCompactMoney(0)).toBe("$0");
    expect(formatCompactMoney(1_250_000)).toBe("$1.3M");
  });
});

describe("getBarPercent", () => {
  it("sizes a row against the largest", () => {
    expect(getBarPercent(500, 1000)).toBe(50);
    expect(getBarPercent(1000, 1000)).toBe(100);
  });

  it("keeps a sliver for a tiny non-zero row, and none for zero", () => {
    expect(getBarPercent(1, 100_000)).toBe(2);
    expect(getBarPercent(0, 1000)).toBe(0);
    expect(getBarPercent(5, 0)).toBe(0);
  });
});
