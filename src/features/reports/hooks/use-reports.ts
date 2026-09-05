import { useQuery } from "@tanstack/react-query";

import { fetchAssetReliability, fetchThroughput, type ThroughputParams } from "../api/reports.api";

export const REPORTS_KEY = "reports";

export const useAssetReliabilityQuery = () =>
  useQuery({
    queryKey: [REPORTS_KEY, "assets"],
    queryFn: fetchAssetReliability,
    staleTime: 60_000,
  });

export const useThroughputQuery = (params: ThroughputParams) =>
  useQuery({
    queryKey: [REPORTS_KEY, "throughput", params],
    queryFn: () => fetchThroughput(params),
    staleTime: 60_000,
  });
