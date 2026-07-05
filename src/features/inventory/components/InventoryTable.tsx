import { getRouteApi } from "@tanstack/react-router";

import { BaseTable, getEmptyMessage } from "@/shared/ui/base-table";
import type { FilterValues } from "@/shared/ui/base-table";

import { useInventoryTable } from "../hooks/use-inventory-table";

import { inventoryColumns } from "./columns";
import { inventoryFilterConfig } from "./filters.config";

import type { InventoryItem, InventorySortField } from "../api/inventory-api";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";

const routeApi = getRouteApi("/_app/inventory");

/**
 * Inventory table. URL search params (?sortBy=&sortOrder=&search=&lowStock=) are
 * the single source of truth for the data query — they drive the fetch hook's
 * query key AND the TanStack sorting/filter UI, so links are shareable and
 * back/forward just works. Column visibility + widths persist separately (local
 * per-user prefs, keyed by tableId), and selection is ephemeral.
 */
export function InventoryTable() {
  const search = routeApi.useSearch();
  const navigate = routeApi.useNavigate();

  const sorting: SortingState = search.sortBy
    ? [{ id: search.sortBy, desc: search.sortOrder === "desc" }]
    : [];

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === "function" ? updater(sorting) : updater;
    const first = next[0];
    void navigate({
      search: (prev) => ({
        ...prev,
        sortBy: first ? (first.id as InventorySortField) : undefined,
        sortOrder: first ? (first.desc ? "desc" : "asc") : undefined,
      }),
    });
  };

  const onSearchChange = (value: string) =>
    void navigate({
      // replace: a debounced search shouldn't push a history entry per keystroke.
      replace: true,
      search: (prev) => ({ ...prev, search: value || undefined }),
    });

  // Map the single `lowStock` boolean to/from the generic filter-values shape.
  const filterValues: FilterValues = search.lowStock ? { lowStock: ["true"] } : {};
  const clearLowStock = () =>
    void navigate({ search: (prev) => ({ ...prev, lowStock: undefined }) });

  const { rows, loading, error, hasMore, loadMore } = useInventoryTable({
    sortBy: search.sortBy,
    sortOrder: search.sortOrder,
    search: search.search,
    lowStock: search.lowStock,
  });

  return (
    <BaseTable<InventoryItem>
      columns={inventoryColumns}
      data={rows}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onLoadMore={loadMore}
      sorting={sorting}
      onSortingChange={onSortingChange}
      searchTerm={search.search ?? ""}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search inventory…"
      filters={{
        config: inventoryFilterConfig,
        values: filterValues,
        onToggle: () =>
          void navigate({ search: (prev) => ({ ...prev, lowStock: prev.lowStock ? undefined : true }) }),
        onClear: clearLowStock,
        onClearAll: clearLowStock,
      }}
      tableId="inventory"
      enableSelection
      getRowId={(item) => item.id}
      exportFileName="inventory"
      emptyMessage={getEmptyMessage(search.search, "No inventory items yet.")}
      getRowClassName={(item) =>
        item.quantity <= item.minStockLevel ? "bg-destructive/5" : undefined
      }
      className="h-[calc(100vh-13rem)]"
    />
  );
}
