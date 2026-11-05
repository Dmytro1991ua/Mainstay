import { describe, expect, it } from "vitest";

import { getNotificationNav } from "./utils";

import type { Notification } from "./api/notifications-api";

const notification = (overrides: Partial<Notification>): Notification =>
  ({ type: "METER_SERVICE_DUE", message: "", relatedEntityId: "s1", ...overrides }) as Notification;

describe("getNotificationNav", () => {
  it("opens the schedule for a meter service reminder", () => {
    expect(getNotificationNav(notification({}))).toEqual({
      to: "/recurring-tasks/$scheduleId",
      params: { scheduleId: "s1" },
    });
  });

  it("opens the asset for a warranty alert", () => {
    expect(
      getNotificationNav(notification({ type: "WARRANTY_EXPIRING", relatedEntityId: "a1" })),
    ).toEqual({ to: "/assets/$assetId", params: { assetId: "a1" } });
  });

  it("has nowhere to go without a related entity", () => {
    expect(getNotificationNav(notification({ relatedEntityId: null }))).toBeNull();
  });
});
