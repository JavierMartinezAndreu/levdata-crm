"use client";

import { useState } from "react";
import { CalendarDays, CircleDollarSign, Globe, Rocket } from "lucide-react";

import { DateValue } from "@/components/common/date-value";
import { MoneyValue } from "@/components/common/money-value";
import { ProgressCard } from "@/components/common/progress-card";
import { SectionCard } from "@/components/common/section-card";
import { StatusChip } from "@/components/common/status-chip";
import { SprintCard } from "@/features/projects/components/sprint-card";
import type { Feature, Project, Sprint } from "@/features/projects/types";
import {
  getDeliveryProgress,
  getFeatureStatusLabel,
  getFeatureStatusTone,
  getPaymentProgress,
  getTechnicalProgress,
} from "@/features/projects/utils";

type ProjectDetailTabsProps = {
  project: Project;
  sprints: Sprint[];
  features: Feature[];
};

type TabValue = "resumen" | "sprints" | "funcionalidades" | "cobros" | "notas";

const tabs: Array<{ value: TabValue; label: string }> = [
  { value: "resumen", label: "Resumen" },
  { value: "sprints", label: "Sprints" },
  { value: "funcionalidades", label: "Funcionalidades" },
  { value: "cobros", label: "Cobros" },
  { value: "notas", label: "Notas" },
];

export function ProjectDetailTabs({
  project,
  sprints,
  features,
}: ProjectDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("resumen");

  const technicalProgress = getTechnicalProgress(features);
  const deliveryProgress = getDeliveryProgress(features);
  const paymentProgress = getPaymentProgress(
    project.totalPresupuestado,
    project.totalCobrado,
  );

  const pending = project.totalPresupuestado - project.totalCobrado;

  return (
    <section className="space-y-6">
      <div className="levdata-card w-full rounded-[1.75rem] p-2">
        <div className="flex w-full gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={[
                  "shrink-0 rounded-2xl px-5 py-3 text-sm font-extrabold transition",
                  "min-w-[130px] text-center",
                  isActive
                    ? "bg-[#071B3A] text-white shadow-lg shadow-slate-900/10"
                    : "bg-white text-slate-500 hover:bg-[#F6FAFC] hover:text-[#071B3A]",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full min-w-0">
        {activeTab === "resumen" ? (
          <div className="space-y-6">
            <section className="grid gap-4 lg:grid-cols-3">
              <ProgressCard
                title="Progreso técnico"
                description="Avance funcional"
                value={technicalProgress}
                icon={Rocket}
                tone="primary"
              />

              <ProgressCard
                title="Progreso de entrega"
                description="Funcionalidades entregadas"
                value={deliveryProgress}
                icon={CalendarDays}
                tone="success"
              />

              <ProgressCard
                title="Progreso de cobro"
                description="Cobrado sobre presupuesto"
                value={paymentProgress}
                icon={CircleDollarSign}
                tone="warning"
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <SectionCard
                title="Información del proyecto"
                description="Datos operativos principales."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoBox label="Empresa" value={project.empresaNombre} />
                  <InfoBox
                    label="Responsable"
                    value={project.responsableNombre}
                  />
                  <InfoBox
                    label="Contacto"
                    value={project.contactoPrincipalNombre}
                  />
                  <InfoBox
                    label="Fecha objetivo"
                    value={<DateValue value={project.fechaObjetivo} />}
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Enlaces técnicos"
                description="Repositorio, staging y producción si existen."
              >
                <div className="space-y-3">
                  <LinkBox label="Repositorio" value={project.repositorioUrl} />
                  <LinkBox label="Staging" value={project.stagingUrl} />
                  <LinkBox label="Producción" value={project.produccionUrl} />
                </div>
              </SectionCard>
            </section>
          </div>
        ) : null}

        {activeTab === "sprints" ? (
          <div className="space-y-5">
            {sprints.length > 0 ? (
              sprints.map((sprint) => (
                <SprintCard key={sprint.id} sprint={sprint} features={features} />
              ))
            ) : (
              <SectionCard title="Sin sprints" description="No hay sprints mock.">
                <p className="text-sm text-slate-500">
                  Este proyecto todavía no tiene sprints definidos.
                </p>
              </SectionCard>
            )}
          </div>
        ) : null}

        {activeTab === "funcionalidades" ? (
          <SectionCard
            title="Funcionalidades del proyecto"
            description="Vista global de funcionalidades de todos los sprints."
          >
            <div className="grid gap-3 xl:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="rounded-2xl border border-[#DCEAF1]/70 bg-white p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-extrabold text-[#071B3A]">
                        {feature.titulo}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {feature.descripcion}
                      </p>
                    </div>

                    <StatusChip
                      label={getFeatureStatusLabel(feature.estado)}
                      tone={getFeatureStatusTone(feature.estado)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}

        {activeTab === "cobros" ? (
          <SectionCard
            title="Resumen de cobros"
            description="Versión mock. En la fase financiera se conectará con cobros reales."
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <InfoBox
                label="Presupuestado"
                value={<MoneyValue value={project.totalPresupuestado} size="lg" />}
              />
              <InfoBox
                label="Cobrado"
                value={
                  <MoneyValue
                    value={project.totalCobrado}
                    size="lg"
                    tone="positive"
                  />
                }
              />
              <InfoBox
                label="Pendiente"
                value={<MoneyValue value={pending} size="lg" tone="warning" />}
              />
            </div>
          </SectionCard>
        ) : null}

        {activeTab === "notas" ? (
          <SectionCard
            title="Notas privadas"
            description="Notas internas de LevData sobre alcance, riesgos y próximos pasos."
          >
            <p className="text-sm leading-7 text-slate-500">
              {project.notasPrivadas}
            </p>
          </SectionCard>
        ) : null}
      </div>
    </section>
  );
}

type InfoBoxProps = {
  label: string;
  value: React.ReactNode;
};

function InfoBox({ label, value }: InfoBoxProps) {
  return (
    <div className="rounded-2xl bg-[#F6FAFC] p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="mt-2 text-sm font-semibold text-[#071B3A]">{value}</div>
    </div>
  );
}

type LinkBoxProps = {
  label: string;
  value: string;
};

function LinkBox({ label, value }: LinkBoxProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[#F6FAFC] p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#E8F8FB] text-[#00ABBD]">
        <Globe className="size-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-all text-sm font-semibold text-[#071B3A]">
          {value || "No definido todavía"}
        </p>
      </div>
    </div>
  );
}