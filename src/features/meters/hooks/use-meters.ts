import { RECURRING_TASKS_KEY } from "@/features/recurring-tasks/hooks/use-recurring-tasks";
import { TASKS_KEY } from "@/features/tasks/hooks/use-tasks";
import { useInfiniteQueryList, useMutation } from "@/shared/hooks/use-crud";

import {
  createMeter,
  deleteMeter,
  fetchMeterReadings,
  fetchMeters,
  recordReading,
  updateMeter,
  type Meter,
  type MeterListParams,
  type MeterReading,
  type UpdateMeterInput,
  type RecordReadingInput,
} from "../api/meters.api";

export const METERS_KEY = "meters";
export const METER_READINGS_KEY = `${METERS_KEY}-readings`;

// The asset's maintenance history lives under this key (see useAssetTasks).
const ASSET_TASKS_KEY = "assets-tasks";
const USERS_KEY = "users";

export const useMetersQuery = (params: MeterListParams, options?: { enabled?: boolean }) =>
  useInfiniteQueryList<Meter, MeterListParams>(METERS_KEY, params, fetchMeters, options);

export const useMeterReadings = (meterId: string, options?: { enabled?: boolean }) =>
  useInfiniteQueryList<MeterReading, { meterId: string; page?: number }>(
    METER_READINGS_KEY,
    { meterId },
    (params) => fetchMeterReadings(params.meterId, params.page),
    options,
  );

export const useCreateMeter = () => useMutation(METERS_KEY, createMeter);

export const useUpdateMeter = () =>
  useMutation(METERS_KEY, ({ id, data }: { id: string; data: UpdateMeterInput }) =>
    updateMeter(id, data),
  );

export const useDeleteMeter = () => useMutation(METERS_KEY, deleteMeter);

// A reading can cross a schedule's threshold and auto-create a maintenance task, so besides the
// meter and its history this also refreshes schedules (next due moves) and tasks.
export const useRecordReading = () =>
  useMutation(
    METERS_KEY,
    ({ id, data }: { id: string; data: RecordReadingInput }) => recordReading(id, data),
    {
      alsoInvalidate: [
        METER_READINGS_KEY,
        RECURRING_TASKS_KEY,
        TASKS_KEY,
        ASSET_TASKS_KEY,
        USERS_KEY,
      ],
    },
  );
