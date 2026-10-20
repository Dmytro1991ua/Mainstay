import { AlertTriangle, Gauge, Plus, RotateCcw } from "lucide-react";

import { useRecurringTasksQuery } from "@/features/recurring-tasks/hooks/use-recurring-tasks";
import { flattenPages, getTotal } from "@/shared/hooks/use-crud";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { Skeleton } from "@/shared/ui/skeleton";

import { useMeterDelete } from "../hooks/use-meter-delete";
import { useMeterForm } from "../hooks/use-meter-form";
import { useMetersQuery } from "../hooks/use-meters";
import { useReadingForm } from "../hooks/use-reading-form";
import { getNextServiceLines } from "../utils";

import { MeterDeleteDialog } from "./MeterDeleteDialog";
import { MeterFormSheet } from "./MeterFormSheet";
import { MeterRow } from "./MeterRow";
import { RecordReadingDialog } from "./RecordReadingDialog";

const SKELETON_KEYS = ["m1", "m2"];

type AssetMetersProps = {
  assetId: string;
  canManage: boolean;
};

export const AssetMeters = ({ assetId, canManage }: AssetMetersProps) => {
  const { data, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useMetersQuery({ assetId, limit: 50, sortBy: "name", sortOrder: "asc" });
  const { data: schedules } = useRecurringTasksQuery({ isActive: true }, { enabled: canManage });

  const meters = flattenPages(data);
  const total = getTotal(data);

  const { sheetMode, form, openAdd, openEdit, closeSheet, handleSave, isSaving } =
    useMeterForm(assetId);
  const { deleteTarget, openDelete, closeDelete, handleDelete, isDeleting } = useMeterDelete();
  const {
    target: recordTarget,
    openRecord,
    closeRecord,
    handleRecord,
    isRecording,
  } = useReadingForm(meters);

  const renderContent = () => {
    if (isError) {
      return (
        <EmptyState
          icon={AlertTriangle}
          message="Couldn't load meters"
          description="The server didn't respond."
          variant="red"
          action={
            <Button onClick={() => refetch()}>
              <RotateCcw className="size-3.5" />
              Retry
            </Button>
          }
        />
      );
    }

    if (isPending) {
      return (
        <div className="flex flex-col gap-2">
          {SKELETON_KEYS.map((key) => (
            <Skeleton key={key} className="h-11 w-full rounded-lg" />
          ))}
        </div>
      );
    }

    if (meters.length === 0) {
      return (
        <EmptyState
          icon={Gauge}
          message="No meters"
          description="Track engine hours, mileage or cycles to schedule maintenance by usage."
          action={
            canManage ? (
              <Button onClick={openAdd}>
                <Plus className="size-3.5" />
                Add meter
              </Button>
            ) : undefined
          }
        />
      );
    }

    return (
      <>
        <ul className="flex flex-col gap-1">
          {meters.map((meter) => (
            <MeterRow
              key={meter.id}
              meter={meter}
              canManage={canManage}
              serviceLines={getNextServiceLines(meter, schedules ?? [])}
              onRecord={openRecord}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </ul>
        {hasNextPage && (
          <div className="mt-3 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading…" : `Load more (${meters.length} of ${total})`}
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <section className="rounded-xl border border-border bg-panel p-5 shadow-card">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-text">Meters{data ? ` (${total})` : ""}</h2>
          <p className="mt-0.5 text-xs text-text-3">
            Track usage like engine hours or kilometres. Maintenance schedules can create tasks
            automatically when a meter reaches a set reading.
          </p>
        </div>
        {canManage && meters.length > 0 && (
          <Button variant="outline" size="sm" onClick={openAdd}>
            <Plus className="size-3.5" />
            Add meter
          </Button>
        )}
      </div>
      {renderContent()}
      <MeterFormSheet
        sheetMode={sheetMode}
        form={form}
        onSave={handleSave}
        onClose={closeSheet}
        isSaving={isSaving}
      />
      <MeterDeleteDialog
        target={deleteTarget}
        onConfirm={handleDelete}
        onClose={closeDelete}
        isDeleting={isDeleting}
      />
      <RecordReadingDialog
        key={recordTarget?.id}
        target={recordTarget}
        onConfirm={handleRecord}
        onClose={closeRecord}
        isRecording={isRecording}
      />
    </section>
  );
};
