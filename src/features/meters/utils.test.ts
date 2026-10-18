import { describe, expect, it } from "vitest";

import { getReadingSuccessMessage } from "./utils";

import type { RecordReadingResult } from "./api/meters.api";

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
