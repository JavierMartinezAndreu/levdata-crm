import { CalendarDays } from "lucide-react";

import { formatHumanDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

type DateValueProps = {
  value: string | Date;
  showIcon?: boolean;
  className?: string;
};

export function DateValue({
  value,
  showIcon = true,
  className,
}: DateValueProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium text-slate-500",
        className,
      )}
    >
      {showIcon ? <CalendarDays className="size-4 text-[#0099DD]" /> : null}
      {formatHumanDate(value)}
    </span>
  );
}