import { http, HttpResponse } from "msw";

import type { components } from "@/shared/types/api-generated";

import { INVENTORY_ITEMS } from "./inventory-data";


type InventoryItem = components["schemas"]["InventoryItem"];

/**
 * Dev-only mock of GET /api/v1/inventory that honors the real server contract:
 * search (name/serial), sortBy/sortOrder, lowStock, and page/limit pagination —
 * so the server-driven table behaves exactly as it will against the real API.
 */
const MOCK_USER = {
  id: "usr-001",
  userName: "Jane Doe",
  email: "jane@acme.dev",
  roles: ["ADMIN", "MANAGER"],
};

export const handlers = [
  // Auth bootstrap — lets the app authenticate on load without a real backend.
  http.post("*/api/v1/auth/refresh", () =>
    HttpResponse.json({ success: true, data: { accessToken: "dev-token", roles: MOCK_USER.roles } }),
  ),
  http.get("*/api/v1/users/me", () => HttpResponse.json({ success: true, data: MOCK_USER })),

  http.get("*/api/v1/inventory", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const limit = Number(url.searchParams.get("limit") ?? 25);
    const sortBy = url.searchParams.get("sortBy") as keyof InventoryItem | null;
    const sortOrder = url.searchParams.get("sortOrder") === "desc" ? "desc" : "asc";
    const search = (url.searchParams.get("search") ?? "").toLowerCase().trim();
    const lowStock = url.searchParams.get("lowStock") === "true";

    let items = [...INVENTORY_ITEMS];

    if (search) {
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(search) || i.serialNumber.toLowerCase().includes(search),
      );
    }
    if (lowStock) items = items.filter((i) => i.quantity <= i.minStockLevel);

    if (sortBy === "name" || sortBy === "quantity" || sortBy === "createdAt") {
      items.sort((a, b) => {
        const av = a[sortBy];
        const bv = b[sortBy];
        const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
        return sortOrder === "asc" ? cmp : -cmp;
      });
    }

    const total = items.length;
    const start = (page - 1) * limit;
    const data = items.slice(start, start + limit);

    return HttpResponse.json({
      success: true,
      data,
      meta: { total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) },
    });
  }),
];
