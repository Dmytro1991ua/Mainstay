import { describe, expect, it } from "vitest";

import { toApiDate } from "./utils";

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
