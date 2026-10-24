import { describe, expect, it } from "vitest";

import { getScheduleCreatedMessage, toUpdateSchedulePayload } from "./utils";
import { RECURRING_TASK_FORM_DEFAULTS } from "./validation";

import type { RecurringTask } from "./api/recurring-tasks.api";

const values = (overrides: Partial<typeof RECURRING_TASK_FORM_DEFAULTS>) => ({
  ...RECURRING_TASK_FORM_DEFAULTS,
  title: "Oil change",
  ...overrides,
});

describe("toUpdateSchedulePayload", () => {
  it("sends the interval for a time schedule", () => {
    expect(toUpdateSchedulePayload(values({ intervalDays: 14 }))).toMatchObject({
      intervalDays: 14,
    });
  });

  it("leaves out every locked field for a meter schedule", () => {
    const update = toUpdateSchedulePayload(
      values({ triggerType: "METER", meterId: "m1", intervalReading: "250", firstDueReading: "1" }),
    );

    expect(update).not.toHaveProperty("intervalDays");
    expect(update).not.toHaveProperty("meterId");
    expect(update).not.toHaveProperty("intervalReading");
    expect(update).not.toHaveProperty("firstDueReading");
    expect(update.title).toBe("Oil change");
  });
});

const schedule = (overrides: Partial<RecurringTask>) =>
  ({ title: "Oil change", triggerType: "TIME", ...overrides }) as unknown as RecurringTask;

describe("getScheduleCreatedMessage", () => {
  it("uses days for a time schedule", () => {
    expect(getScheduleCreatedMessage(schedule({ intervalDays: 7 }))).toBe(
      '"Oil change" will run every 7 days.',
    );
  });

  it("uses the meter's own unit for a meter schedule", () => {
    expect(
      getScheduleCreatedMessage(
        schedule({ triggerType: "METER", intervalReading: 500, meter: { unit: "hours" } as never }),
      ),
    ).toBe('"Oil change" will create a task every 500 hours.');
  });

  it("falls back to a plain message when the interval is unknown", () => {
    expect(getScheduleCreatedMessage(schedule({ triggerType: "METER" }))).toBe(
      '"Oil change" was created.',
    );
  });
});
