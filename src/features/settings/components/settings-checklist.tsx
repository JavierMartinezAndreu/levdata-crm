import { CheckCircle2, Clock3, Sparkles } from "lucide-react";

import { StatusChip } from "@/components/common/status-chip";
import type { SettingsChecklistItem } from "@/features/settings/types";
import {
  getChecklistStatusLabel,
  getChecklistStatusTone,
} from "@/features/settings/utils";

type SettingsChecklistProps = {
  items: SettingsChecklistItem[];
};

export function SettingsChecklist({ items }: SettingsChecklistProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const Icon =
          item.status === "ready"
            ? CheckCircle2
            : item.status === "pending"
              ? Clock3
              : Sparkles;

        return (
          <div
            key={item.id}
            className="rounded-2xl border border-[#DCEAF1]/70 bg-white p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#E8F8FB] text-[#00ABBD]">
                <Icon className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="font-extrabold text-[#071B3A]">{item.title}</p>

                  <StatusChip
                    label={getChecklistStatusLabel(item.status)}
                    tone={getChecklistStatusTone(item.status)}
                  />
                </div>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}