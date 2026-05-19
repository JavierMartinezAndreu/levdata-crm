import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, FolderKanban } from "lucide-react";

import { DateValue } from "@/components/common/date-value";
import { MoneyValue } from "@/components/common/money-value";
import { ProgressCard } from "@/components/common/progress-card";
import { StatusChip } from "@/components/common/status-chip";
import { Button } from "@/components/ui/button";
import type { Feature, Project, Sprint } from "@/features/projects/types";
import {
  getPaymentProgress,
  getProjectFeatures,
  getProjectSprints,
  getProjectStatusLabel,
  getProjectStatusTone,
  getTechnicalProgress,
} from "@/features/projects/utils";

type ProjectCardProps = {
  project: Project;
  sprints: Sprint[];
  features: Feature[];
};

export function ProjectCard({ project, sprints, features }: ProjectCardProps) {
  const projectSprints = getProjectSprints(project.id, sprints);
  const projectFeatures = getProjectFeatures(project.id, features);
  const technicalProgress = getTechnicalProgress(projectFeatures);
  const paymentProgress = getPaymentProgress(
    project.totalPresupuestado,
    project.totalCobrado,
  );
  const pending = project.totalPresupuestado - project.totalCobrado;
  const estimatedProfit = project.totalCobrado - project.gastos;
  const pendingFeatures = projectFeatures.filter(
    (feature) =>
      feature.estado !== "entregada" && feature.estado !== "cancelada",
  ).length;

  return (
    <article className="levdata-card group overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="levdata-gradient h-1.5" />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-[#E8F8FB] text-[#00ABBD]">
              <FolderKanban className="size-6" />
            </div>

            <h2 className="truncate text-lg font-extrabold tracking-tight text-[#071B3A]">
              {project.nombre}
            </h2>

            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <Building2 className="size-4 text-[#0099DD]" />
              {project.empresaNombre}
            </p>
          </div>

          <StatusChip
            label={getProjectStatusLabel(project.estado)}
            tone={getProjectStatusTone(project.estado)}
          />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <ProgressCard
            title="Progreso técnico"
            description="Avance funcional"
            value={technicalProgress}
            tone="primary"
          />

          <ProgressCard
            title="Progreso de cobro"
            description="Cobrado sobre presupuesto"
            value={paymentProgress}
            tone="warning"
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <MiniStat label="Presupuesto" value={project.totalPresupuestado} />
          <MiniStat label="Cobrado" value={project.totalCobrado} tone="positive" />
          <MiniStat label="Pendiente" value={pending} tone="warning" />
          <MiniStat label="Beneficio est." value={estimatedProfit} tone="positive" />
        </div>

        <div className="mt-5 grid gap-3 rounded-2xl bg-[#F6FAFC] p-4 sm:grid-cols-3">
          <SmallText label="Sprints" value={String(projectSprints.length)} />
          <SmallText
            label="Func. pendientes"
            value={String(pendingFeatures)}
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Fecha objetivo
            </p>
            <div className="mt-1">
              <DateValue value={project.fechaObjetivo} />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-[#DCEAF1]/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays className="size-4 text-[#00ABBD]" />
            Responsable: {project.responsableNombre}
          </div>

          <Button
            asChild
            variant="outline"
            className="rounded-2xl border-[#A1C7E0]/60 bg-white"
          >
            <Link href={`/proyectos/${project.id}`}>
              Ver detalle
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

type MiniStatProps = {
  label: string;
  value: number;
  tone?: "default" | "positive" | "warning" | "danger" | "muted";
};

function MiniStat({ label, value, tone = "default" }: MiniStatProps) {
  return (
    <div className="rounded-2xl bg-[#F6FAFC] p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <MoneyValue value={value} size="sm" tone={tone} />
    </div>
  );
}

type SmallTextProps = {
  label: string;
  value: string;
};

function SmallText({ label, value }: SmallTextProps) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-extrabold text-[#071B3A]">{value}</p>
    </div>
  );
}