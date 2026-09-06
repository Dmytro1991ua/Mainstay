import { useQuery } from "@tanstack/react-query";

import { useInfiniteQueryList } from "@/shared/hooks/use-crud";

import {
  fetchAssetReliability,
  fetchThroughput,
  type AssetReliabilityRow,
  type ReliabilityListParams,
  type ThroughputParams,
} from "../api/reports.api";

export const REPORTS_KEY = "reports";

export const useReliabilityQuery = (params: ReliabilityListParams) =>
  useInfiniteQueryList<AssetReliabilityRow, ReliabilityListParams>(
    `${REPORTS_KEY}-assets`,
    params,
    fetchAssetReliability,
  );

export const useThroughputQuery = (params: ThroughputParams) =>
  useQuery({
    queryKey: [REPORTS_KEY, "throughput", params],
    queryFn: () => fetchThroughput(params),
    staleTime: 60_000,
  });
