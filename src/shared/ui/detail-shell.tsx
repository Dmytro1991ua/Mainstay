import { BackButton } from "./back-button";
import { PropRow } from "./prop-row";
import { DetailShellSkeleton } from "./skeleton";

import type * as React from "react";

export type DetailField = {
  label: string;
  value: React.ReactNode;
};

const DEFAULT_SKELETON_KEYS = ["field-a", "field-b", "field-c", "field-d", "field-e"];

type DetailShellProps = {
  backTo: string;
  title: string;
  /** Buttons rendered on the right side of the header card. */
  actions?: React.ReactNode;
  /** Optional banner rendered between the header and the fields card. */
  banner?: React.ReactNode;
  fields: DetailField[];
  /** Shows skeleton layout while data is loading. */
  isPending?: boolean;
  /**
   * Keys used to render skeleton rows when isPending is true.
   * Pass the expected field labels so the skeleton matches the loaded layout.
   */
  skeletonKeys?: string[];
};

export const DetailShell = ({
  backTo,
  title,
  actions,
  banner,
  fields,
  isPending,
  skeletonKeys = DEFAULT_SKELETON_KEYS,
}: DetailShellProps) => {
  if (isPending) return <DetailShellSkeleton skeletonKeys={skeletonKeys} />;

  return (
    <div className="flex flex-1 flex-col gap-4 min-h-0 overflow-y-auto">
      <div className="flex items-center gap-4 rounded-xl border border-border bg-panel px-5 py-4 shadow-card">
        <BackButton to={backTo} />
        <h1 className="flex-1 truncate text-base font-semibold text-text">{title}</h1>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {banner}
      <div className="rounded-xl border border-border bg-panel shadow-card">
        {fields.map(({ label, value }) => (
          <PropRow key={label} label={label}>
            {value}
          </PropRow>
        ))}
      </div>
    </div>
  );
};
