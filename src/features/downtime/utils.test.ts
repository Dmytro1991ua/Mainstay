import { describe, expect, it } from "vitest";

import { formatAvailability, formatDowntimeDuration, toIsoDateTime } from "./utils";

describe("toIsoDateTime", () => {
  it("sends nothing for an empty field, so the server uses now", () => {
    expect(toIsoDateTime("")).toBeUndefined();
  });

  it("turns the viewer's local time into an ISO instant", () => {
    expect(toIsoDateTime("2026-11-22T10:30")).toBe(new Date(2026, 10, 22, 10, 30).toISOString());
  });
});

describe("formatDowntimeDuration", () => {
  it("shows a dash when there is no value", () => {
    expect(formatDowntimeDuration(null)).toBe("—");
  });

  it("shows hours and minutes under a day", () => {
    expect(formatDowntimeDuration(0)).toBe("0m");
    expect(formatDowntimeDuration(90)).toBe("1h 30m");
    expect(formatDowntimeDuration(1439)).toBe("23h 59m");
  });

  it("switches to days from 24 hours", () => {
    expect(formatDowntimeDuration(1440)).toBe("1d");
    expect(formatDowntimeDuration(3000)).toBe("2d 2h");
  });
});

describe("formatAvailability", () => {
  it("shows one decimal place", () => {
    expect(formatAvailability(98.7)).toBe("98.7%");
    expect(formatAvailability(100)).toBe("100.0%");
  });

  it("shows a dash when there is no value", () => {
    expect(formatAvailability(null)).toBe("—");
  });
});
