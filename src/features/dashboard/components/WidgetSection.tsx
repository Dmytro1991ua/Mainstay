import type { ReactNode } from "react";

type WidgetSectionProps = {
  title: string;
  loading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
};

export const WidgetSection = ({ title, loading, skeleton, children }: WidgetSectionProps) => (
  <section className="flex flex-col">
    <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-text-3">
      {title}
    </h2>
    {loading ? (
      skeleton
    ) : (
      <div className="flex flex-1 flex-col rounded-xl border border-accent bg-panel p-4 shadow-card transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg min-h-72">
        {children}
      </div>
    )}
  </section>
);
