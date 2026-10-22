import { describe, expect, it } from "vitest";

import { toUpdateSchedulePayload } from "./utils";
import { RECURRING_TASK_FORM_DEFAULTS } from "./validation";

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
