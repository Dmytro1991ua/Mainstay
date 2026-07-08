import type { TableStateHookParams } from "../types";

export const useSearchInTable = ({ tableState, onSetTableState }: TableStateHookParams) => {
  const search = tableState.search ?? "";

  const setSearch = (value: string) => {
    onSetTableState((prev) => ({ ...prev, search: value || undefined }));
  };

  return { search, setSearch };
};
