"use client";

import { useMemo } from "react";
import {
  Activity,
  CircleDollarSign,
  LineChart,
  Percent,
  Repeat,
  Target,
  TrendingUp,
} from "lucide-react";

import { MetricCard } from "@/components/common/metric-card";
import { MoneyValue } from "@/components/common/money-value";
import { SectionCard } from "@/components/common/section-card";
import { StatusChip } from "@/components/common/status-chip";
import { PageHeader } from "@/components/layout/page-header";
import { SalesFunnelChart } from "@/features/stats/components/sales-funnel-chart";
import { StatsMonthlyChart } from "@/features/stats/components/stats-monthly-chart";
import { WorkloadChart } from "@/features/stats/components/workload-chart";
import {
  maintenanceMetricsData,
  monthlyPerformanceData,
  projectProfitabilityData,
  salesFunnelData,
  userWorkloadData,
} from "@/features/stats/data/mock-stats";
import {
  getBestProjects,
  getHighestWorkloadUsers,
  getStatsSummary,
} from "@/features/stats/utils";
import type { ReactNode } from "react";

export function StatsClientPage() {
  const summary = useMemo(
    () =>
      getStatsSummary({
        monthly: monthlyPerformanceData,
        projects: projectProfitabilityData,
        workload: userWorkloadData,
        funnel: salesFunnelData,
        maintenance: maintenanceMetricsData,
      }),
    [],
  );

  const bestProjects = useMemo(
    () => getBestProjects(projectProfitabilityData),
    [],
  );

  const workloadUsers = useMemo(
    () => getHighestWorkloadUsers(userWorkloadData),
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Análisis"
        title="Estadísticas"
        description="Analiza rendimiento comercial, operativo, financiero y carga de trabajo de LevData."
      />

      <section className="overflow-hidden rounded-[2rem] bg-[#071B3A] shadow-2xl shadow-slate-900/10">
        <div className="levdata-gradient h-2" />

        <div className="grid gap-8 p-7 text-white lg:grid-cols-[1fr_0.75fr] lg:p-10">
          <div>
            <p className="text-sm font-medium text-[#A1C7E0]">
              Visión ejecutiva
            </p>

            <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              Mide lo que genera ventas, margen y control operativo.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Esta pantalla resume la salud del negocio: conversión comercial,
              beneficio, margen por proyecto, deuda recurrente y carga interna.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <StatusChip label="Comercial" tone="primary" />
              <StatusChip label="Operaciones" tone="info" />
              <StatusChip label="Finanzas" tone="warning" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HeroStat label="Conversión" value={`${summary.conversionRate}%`} />
            <HeroStat label="Margen medio" value={`${summary.averageMargin}%`} />
            <HeroStat
              label="MRR"
              value={<MoneyValue value={summary.totalMrr} className="text-white" />}
            />
            <HeroStat
              label="Deuda"
              value={
                <MoneyValue
                  value={summary.totalDebt}
                  tone="warning"
                  className="text-[#FF9933]"
                />
              }
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Ingresos totales"
          value={<MoneyValue value={summary.totalIncome} size="lg" tone="positive" />}
          description="Ingresos mock acumulados"
          icon={CircleDollarSign}
          tone="success"
          variation="+"
          variationDirection="up"
        />

        <MetricCard
          title="Beneficio total"
          value={<MoneyValue value={summary.totalProfit} size="lg" />}
          description="Ingresos menos gastos"
          icon={TrendingUp}
          tone="primary"
          variation="estimado"
          variationDirection="flat"
        />

        <MetricCard
          title="Conversión comercial"
          value={`${summary.conversionRate}%`}
          description={`${summary.totalWon} ganadas de ${summary.totalOpportunities}`}
          icon={Percent}
          tone="warning"
          variation="pipeline"
          variationDirection="flat"
        />

        <MetricCard
          title="Actividades"
          value={String(summary.totalActivities)}
          description="Carga operativa del equipo"
          icon={Activity}
          tone="info"
          variation="equipo"
          variationDirection="flat"
        />

        <MetricCard
          title="MRR"
          value={<MoneyValue value={summary.totalMrr} size="lg" />}
          description="Mantenimientos mensuales"
          icon={Repeat}
          tone="success"
          variation="recurrente"
          variationDirection="flat"
        />

        <MetricCard
          title="ARR"
          value={<MoneyValue value={summary.totalArr} size="lg" />}
          description="Proyección anual recurrente"
          icon={LineChart}
          tone="dark"
          variation="anual"
          variationDirection="flat"
        />

        <MetricCard
          title="Deuda recurrente"
          value={<MoneyValue value={summary.totalDebt} size="lg" tone="warning" />}
          description="Mantenimientos pendientes"
          icon={Target}
          tone="danger"
          variation="urgente"
          variationDirection="flat"
        />

        <MetricCard
          title="Margen medio"
          value={`${summary.averageMargin}%`}
          description="Media de proyectos mock"
          icon={TrendingUp}
          tone="primary"
          variation="rentabilidad"
          variationDirection="flat"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          title="Evolución mensual"
          description="Ingresos, gastos y beneficio por mes."
        >
          <StatsMonthlyChart data={monthlyPerformanceData} />
        </SectionCard>

        <SectionCard
          title="Embudo comercial"
          description="Cantidad de oportunidades por fase del pipeline."
        >
          <SalesFunnelChart data={salesFunnelData} />
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <SectionCard
          title="Carga de trabajo por usuario"
          description="Actividades, proyectos y oportunidades asignadas."
        >
          <WorkloadChart data={userWorkloadData} />
        </SectionCard>

        <SectionCard
          title="Rentabilidad por proyecto"
          description="Proyectos ordenados por beneficio estimado."
        >
          <div className="space-y-3">
            {bestProjects.map((project) => (
              <div
                key={project.projectId}
                className="rounded-2xl border border-[#DCEAF1]/70 bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-extrabold text-[#071B3A]">
                      {project.projectName}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {project.companyName}
                    </p>
                  </div>

                  <StatusChip
                    label={`${project.margin}% margen`}
                    tone={project.margin >= 85 ? "success" : "warning"}
                    dot={false}
                  />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <MiniMoney label="Cobrado" value={project.collected} tone="positive" />
                  <MiniMoney label="Gastos" value={project.expenses} tone="danger" />
                  <MiniMoney label="Beneficio" value={project.profit} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard
          title="Mantenimientos recurrentes"
          description="MRR, deuda y contratos activos por cliente."
        >
          <div className="space-y-3">
            {maintenanceMetricsData.map((item) => (
              <div
                key={item.name}
                className="flex flex-col gap-3 rounded-2xl bg-[#F6FAFC] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold text-[#071B3A]">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.activeContracts} contratos activos
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <StatusChip
                    label={`MRR ${item.mrr} €`}
                    tone="success"
                    dot={false}
                  />
                  <StatusChip
                    label={`Deuda ${item.debt} €`}
                    tone={item.debt > 0 ? "danger" : "neutral"}
                    dot={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Ranking de carga interna"
          description="Quién concentra más actividad y responsabilidad."
        >
          <div className="space-y-3">
            {workloadUsers.map((user, index) => (
              <div
                key={user.userId}
                className="rounded-2xl border border-[#DCEAF1]/70 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-[#071B3A] text-sm font-extrabold text-white">
                      {index + 1}
                    </div>

                    <div>
                      <p className="font-extrabold text-[#071B3A]">
                        {user.userName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {user.activities} actividades · {user.projects} proyectos
                      </p>
                    </div>
                  </div>

                  <StatusChip
                    label={`${user.opportunities} oportunidades`}
                    tone="primary"
                    dot={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </div>
  );
}

type HeroStatProps = {
  label: string;
  value: ReactNode;
};

function HeroStat({ label, value }: HeroStatProps) {
  return (
    <div className="rounded-3xl bg-white/8 p-5 ring-1 ring-white/10">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
        {label}
      </p>
      <div className="mt-2 text-2xl font-extrabold text-white">{value}</div>
    </div>
  );
}

type MiniMoneyProps = {
  label: string;
  value: number;
  tone?: "default" | "positive" | "warning" | "danger" | "muted";
};

function MiniMoney({ label, value, tone = "default" }: MiniMoneyProps) {
  return (
    <div className="rounded-2xl bg-[#F6FAFC] p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <MoneyValue value={value} size="sm" tone={tone} />
    </div>
  );
}