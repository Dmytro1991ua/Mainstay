import { describe, expect, it } from "vitest";

import { RECURRING_TASK_FORM_DEFAULTS, recurringTaskFormSchema } from "./validation";

const parse = (overrides: Partial<typeof RECURRING_TASK_FORM_DEFAULTS>) =>
  recurringTaskFormSchema.safeParse({
    ...RECURRING_TASK_FORM_DEFAULTS,
    title: "Oil change",
    ...overrides,
  });

const errorFor = (result: ReturnType<typeof parse>, field: string) =>
  result.error?.issues.find((issue) => issue.path[0] === field)?.message;

describe("recurringTaskFormSchema", () => {
  describe("time schedules", () => {
    it("needs a first due date", () => {
      expect(errorFor(parse({}), "nextDueAt")).toBe("First due date is required");
    });

    it("accepts a valid interval and date", () => {
      expect(parse({ intervalDays: 30, nextDueAt: "2026-12-01" }).success).toBe(true);
    });

    it("rejects an interval under one day, including an emptied field", () => {
      expect(errorFor(parse({ intervalDays: 0, nextDueAt: "2026-12-01" }), "intervalDays")).toBe(
        "Must be at least 1 day",
      );
      expect(
        errorFor(parse({ intervalDays: Number.NaN, nextDueAt: "2026-12-01" }), "intervalDays"),
      ).toBe("Must be at least 1 day");
    });
  });

  describe("meter schedules", () => {
    const meter = { triggerType: "METER" as const, meterId: "m1", intervalReading: "250" };

    it("ignores the time fields", () => {
      expect(parse({ ...meter, intervalDays: Number.NaN, nextDueAt: "" }).success).toBe(true);
    });

    it("needs a meter", () => {
      expect(errorFor(parse({ ...meter, meterId: "" }), "meterId")).toBe("Choose a meter");
    });

    it("needs an interval of at least 1", () => {
      expect(errorFor(parse({ ...meter, intervalReading: "" }), "intervalReading")).toBe(
        "Interval is required",
      );
      expect(errorFor(parse({ ...meter, intervalReading: "0" }), "intervalReading")).toBe(
        "Must be at least 1",
      );
      expect(errorFor(parse({ ...meter, intervalReading: "2.5" }), "intervalReading")).toMatch(
        /whole number/,
      );
    });

    it("treats the first due reading as optional but validates it when typed", () => {
      expect(parse({ ...meter, firstDueReading: "" }).success).toBe(true);
      expect(parse({ ...meter, firstDueReading: "1250" }).success).toBe(true);
      expect(errorFor(parse({ ...meter, firstDueReading: "-5" }), "firstDueReading")).toMatch(
        /whole number/,
      );
      expect(errorFor(parse({ ...meter, firstDueReading: "99999999999" }), "firstDueReading")).toBe(
        "That number is too large",
      );
    });
  });
});
