"use client";

import { useMemo, useState } from "react";
import {
  Activity as ActivityIcon,
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  Search,
  XCircle,
} from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { MetricCard } from "@/components/common/metric-card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActivityTimelineItem } from "@/features/activities/components/activity-timeline-item";
import { CompleteActivityDialog } from "@/features/activities/components/complete-activity-dialog";
import type {
  Activity,
  ActivityStatus,
  ActivityType,
} from "@/features/activities/types";
import {
  filterActivities,
  getActivityStats,
  getActivityStatusLabel,
  getActivityTypeLabel,
  sortActivitiesByDate,
} from "@/features/activities/utils";

type ActivitiesClientPageProps = {
  activities: Activity[];
};

const viewOptions: Array<{
  label: string;
  value: "hoy" | "proximas" | "vencidas" | "todas";
}> = [
  { label: "Hoy", value: "hoy" },
  { label: "Próximas", value: "proximas" },
  { label: "Vencidas", value: "vencidas" },
  { label: "Todas", value: "todas" },
];

const statusOptions: Array<{ label: string; value: ActivityStatus | "all" }> = [
  { label: "Todos los estados", value: "all" },
  { label: "Pendiente", value: "pendiente" },
  { label: "Realizada", value: "realizada" },
  { label: "Cancelada", value: "cancelada" },
  { label: "Vencida", value: "vencida" },
];

const typeOptions: Array<{ value: ActivityType | "all"; label: string }> = [
  { value: "all", label: "Todos los tipos" },
  { value: "llamada", label: "Llamada" },
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "reunionFisica", label: "Reunión física" },
  { value: "googleMeet", label: "Google Meet" },
  { value: "notaInterna", label: "Nota interna" },
  { value: "tarea", label: "Tarea" },
  { value: "seguimiento", label: "Seguimiento" },
  { value: "envioPropuesta", label: "Envío propuesta" },
  { value: "revisionTecnica", label: "Revisión técnica" },
  { value: "soporteMantenimiento", label: "Soporte mantenimiento" },
];

export function ActivitiesClientPage({ activities }: ActivitiesClientPageProps) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"hoy" | "proximas" | "vencidas" | "todas">(
    "hoy",
  );
  const [status, setStatus] = useState<ActivityStatus | "all">("all");
  const [type, setType] = useState<ActivityType | "all">("all");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );

  const stats = useMemo(() => getActivityStats(activities), [activities]);

  const filteredActivities = useMemo(
    () =>
      sortActivitiesByDate(
        filterActivities({
          activities,
          search,
          status,
          type,
          view,
        }),
      ),
    [activities, search, status, type, view],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Seguimiento"
        title="Actividades"
        description="Organiza llamadas, emails, reuniones, tareas, seguimientos y soporte de mantenimiento."
        actions={
          <Button className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]">
            <ActivityIcon className="mr-2 size-4" />
            Nueva actividad
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Total"
          value={String(stats.total)}
          description="Actividades mock"
          icon={ActivityIcon}
          tone="primary"
          variation="mock"
          variationDirection="flat"
        />

        <MetricCard
          title="Hoy"
          value={String(stats.today)}
          description="Agenda del día"
          icon={CalendarCheck2}
          tone="info"
          variation="actual"
          variationDirection="flat"
        />

        <MetricCard
          title="Próximas"
          value={String(stats.upcoming)}
          description="Pendientes de realizar"
          icon={CalendarClock}
          tone="warning"
          variation="seguimiento"
          variationDirection="flat"
        />

        <MetricCard
          title="Vencidas"
          value={String(stats.overdue)}
          description="Requieren atención"
          icon={XCircle}
          tone="danger"
          variation="urgente"
          variationDirection="flat"
        />

        <MetricCard
          title="Realizadas"
          value={String(stats.completed)}
          description="Ya completadas"
          icon={CheckCircle2}
          tone="success"
          variation="+"
          variationDirection="up"
        />
      </section>

      <section className="levdata-card rounded-[1.75rem] p-4">
        <div className="mb-4 flex flex-wrap gap-2">
          {viewOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setView(option.value)}
              className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                view === option.value
                  ? "bg-[#071B3A] text-white"
                  : "bg-white text-slate-500 hover:bg-[#F6FAFC]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 xl:grid-cols-[1fr_220px_240px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por título, empresa, contacto, responsable o motivo..."
              className="h-12 rounded-2xl border-[#A1C7E0]/50 bg-white pl-11"
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as ActivityStatus | "all")
            }
            className="h-12 rounded-2xl border border-[#A1C7E0]/50 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none transition focus:border-[#00ABBD] focus:ring-4 focus:ring-cyan-100"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value === "all"
                  ? option.label
                  : getActivityStatusLabel(option.value)}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value as ActivityType | "all")
            }
            className="h-12 rounded-2xl border border-[#A1C7E0]/50 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none transition focus:border-[#00ABBD] focus:ring-4 focus:ring-cyan-100"
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value === "all"
                  ? option.label
                  : getActivityTypeLabel(option.value)}
              </option>
            ))}
          </select>
        </div>
      </section>

      {filteredActivities.length > 0 ? (
        <section className="relative space-y-5 before:absolute before:bottom-0 before:left-5 before:top-0 before:w-px before:bg-[#DCEAF1]">
          {filteredActivities.map((activity) => (
            <ActivityTimelineItem
              key={activity.id}
              activity={activity}
              onComplete={setSelectedActivity}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={ActivityIcon}
          title="No hay actividades con estos filtros"
          description="Prueba a cambiar la vista, el buscador, el tipo o el estado seleccionado."
        />
      )}

      <CompleteActivityDialog
        activity={selectedActivity}
        open={Boolean(selectedActivity)}
        onOpenChange={(open) => {
          if (!open) setSelectedActivity(null);
        }}
      />
    </div>
  );
}