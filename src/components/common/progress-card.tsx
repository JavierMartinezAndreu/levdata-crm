import type { LucideIcon } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ProgressCardProps = {
  title: string;
  value: number;
  description?: string;
  icon?: LucideIcon;
  footer?: string;
  tone?: "primary" | "success" | "warning" | "info";
  className?: string;
};

const toneClasses = {
  primary: "bg-[#E8F8FB] text-[#00ABBD]",
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-orange-50 text-[#FF9933]",
  info: "bg-sky-50 text-[#0099DD]",
};

export function ProgressCard({
  title,
  value,
  description,
  icon: Icon,
  footer,
  tone = "primary",
  className,
}: ProgressCardProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <Card className={cn("levdata-card rounded-[1.5rem]", className)}>
      <CardContent className="p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#071B3A]">{title}</p>

            {description ? (
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {description}
              </p>
            ) : null}
          </div>

          {Icon ? (
            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-2xl",
                toneClasses[tone],
              )}
            >
              <Icon className="size-5" />
            </div>
          ) : null}
        </div>

        <div className="flex items-end justify-between gap-4">
          <p className="text-3xl font-extrabold tracking-tight text-[#071B3A]">
            {safeValue}%
          </p>

          {footer ? (
            <p className="text-right text-xs font-semibold text-slate-500">
              {footer}
            </p>
          ) : null}
        </div>

        <Progress value={safeValue} className="mt-4 h-3 rounded-full" />
      </CardContent>
    </Card>
  );
}