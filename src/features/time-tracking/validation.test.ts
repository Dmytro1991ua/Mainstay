import { addDays, format } from "date-fns";
import { describe, expect, it } from "vitest";

import { getTimeEntryDefaults, timeEntryFormSchema } from "./validation";

const valid = { ...getTimeEntryDefaults(), hours: "1", minutes: "30" };

const errorsOf = (values: Partial<typeof valid>) => {
  const result = timeEntryFormSchema.safeParse({ ...valid, ...values });

  if (result.success) return {};

  return Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message]));
};

describe("timeEntryFormSchema", () => {
  it("accepts a normal entry, and a blank minutes field", () => {
    expect(errorsOf({})).toEqual({});
    expect(errorsOf({ minutes: "" })).toEqual({});
  });

  it("asks for a duration when both fields are empty or zero", () => {
    expect(errorsOf({ hours: "", minutes: "" })).toEqual({ hours: "Enter the time" });
    expect(errorsOf({ hours: "0", minutes: "0" })).toEqual({ hours: "Enter the time" });
  });

  it("puts a non-whole number on the field that has it", () => {
    expect(errorsOf({ hours: "1.5" })).toEqual({ hours: "Whole numbers only" });
    expect(errorsOf({ minutes: "-5" })).toEqual({ minutes: "Whole numbers only" });
  });

  it("allows exactly 24 hours but not more", () => {
    expect(errorsOf({ hours: "24", minutes: "" })).toEqual({});
    expect(errorsOf({ hours: "24", minutes: "1" })).toEqual({ hours: "Max 24 hours" });
    expect(errorsOf({ hours: "", minutes: "90" })).toEqual({});
  });

  it("requires a date that is not in the future", () => {
    const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

    expect(errorsOf({ workedOn: "" })).toEqual({ workedOn: "Pick a date" });
    expect(errorsOf({ workedOn: tomorrow })).toEqual({ workedOn: "Can't be in the future" });
    expect(errorsOf({ workedOn: "2026-01-02" })).toEqual({});
  });

  it("allows a note of 500 characters but not more", () => {
    expect(errorsOf({ note: "a".repeat(500) })).toEqual({});
    expect(errorsOf({ note: "a".repeat(501) })).toEqual({ note: "Max 500 characters" });
  });
});
