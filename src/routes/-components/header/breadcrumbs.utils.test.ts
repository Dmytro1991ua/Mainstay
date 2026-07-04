import { describe, expect, it } from "vitest";

import { getBreadcrumbs } from "./breadcrumbs.utils";

describe("getBreadcrumbs", () => {
  it("returns a single unlinked crumb on the dashboard root", () => {
    expect(getBreadcrumbs("/dashboard")).toEqual([{ label: "Dashboard" }]);
  });

  it("prefixes Dashboard as a link and marks the leaf as the current (unlinked) page", () => {
    expect(getBreadcrumbs("/inventory")).toEqual([
      { label: "Dashboard", to: "/dashboard" },
      { label: "Inventory" },
    ]);
  });

  it("labels known segments from the nav config", () => {
    expect(getBreadcrumbs("/users")).toEqual([
      { label: "Dashboard", to: "/dashboard" },
      { label: "Users" },
    ]);
  });

  it("keeps a known intermediate segment linked and prettifies an unknown leaf id", () => {
    expect(getBreadcrumbs("/inventory/caf-09")).toEqual([
      { label: "Dashboard", to: "/dashboard" },
      { label: "Inventory", to: "/inventory" },
      { label: "Caf 09" },
    ]);
  });
});
