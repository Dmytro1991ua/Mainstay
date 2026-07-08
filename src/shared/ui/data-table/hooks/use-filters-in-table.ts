import type { ActiveFilters, TableStateHookParams } from "../types";

export const useFiltersInTable = ({ tableState, onSetTableState }: TableStateHookParams) => {
  const activeFilters: ActiveFilters = tableState.filters ?? {};

  const setFilters = (next: ActiveFilters) => {
    const hasActive = Object.values(next).some((vals) => vals.length > 0);

    onSetTableState((prev) => ({ ...prev, filters: hasActive ? next : undefined }));
  };

  return { activeFilters, setFilters };
};
