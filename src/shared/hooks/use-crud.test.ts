import { describe, expect, it } from "vitest";

import { flattenPages, getTotal } from "./use-crud";

import type { PaginatedResponse } from "./use-crud";
import type { InfiniteData } from "@tanstack/react-query";

const page = (data: string[], total: number): PaginatedResponse<string> => ({
  data,
  meta: { page: 1, pages: 1, total, limit: 20 },
});

const pages = (...list: PaginatedResponse<string>[]): InfiniteData<PaginatedResponse<string>> => ({
  pages: list,
  pageParams: list.map((_, index) => index + 1),
});

describe("flattenPages", () => {
  it("returns an empty list before any data has loaded", () => {
    expect(flattenPages(undefined)).toEqual([]);
  });

  it("returns the items of a single page", () => {
    expect(flattenPages(pages(page(["a", "b"], 2)))).toEqual(["a", "b"]);
  });

  it("joins several pages in order", () => {
    expect(flattenPages(pages(page(["a", "b"], 3), page(["c"], 3)))).toEqual(["a", "b", "c"]);
  });
});

describe("getTotal", () => {
  it("is 0 before any data has loaded", () => {
    expect(getTotal(undefined)).toBe(0);
  });

  it("reads the total from the first page", () => {
    expect(getTotal(pages(page(["a", "b"], 3), page(["c"], 3)))).toBe(3);
  });
});
