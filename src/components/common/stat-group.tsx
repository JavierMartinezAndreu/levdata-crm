import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatGroupItem = {
  label: string;
  value: ReactNode;
  detail?: string;
};

type StatGroupProps = {
  items: StatGroupItem[];
  className?: string;
};

export function StatGroup({ items, className }: StatGroupProps) {
  return (
    <div
      className={cn(
        "grid gap-3 rounded-[1.5rem] border border-[#DCEAF1]/70 bg-[#F6FAFC]/80 p-3 sm:grid-cols-2 xl:grid-cols-4",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            {item.label}
          </p>

          <div className="mt-2 text-xl font-extrabold text-[#071B3A]">
            {item.value}
          </div>

          {item.detail ? (
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {item.detail}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}