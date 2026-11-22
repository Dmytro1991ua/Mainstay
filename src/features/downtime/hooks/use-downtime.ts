import { useQuery } from "@tanstack/react-query";

import { fetchDowntime } from "../api/downtime.api";

export const DOWNTIME_KEY = "asset-downtime";

export const useDowntime = (assetId: string) =>
  useQuery({
    queryKey: [DOWNTIME_KEY, assetId],
    queryFn: () => fetchDowntime(assetId),
    staleTime: 30_000,
  });
