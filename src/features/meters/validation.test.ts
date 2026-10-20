import { describe, expect, it } from "vitest";

import { getReadingError } from "./validation";

describe("getReadingError", () => {
  const error = (value: string) => getReadingError(value, 1240, "hours");

  it("has no error while empty", () => {
    expect(error("")).toBeUndefined();
    expect(error("   ")).toBeUndefined();
  });

  it("accepts a higher reading", () => {
    expect(error("1255")).toBeUndefined();
  });

  it("accepts a reading equal to the current one", () => {
    expect(error("1240")).toBeUndefined();
  });

  it("rejects a lower reading and names the current one", () => {
    expect(error("1239")).toBe("Must be at least 1,240 hours");
  });

  it("rejects text instead of dropping it (e.g. a comma decimal)", () => {
    expect(error("12,5")).toBe("Must be a whole number (0 or more)");
    expect(error("abc")).toBe("Must be a whole number (0 or more)");
    expect(error("-5")).toBe("Must be a whole number (0 or more)");
    expect(error("12.5")).toBe("Must be a whole number (0 or more)");
  });

  it("rejects a number above the database integer limit", () => {
    expect(error("2147483648")).toBe("That number is too large");
  });

  it("accepts the largest allowed reading", () => {
    expect(error("2147483647")).toBeUndefined();
  });
});
