import type { ComboboxOption } from "./InfiniteCombobox";

/**
 * Build the InfiniteCombobox `selectedOption` from an entity that may be absent.
 * Lets edit forms display the current selection even when it hasn't loaded into
 * the paged options yet.
 */
export const toComboboxOption = <T extends { id: string }>(
  entity: T | null | undefined,
  toLabel: (entity: T) => string,
  toMeta?: (entity: T) => Record<string, unknown>,
): ComboboxOption | undefined =>
  entity
    ? { value: entity.id, label: toLabel(entity), ...(toMeta ? { meta: toMeta(entity) } : {}) }
    : undefined;
