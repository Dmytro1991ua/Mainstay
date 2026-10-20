import { describe, expect, it } from "vitest";

import type { RecurringTask } from "@/features/recurring-tasks/api/recurring-tasks.api";

import { getNextServiceLines, getReadingSuccessMessage } from "./utils";

import type { Meter, RecordReadingResult } from "./api/meters.api";

const meter = (currentReading: number): Meter =>
  ({ id: "m1", unit: "hours", currentReading }) as unknown as Meter;

const schedule = (overrides: Partial<RecurringTask>): RecurringTask =>
  ({
    title: "Oil change",
    isActive: true,
    meterId: "m1",
    nextDueReading: 1250,
    ...overrides,
  }) as unknown as RecurringTask;

describe("getNextServiceLines", () => {
  it("is empty when no schedule uses the meter", () => {
    expect(getNextServiceLines(meter(1240), [])).toEqual([]);
  });

  it("says how far off the next service is", () => {
    expect(getNextServiceLines(meter(1240), [schedule({})])).toEqual([
      "Oil change · due at 1,250 hours · 10 hours to go",
    ]);
  });

  it('says "reached" once the reading is at or past the due point', () => {
    expect(getNextServiceLines(meter(1250), [schedule({})])).toEqual([
      "Oil change · due at 1,250 hours · reached",
    ]);
    expect(getNextServiceLines(meter(1300), [schedule({})])).toEqual([
      "Oil change · due at 1,250 hours · reached",
    ]);
  });

  it("ignores paused schedules and schedules for other meters", () => {
    expect(
      getNextServiceLines(meter(1240), [
        schedule({ isActive: false }),
        schedule({ meterId: "other" }),
      ]),
    ).toEqual([]);
  });

  it("ignores schedules with no due reading (time-based ones)", () => {
    expect(
      getNextServiceLines(meter(1240), [schedule({ meterId: null, nextDueReading: null })]),
    ).toEqual([]);
  });

  it("lists several schedules nearest first", () => {
    expect(
      getNextServiceLines(meter(1000), [
        schedule({ title: "Overhaul", nextDueReading: 5000 }),
        schedule({ title: "Oil change", nextDueReading: 1250 }),
      ]),
    ).toEqual([
      "Oil change · due at 1,250 hours · 250 hours to go",
      "Overhaul · due at 5,000 hours · 4,000 hours to go",
    ]);
  });
});

const result = (triggeredTasks: RecordReadingResult["triggeredTasks"]): RecordReadingResult =>
  ({
    reading: {},
    meter: { name: "Engine hours", unit: "hours", currentReading: 1250 },
    triggeredTasks,
  }) as unknown as RecordReadingResult;

describe("getReadingSuccessMessage", () => {
  it("only reports the new reading when no task was created", () => {
    expect(getReadingSuccessMessage(result([]))).toBe("Engine hours is now 1,250 hours.");
  });

  it("names a single created task", () => {
    expect(getReadingSuccessMessage(result([{ id: "1", title: "Oil change" }]))).toBe(
      'Engine hours is now 1,250 hours. Created maintenance task: "Oil change".',
    );
  });

  it("names several created tasks", () => {
    expect(
      getReadingSuccessMessage(
        result([
          { id: "1", title: "Oil change" },
          { id: "2", title: "Inspect belts" },
        ]),
      ),
    ).toBe(
      'Engine hours is now 1,250 hours. Created maintenance tasks: "Oil change", "Inspect belts".',
    );
  });
});
