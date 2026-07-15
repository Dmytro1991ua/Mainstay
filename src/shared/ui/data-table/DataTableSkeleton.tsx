import { Skeleton } from "@/shared/ui/skeleton";

type DataTableSkeletonProps = {
  colCount: number;
  rowCount?: number;
};

export const DataTableSkeleton = ({ colCount, rowCount = 20 }: DataTableSkeletonProps) => (
  <tbody>
    {Array.from({ length: rowCount }, (_, i) => `skeleton-row-${i}`).map((rowKey) => (
      <tr key={rowKey} className="border-b border-border">
        {Array.from({ length: colCount }, (_, j) => `${rowKey}-cell-${j}`).map((cellKey) => (
          <td key={cellKey} className="px-3 py-3">
            <Skeleton className="h-4 w-full rounded" />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);
