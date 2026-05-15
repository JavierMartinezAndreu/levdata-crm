import { cn } from "@/lib/utils";

type StatusTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "dark"
  | "primary";

type StatusChipProps = {
  label: string;
  tone?: StatusTone;
  dot?: boolean;
  className?: string;
};

const toneClasses: Record<StatusTone, string> = {
  neutral: "bg-slate-100 text-slate-600 ring-slate-200",
  info: "bg-sky-50 text-[#0099DD] ring-sky-100",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  warning: "bg-orange-50 text-[#D97706] ring-orange-100",
  danger: "bg-red-50 text-red-700 ring-red-100",
  dark: "bg-[#071B3A] text-white ring-[#071B3A]",
  primary: "bg-[#E8F8FB] text-[#00ABBD] ring-cyan-100",
};

const dotClasses: Record<StatusTone, string> = {
  neutral: "bg-slate-400",
  info: "bg-[#0099DD]",
  success: "bg-emerald-500",
  warning: "bg-[#FF9933]",
  danger: "bg-red-500",
  dark: "bg-white",
  primary: "bg-[#00ABBD]",
};

export function StatusChip({
  label,
  tone = "neutral",
  dot = true,
  className,
}: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1",
        toneClasses[tone],
        className,
      )}
    >
      {dot ? (
        <span className={cn("size-1.5 rounded-full", dotClasses[tone])} />
      ) : null}
      {label}
    </span>
  );
}