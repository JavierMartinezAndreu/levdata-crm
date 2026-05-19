"use client";

import { CalendarClock, CheckCircle2 } from "lucide-react";

import { DateValue } from "@/components/common/date-value";
import { StatusChip } from "@/components/common/status-chip";
import { Button } from "@/components/ui/button";
import type { Activity } from "@/features/activities/types";
import {
  getActivityStatusLabel,
  getActivityStatusTone,
  getActivityTypeIcon,
  getActivityTypeLabel,
} from "@/features/activities/utils";

type ActivityTimelineItemProps = {
  activity: Activity;
  onComplete: (activity: Activity) => void;
};

export function ActivityTimelineItem({
  activity,
  onComplete,
}: ActivityTimelineItemProps) {
  const TypeIcon = getActivityTypeIcon(activity.tipo);

  return (
    <article className="relative pl-9">
      <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-2xl bg-[#E8F8FB] text-[#00ABBD] ring-8 ring-white">
        <TypeIcon className="size-5" />
      </div>

      <div className="levdata-card rounded-[1.75rem] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusChip
                label={getActivityTypeLabel(activity.tipo)}
                tone="primary"
                dot={false}
              />
              <StatusChip
                label={getActivityStatusLabel(activity.estado)}
                tone={getActivityStatusTone(activity.estado)}
              />
            </div>

            <h2 className="mt-3 text-lg font-extrabold text-[#071B3A]">
              {activity.titulo}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {activity.motivoPrevisto}
            </p>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock className="size-4 text-[#0099DD]" />
                <DateValue
                  value={activity.fechaHoraInicio}
                  showIcon={false}
                  className="text-sm"
                />
              </span>

              {activity.empresaNombre ? (
                <span className="font-semibold text-[#071B3A]">
                  {activity.empresaNombre}
                </span>
              ) : (
                <span className="font-semibold text-[#071B3A]">
                  Actividad interna
                </span>
              )}

              <span>Responsable: {activity.responsableNombre}</span>
            </div>

            {activity.contactosNombres.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {activity.contactosNombres.map((contact) => (
                  <StatusChip
                    key={contact}
                    label={contact}
                    tone="neutral"
                    dot={false}
                  />
                ))}
              </div>
            ) : null}

            {activity.resolucion ? (
              <div className="mt-4 rounded-2xl bg-emerald-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                  Resolución
                </p>
                <p className="mt-1 text-sm leading-6 text-emerald-800">
                  {activity.resolucion}
                </p>
              </div>
            ) : null}
          </div>

          {activity.estado === "pendiente" || activity.estado === "vencida" ? (
            <Button
              type="button"
              onClick={() => onComplete(activity)}
              className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
            >
              <CheckCircle2 className="mr-2 size-4" />
              Completar
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}