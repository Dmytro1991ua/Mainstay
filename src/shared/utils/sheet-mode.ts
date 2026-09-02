/**
 * Add/edit form sheets model their state as { type: "add" } | { type: "edit"; ... }.
 * Returns the edit variant (with its payload) or null, so a form can read the record
 * being edited without repeating the discriminant check at every call site.
 */
export const getEditState = <TEdit extends { type: "edit" }>(
  sheetMode: { type: "add" } | TEdit | null | undefined,
): TEdit | null => (sheetMode?.type === "edit" ? (sheetMode as TEdit) : null);
