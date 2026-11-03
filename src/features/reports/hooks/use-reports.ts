import { useQuery } from "@tanstack/react-query";

import { useInfiniteQueryList } from "@/shared/hooks/use-crud";

import {
  fetchAssetReliability,
  fetchSpend,
  fetchTechnicianWorkload,
  fetchThroughput,
  type AssetReliabilityRow,
  type ReliabilityListParams,
  type SpendParams,
  type TechnicianListParams,
  type TechnicianWorkloadRow,
  type ThroughputParams,
} from "../api/reports.api";

export const REPORTS_KEY = "reports";

export const useReliabilityQuery = (params: ReliabilityListParams) =>
  useInfiniteQueryList<AssetReliabilityRow, ReliabilityListParams>(
    `${REPORTS_KEY}-assets`,
    params,
    fetchAssetReliability,
  );

export const useTechnicianWorkloadQuery = (params: TechnicianListParams) =>
  useInfiniteQueryList<TechnicianWorkloadRow, TechnicianListParams>(
    `${REPORTS_KEY}-technicians`,
    params,
    fetchTechnicianWorkload,
  );

export const useThroughputQuery = (params: ThroughputParams) =>
  useQuery({
    queryKey: [REPORTS_KEY, "throughput", params],
    queryFn: () => fetchThroughput(params),
    staleTime: 60_000,
  });

export const useSpendQuery = (params: SpendParams) =>
  useQuery({
    queryKey: [REPORTS_KEY, "spend", params],
    queryFn: () => fetchSpend(params),
    staleTime: 60_000,
  });
