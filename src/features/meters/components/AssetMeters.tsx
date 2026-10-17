import { AlertTriangle, Gauge, Plus, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { RowActions } from "@/shared/ui/row-actions";
import { Skeleton } from "@/shared/ui/skeleton";
import { formatReading, formatTimeAgo } from "@/shared/utils";

import { useMeterDelete } from "../hooks/use-meter-delete";
import { useMeterForm } from "../hooks/use-meter-form";
import { useMetersQuery } from "../hooks/use-meters";

import { MeterDeleteDialog } from "./MeterDeleteDialog";
import { MeterFormSheet } from "./MeterFormSheet";

const SKELETON_KEYS = ["m1", "m2"];

type AssetMetersProps = {
  assetId: string;
  canManage: boolean;
};

export const AssetMeters = ({ assetId, canManage }: AssetMetersProps) => {
  const { data, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useMetersQuery({ assetId, limit: 50, sortBy: "name", sortOrder: "asc" });

  const { sheetMode, form, openAdd, openEdit, closeSheet, handleSave, isSaving } =
    useMeterForm(assetId);
  const { deleteTarget, openDelete, closeDelete, handleDelete, isDeleting } = useMeterDelete();

  const meters = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.meta.total ?? 0;

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
            <li
              key={meter.id}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-panel-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text">{meter.name}</p>
                <p className="text-xs text-text-3">
                  Last reading {formatTimeAgo(meter.lastReadingAt)}
                </p>
              </div>
              <span className="shrink-0 text-sm font-medium tabular-nums text-text">
                {formatReading(meter.currentReading, meter.unit)}
              </span>
              {canManage && (
                <RowActions
                  label={meter.name}
                  onEdit={() => openEdit(meter)}
                  onDelete={() => openDelete(meter)}
                />
              )}
            </li>
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
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-text">Meters{data ? ` (${total})` : ""}</h2>
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
    </section>
  );
};
