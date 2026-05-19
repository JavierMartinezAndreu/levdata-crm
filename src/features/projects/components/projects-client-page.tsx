"use client";

import { useMemo, useState } from "react";
import {
  CircleDollarSign,
  FolderKanban,
  PauseCircle,
  Search,
  TrendingUp,
  Truck,
} from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { MetricCard } from "@/components/common/metric-card";
import { MoneyValue } from "@/components/common/money-value";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/features/projects/components/project-card";
import type {
  Feature,
  Project,
  ProjectStatus,
  Sprint,
} from "@/features/projects/types";
import {
  filterProjects,
  getProjectStats,
  getProjectStatusLabel,
} from "@/features/projects/utils";

type ProjectsClientPageProps = {
  projects: Project[];
  sprints: Sprint[];
  features: Feature[];
};

const statusOptions: Array<{ label: string; value: ProjectStatus | "all" }> = [
  { label: "Todos los estados", value: "all" },
  { label: "Presupuestado", value: "presupuestado" },
  { label: "Aceptado", value: "aceptado" },
  { label: "En desarrollo", value: "enDesarrollo" },
  { label: "Pausado", value: "pausado" },
  { label: "Entregado", value: "entregado" },
  { label: "En mantenimiento", value: "enMantenimiento" },
  { label: "Cerrado", value: "cerrado" },
  { label: "Cancelado", value: "cancelado" },
];

export function ProjectsClientPage({
  projects,
  sprints,
  features,
}: ProjectsClientPageProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");

  const stats = useMemo(() => getProjectStats(projects), [projects]);

  const filteredProjects = useMemo(
    () => filterProjects({ projects, search, status }),
    [projects, search, status],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operaciones"
        title="Proyectos"
        description="Controla trabajos aceptados, sprints, funcionalidades, cobros, deuda y entregas."
        actions={
          <Button className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]">
            <FolderKanban className="mr-2 size-4" />
            Nuevo proyecto
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Activos"
          value={String(stats.active)}
          description="Aceptados, en desarrollo o mantenimiento"
          icon={FolderKanban}
          tone="primary"
          variation="operación"
          variationDirection="flat"
        />

        <MetricCard
          title="Pausados"
          value={String(stats.paused)}
          description="Requieren decisión o cobro"
          icon={PauseCircle}
          tone="warning"
          variation="control"
          variationDirection="flat"
        />

        <MetricCard
          title="Entregados este mes"
          value={String(stats.deliveredThisMonth)}
          description="Finalizados recientemente"
          icon={Truck}
          tone="success"
          variation="+"
          variationDirection="up"
        />

        <MetricCard
          title="Pendiente de cobrar"
          value={<MoneyValue value={stats.pendingPayment} size="lg" tone="warning" />}
          description="Importe total pendiente"
          icon={CircleDollarSign}
          tone="warning"
          variation="caja"
          variationDirection="flat"
        />

        <MetricCard
          title="Beneficio estimado"
          value={<MoneyValue value={stats.estimatedProfit} size="lg" tone="positive" />}
          description="Cobrado menos gastos"
          icon={TrendingUp}
          tone="success"
          variation="estimado"
          variationDirection="flat"
        />
      </section>

      <section className="levdata-card rounded-[1.75rem] p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por proyecto, empresa, descripción o responsable..."
              className="h-12 rounded-2xl border-[#A1C7E0]/50 bg-white pl-11"
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as ProjectStatus | "all")
            }
            className="h-12 rounded-2xl border border-[#A1C7E0]/50 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none transition focus:border-[#00ABBD] focus:ring-4 focus:ring-cyan-100"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value === "all"
                  ? option.label
                  : getProjectStatusLabel(option.value)}
              </option>
            ))}
          </select>
        </div>
      </section>

      {filteredProjects.length > 0 ? (
        <section className="grid gap-4 2xl:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              sprints={sprints}
              features={features}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={FolderKanban}
          title="No hay proyectos con estos filtros"
          description="Prueba a cambiar el buscador o el estado seleccionado."
        />
      )}
    </div>
  );
}