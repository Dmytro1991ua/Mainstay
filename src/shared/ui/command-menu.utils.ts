import type { CommandItem } from "./command-menu.types";

const normalize = (value: string) => value.toLowerCase().trim();

/** Case-insensitive match across an item's label, keywords, and group. */
const matches = (item: CommandItem, query: string) =>
  normalize(`${item.label} ${item.keywords ?? ""} ${item.group}`).includes(query);

/**
 * Filter by query (an empty query keeps everything), then lay the items out
 * grouped while preserving first-seen group order. The returned array is the
 * exact on-screen order, so a keyboard cursor can index it 1:1.
 */
export const orderCommandItems = (items: CommandItem[], query: string): CommandItem[] => {
  const q = normalize(query);
  const filtered = q ? items.filter((item) => matches(item, q)) : items;

  const groupOrder: string[] = [];
  for (const item of filtered) {
    if (!groupOrder.includes(item.group)) groupOrder.push(item.group);
  }

  return groupOrder.flatMap((group) => filtered.filter((item) => item.group === group));
};
