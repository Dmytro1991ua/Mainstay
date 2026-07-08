import type { Cell } from "@tanstack/react-table";

export type ColumnsValueAccessors = Record<string, (cell: Cell<unknown, unknown>) => string>;
