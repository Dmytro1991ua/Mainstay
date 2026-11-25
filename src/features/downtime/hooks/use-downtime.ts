import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ASSETS_KEY } from "@/features/assets/hooks/use-assets";

import {
  deleteDowntime,
  endDowntime,
  fetchDowntime,
  startDowntime,
  type EndDowntimeInput,
  type StartDowntimeInput,
} from "../api/downtime.api";

export const useDowntime = (assetId: string) =>
  useQuery({
    queryKey: [ASSETS_KEY, assetId, "downtime"],
    queryFn: () => fetchDowntime(assetId),
    staleTime: 30_000,
  });

const useRefreshAfterChange = () => {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: [ASSETS_KEY] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
    ]);
};

export const useStartDowntime = (assetId: string) => {
  const refresh = useRefreshAfterChange();

  return useMutation({
    mutationFn: (data: StartDowntimeInput) => startDowntime(assetId, data),
    onSuccess: refresh,
  });
};

export const useDeleteDowntime = (assetId: string) => {
  const refresh = useRefreshAfterChange();

  return useMutation({
    mutationFn: (downtimeId: string) => deleteDowntime(assetId, downtimeId),
    onSuccess: refresh,
  });
};

export const useEndDowntime = (assetId: string) => {
  const refresh = useRefreshAfterChange();

  return useMutation({
    mutationFn: ({ downtimeId, data }: { downtimeId: string; data: EndDowntimeInput }) =>
      endDowntime(assetId, downtimeId, data),
    onSuccess: refresh,
  });
};
