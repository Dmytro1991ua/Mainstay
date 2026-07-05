export const DEFAULT_PLACEHOLDER = "Search pages and actions…";
export const DEFAULT_EMPTY_MESSAGE = "No results found.";

/** id of the listbox the combobox input controls (aria-controls / aria-activedescendant). */
export const COMMAND_LISTBOX_ID = "command-listbox";

/** Stable per-row id so the input's aria-activedescendant can point at the active option. */
export const commandOptionId = (index: number) => `command-option-${index}`;
