import { addDays, format } from "date-fns";
import { describe, expect, it } from "vitest";

import {
  END_DOWNTIME_DEFAULTS,
  endDowntimeSchema,
  START_DOWNTIME_DEFAULTS,
  startDowntimeSchema,
} from "./validation";

const localDateTime = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm");

const tomorrow = () => localDateTime(addDays(new Date(), 1));
const yesterday = () => localDateTime(addDays(new Date(), -1));

describe("startDowntimeSchema", () => {
  it("accepts the defaults, which mean a breakdown starting now", () => {
    expect(startDowntimeSchema.safeParse(START_DOWNTIME_DEFAULTS).success).toBe(true);
  });

  it("accepts a start in the past", () => {
    expect(
      startDowntimeSchema.safeParse({ ...START_DOWNTIME_DEFAULTS, startedAt: yesterday() }).success,
    ).toBe(true);
  });

  it("rejects a start in the future", () => {
    const result = startDowntimeSchema.safeParse({
      ...START_DOWNTIME_DEFAULTS,
      startedAt: tomorrow(),
    });

    expect(result.error?.issues[0]?.message).toBe("Can't be in the future");
  });

  it("rejects an unknown reason", () => {
    expect(
      startDowntimeSchema.safeParse({ ...START_DOWNTIME_DEFAULTS, reason: "OTHER" }).success,
    ).toBe(false);
  });

  it("rejects a note over 500 characters, as the server does", () => {
    const result = startDowntimeSchema.safeParse({
      ...START_DOWNTIME_DEFAULTS,
      note: "a".repeat(501),
    });

    expect(result.error?.issues[0]?.message).toBe("Max 500 characters");
  });

  it("accepts a note of exactly 500 characters", () => {
    expect(
      startDowntimeSchema.safeParse({ ...START_DOWNTIME_DEFAULTS, note: "a".repeat(500) }).success,
    ).toBe(true);
  });

  it("accepts a planned stop", () => {
    expect(
      startDowntimeSchema.safeParse({ ...START_DOWNTIME_DEFAULTS, reason: "PLANNED" }).success,
    ).toBe(true);
  });
});

describe("endDowntimeSchema", () => {
  it("accepts the default, which means now", () => {
    expect(endDowntimeSchema.safeParse(END_DOWNTIME_DEFAULTS).success).toBe(true);
  });

  it("rejects an end in the future", () => {
    const result = endDowntimeSchema.safeParse({ endedAt: tomorrow() });

    expect(result.error?.issues[0]?.message).toBe("Can't be in the future");
  });
});
