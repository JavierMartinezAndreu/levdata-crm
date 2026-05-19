import Link from "next/link";
import { ArrowLeft, FolderKanban, Plus } from "lucide-react";

import { MoneyValue } from "@/components/common/money-value";
import { StatGroup } from "@/components/common/stat-group";
import { StatusChip } from "@/components/common/status-chip";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ProjectDetailTabs } from "@/features/projects/components/project-detail-tabs";
import {
  mockFeatures,
  mockProjects,
  mockSprints,
} from "@/features/projects/data/mock-projects";
import {
  getProjectFeatures,
  getProjectSprints,
  getProjectStatusLabel,
  getProjectStatusTone,
} from "@/features/projects/utils";

type ProjectDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  const project = mockProjects.find((item) => item.id === id);

  if (!project) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Proyecto no encontrado"
          title="No hemos encontrado este proyecto"
          description="Es posible que el identificador no exista en los datos mock."
          actions={
            <Button asChild variant="outline" className="rounded-2xl bg-white">
              <Link href="/proyectos">
                <ArrowLeft className="mr-2 size-4" />
                Volver a proyectos
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  const projectSprints = getProjectSprints(project.id, mockSprints);
  const projectFeatures = getProjectFeatures(project.id, mockFeatures);
  const pending = project.totalPresupuestado - project.totalCobrado;
  const estimatedProfit = project.totalCobrado - project.gastos;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Detalle de proyecto"
        title={project.nombre}
        description={`${project.empresaNombre} · ${project.contactoPrincipalNombre}`}
        actions={
          <>
            <Button asChild variant="outline" className="rounded-2xl bg-white">
              <Link href="/proyectos">
                <ArrowLeft className="mr-2 size-4" />
                Volver
              </Link>
            </Button>

            <Button className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]">
              <Plus className="mr-2 size-4" />
              Nuevo sprint
            </Button>

            <Button className="rounded-2xl bg-[#071B3A] text-white hover:bg-[#0B2A57]">
              Nuevo cobro
            </Button>
          </>
        }
      />

      <section className="overflow-hidden rounded-[2rem] bg-[#071B3A] shadow-2xl shadow-slate-900/10">
        <div className="levdata-gradient h-2" />

        <div className="grid gap-8 p-7 text-white lg:grid-cols-[1fr_0.85fr] lg:p-10">
          <div>
            <div className="mb-5 flex size-16 items-center justify-center rounded-3xl bg-white/10 text-[#00ABBD] ring-1 ring-white/10">
              <FolderKanban className="size-8" />
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight">
              {project.nombre}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
              {project.descripcion}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <StatusChip
                label={getProjectStatusLabel(project.estado)}
                tone={getProjectStatusTone(project.estado)}
              />
              <StatusChip
                label={`Responsable: ${project.responsableNombre}`}
                tone="primary"
                dot={false}
              />
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-white/8 p-4 ring-1 ring-white/10">
            <StatGroup
              className="border-white/10 bg-white/5 xl:grid-cols-2"
              items={[
                {
                  label: "Presupuesto",
                  value: (
                    <MoneyValue
                      value={project.totalPresupuestado}
                      size="lg"
                      className="text-white"
                    />
                  ),
                  detail: "Total del proyecto",
                },
                {
                  label: "Cobrado",
                  value: (
                    <MoneyValue
                      value={project.totalCobrado}
                      size="lg"
                      className="text-white"
                    />
                  ),
                  detail: "Registrado",
                },
                {
                  label: "Pendiente",
                  value: (
                    <MoneyValue
                      value={pending}
                      size="lg"
                      tone="warning"
                      className="text-[#FF9933]"
                    />
                  ),
                  detail: "Por cobrar",
                },
                {
                  label: "Beneficio est.",
                  value: (
                    <MoneyValue
                      value={estimatedProfit}
                      size="lg"
                      className="text-white"
                    />
                  ),
                  detail: "Cobrado - gastos",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <ProjectDetailTabs
        project={project}
        sprints={projectSprints}
        features={projectFeatures}
      />
    </div>
  );
}