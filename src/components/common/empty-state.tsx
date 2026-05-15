import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#A1C7E0]/60 bg-white/60 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="mb-5 flex size-16 items-center justify-center rounded-3xl bg-[#E8F8FB] text-[#00ABBD]">
        <Icon className="size-8" />
      </div>

      <h3 className="text-xl font-extrabold tracking-tight text-[#071B3A]">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}