import { describe, expect, it } from "vitest";

import { orderCommandItems } from "./command-menu.utils";

import type { CommandItem } from "./command-menu.types";

const makeItem = (over: Partial<CommandItem> & { id: string }): CommandItem => ({
  label: over.id,
  group: "Navigation",
  onSelect: () => {},
  ...over,
});

describe("orderCommandItems", () => {
  const items: CommandItem[] = [
    makeItem({ id: "dashboard", label: "Dashboard", group: "Navigation" }),
    makeItem({ id: "logout", label: "Log out", group: "Actions", keywords: "sign out" }),
    makeItem({ id: "inventory", label: "Inventory", group: "Navigation" }),
  ];

  it("returns every item when the query is empty", () => {
    expect(orderCommandItems(items, "")).toHaveLength(3);
  });

  it("groups items by first-seen group order, making each group contiguous", () => {
    // 'inventory' is defined after 'logout' but both Navigation items group first.
    expect(orderCommandItems(items, "").map((i) => i.id)).toEqual([
      "dashboard",
      "inventory",
      "logout",
    ]);
  });

  it("filters case-insensitively on the label", () => {
    expect(orderCommandItems(items, "INVENT").map((i) => i.id)).toEqual(["inventory"]);
  });

  it("matches on keywords and group, not just the label", () => {
    expect(orderCommandItems(items, "sign out").map((i) => i.id)).toEqual(["logout"]);
    expect(orderCommandItems(items, "actions").map((i) => i.id)).toEqual(["logout"]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(orderCommandItems(items, "zzz")).toEqual([]);
  });
});
