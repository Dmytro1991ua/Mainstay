import { z } from "zod";

import type { TableUrlState } from "./types";

const tableSearchSchema = z.object({
  search: z.string().optional().catch(undefined),
  sorting: z
    .array(z.object({ id: z.string(), desc: z.boolean() }))
    .optional()
    .catch(undefined),
  filters: z.record(z.string(), z.array(z.string())).optional().catch(undefined),
});

export const validateTableSearch = (raw: Record<string, unknown>): TableUrlState =>
  tableSearchSchema.parse(raw);
