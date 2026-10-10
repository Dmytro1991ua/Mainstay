import { format } from "date-fns";
import { beforeAll, describe, expect, it } from "vitest";

import { formatCalendarDate, isPastCalendarDate } from "./utils";

// The bug only shows west of UTC: midnight UTC is still the previous evening there.
beforeAll(() => {
  process.env.TZ = "America/New_York";
});

const MIDNIGHT_UTC = "2027-06-15T00:00:00.000Z";

describe("calendar dates in a time zone west of UTC", () => {
  it("is actually running west of UTC (guard so the tests below can't pass vacuously)", () => {
    // Formatting the raw instant is the old behavior: it lands on the previous day.
    expect(format(new Date(MIDNIGHT_UTC), "MMM d, yyyy")).toBe("Jun 14, 2027");
  });

  it("formats the day that was entered, not the previous one", () => {
    expect(formatCalendarDate(MIDNIGHT_UTC)).toBe("Jun 15, 2027");
  });

  it("accepts a plain date string too", () => {
    expect(formatCalendarDate("2027-06-15")).toBe("Jun 15, 2027");
  });

  it("is not past on the expiry day itself", () => {
    expect(isPastCalendarDate(MIDNIGHT_UTC, new Date(2027, 5, 15, 9, 0))).toBe(false);
    expect(isPastCalendarDate(MIDNIGHT_UTC, new Date(2027, 5, 15, 23, 59))).toBe(false);
  });

  it("is past the day after", () => {
    expect(isPastCalendarDate(MIDNIGHT_UTC, new Date(2027, 5, 16, 0, 1))).toBe(true);
  });

  it("is not past the day before", () => {
    expect(isPastCalendarDate(MIDNIGHT_UTC, new Date(2027, 5, 14, 12, 0))).toBe(false);
  });
});
