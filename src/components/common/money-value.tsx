import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";

type MoneyValueProps = {
  value: number;
  size?: "sm" | "md" | "lg" | "xl";
  tone?: "default" | "positive" | "warning" | "danger" | "muted";
  className?: string;
};

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl",
  xl: "text-3xl sm:text-4xl",
};

const toneClasses = {
  default: "text-[#071B3A]",
  positive: "text-emerald-600",
  warning: "text-[#FF9933]",
  danger: "text-red-600",
  muted: "text-slate-500",
};

export function MoneyValue({
  value,
  size = "md",
  tone = "default",
  className,
}: MoneyValueProps) {
  return (
    <span
      className={cn(
        "font-extrabold tabular-nums tracking-tight",
        sizeClasses[size],
        toneClasses[tone],
        className,
      )}
    >
      {formatCurrency(value)}
    </span>
  );
}