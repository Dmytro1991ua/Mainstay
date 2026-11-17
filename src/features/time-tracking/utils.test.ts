import { describe, expect, it } from "vitest";

import { formatMinutes, getUnratedNote, toTotalMinutes } from "./utils";

import type { TimeEntriesSummary } from "./api/time-entries.api";

describe("formatMinutes", () => {
  it("shows minutes only under an hour", () => {
    expect(formatMinutes(45)).toBe("45m");
  });

  it("shows whole hours without a minutes part", () => {
    expect(formatMinutes(120)).toBe("2h");
  });

  it("shows hours and minutes together", () => {
    expect(formatMinutes(90)).toBe("1h 30m");
  });
});

describe("toTotalMinutes", () => {
  it("treats blank fields as zero", () => {
    expect(toTotalMinutes("2", "")).toBe(120);
    expect(toTotalMinutes("", "30")).toBe(30);
  });

  it("adds hours and minutes", () => {
    expect(toTotalMinutes("1", "15")).toBe(75);
  });
});

describe("getUnratedNote", () => {
  const summary: TimeEntriesSummary = { entries: [], totalMinutes: 150, totalCost: "50.00" };

  it("says nothing when every minute has a rate", () => {
    expect(getUnratedNote({ ...summary, unratedMinutes: 0 })).toBeUndefined();
    expect(getUnratedNote(summary)).toBeUndefined();
  });

  it("explains what the cost leaves out", () => {
    expect(getUnratedNote({ ...summary, unratedMinutes: 90 })).toBe(
      "Excludes 1h 30m logged by people with no hourly rate",
    );
  });
});
