import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

type MetricTone = "primary" | "info" | "warning" | "success" | "danger" | "dark";

type MetricCardProps = {
  title: string;
  value: ReactNode;
  description?: string;
  icon: LucideIcon;
  variation?: string;
  variationDirection?: "up" | "down" | "flat";
  tone?: MetricTone;
  className?: string;
};

const toneClasses: Record<
  MetricTone,
  {
    icon: string;
    accent: string;
  }
> = {
  primary: {
    icon: "bg-[#E8F8FB] text-[#00ABBD]",
    accent: "from-[#00ABBD]",
  },
  info: {
    icon: "bg-sky-50 text-[#0099DD]",
    accent: "from-[#0099DD]",
  },
  warning: {
    icon: "bg-orange-50 text-[#FF9933]",
    accent: "from-[#FF9933]",
  },
  success: {
    icon: "bg-emerald-50 text-emerald-600",
    accent: "from-emerald-500",
  },
  danger: {
    icon: "bg-red-50 text-red-600",
    accent: "from-red-500",
  },
  dark: {
    icon: "bg-[#071B3A] text-white",
    accent: "from-[#071B3A]",
  },
};

const variationClasses = {
  up: "bg-emerald-50 text-emerald-700",
  down: "bg-red-50 text-red-700",
  flat: "bg-slate-100 text-slate-600",
};

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  variation,
  variationDirection = "flat",
  tone = "primary",
  className,
}: MetricCardProps) {
  const VariationIcon =
    variationDirection === "up"
      ? ArrowUpRight
      : variationDirection === "down"
        ? ArrowDownRight
        : Minus;

  return (
    <Card
      className={cn(
        "levdata-card group relative overflow-hidden rounded-[1.5rem] transition duration-300 hover:-translate-y-1 hover:shadow-xl",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r to-transparent",
          toneClasses[tone].accent,
        )}
      />

      <CardContent className="p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-2xl transition group-hover:scale-105",
              toneClasses[tone].icon,
            )}
          >
            <Icon className="size-5" />
          </div>

          {variation ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
                variationClasses[variationDirection],
              )}
            >
              <VariationIcon className="size-3.5" />
              {variation}
            </span>
          ) : null}
        </div>

        <p className="text-sm font-medium text-slate-500">{title}</p>

        <div className="mt-2 text-3xl font-extrabold tracking-tight text-[#071B3A]">
          {value}
        </div>

        {description ? (
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}