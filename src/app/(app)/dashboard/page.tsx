import {
  Activity,
  Building2,
  CreditCard,
  FolderKanban,
  Plus,
  Target,
  TrendingUp,
  Wrench,
} from "lucide-react";

import { DateValue } from "@/components/common/date-value";
import { MetricCard } from "@/components/common/metric-card";
import { MoneyValue } from "@/components/common/money-value";
import { ProgressCard } from "@/components/common/progress-card";
import { SectionCard } from "@/components/common/section-card";
import { StatGroup } from "@/components/common/stat-group";
import { StatusChip } from "@/components/common/status-chip";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ExpenseCategoryChart } from "@/features/dashboard/components/expense-category-chart";
import { FinanceOverviewChart } from "@/features/dashboard/components/finance-overview-chart";
import {
  activeProjects,
  dashboardMetrics,
  dashboardSummary,
  hotOpportunities,
  recentFinancialMovements,
  todayActivities,
  upcomingMaintenances,
} from "@/lib/mock-db";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard general"
        title="Bienvenido, Javier"
        description="Aquí tienes el estado actual de LevData. Datos mock realistas, arquitectura preparada para conectar Supabase más adelante."
        actions={
          <>
            <Button
              variant="outline"
              className="rounded-2xl border-[#A1C7E0]/60 bg-white"
            >
              <Activity className="mr-2 size-4" />
              Nueva actividad
            </Button>

            <Button className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]">
              <Target className="mr-2 size-4" />
              Nueva oportunidad
            </Button>

            <Button className="rounded-2xl bg-[#071B3A] text-white hover:bg-[#0B2A57]">
              <Plus className="mr-2 size-4" />
              Nuevo proyecto
            </Button>
          </>
        }
      />

      <section className="overflow-hidden rounded-[2rem] bg-[#071B3A] shadow-2xl shadow-slate-900/10">
        <div className="levdata-gradient h-2" />

        <div className="relative grid gap-8 p-7 text-white lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="absolute right-8 top-8 hidden text-7xl font-black text-white/5 sm:block">
            &gt;_
          </div>

          <div>
            <p className="text-sm font-medium text-[#A1C7E0]">
              Sistema operativo LevData
            </p>

            <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              Control comercial, operativo y financiero en una sola vista.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              El CRM debe permitir saber rápidamente qué requiere atención:
              oportunidades calientes, deuda, proyectos activos, tareas del día
              y mantenimientos recurrentes.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <StatusChip label="Frontend mock" tone="primary" />
              <StatusChip label="Sin backend todavía" tone="info" />
              <StatusChip label="Preparado para Supabase" tone="warning" />
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-white/8 p-4 ring-1 ring-white/10">
            <StatGroup
              className="border-white/10 bg-white/5 xl:grid-cols-2"
              items={[
                {
                  label: "Caja estimada",
                  value: (
                    <MoneyValue
                      value={dashboardSummary.estimatedCash}
                      size="lg"
                      className="text-white"
                    />
                  ),
                  detail: "Disponible mock",
                },
                {
                  label: "MRR",
                  value: (
                    <MoneyValue
                      value={dashboardSummary.mrr}
                      size="lg"
                      className="text-white"
                    />
                  ),
                  detail: "Mantenimientos",
                },
                {
                  label: "Valor abierto",
                  value: (
                    <MoneyValue
                      value={dashboardSummary.openPipelineValue}
                      size="lg"
                      className="text-white"
                    />
                  ),
                  detail: "Pipeline comercial",
                },
                {
                  label: "Deuda vencida",
                  value: (
                    <MoneyValue
                      value={dashboardSummary.overdueDebt}
                      size="lg"
                      tone="warning"
                      className="text-[#FF9933]"
                    />
                  ),
                  detail: "Requiere seguimiento",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          title="Ingresos, gastos y beneficio"
          description="Evolución financiera mock de los últimos meses."
        >
          <FinanceOverviewChart />
        </SectionCard>

        <SectionCard
          title="Gastos por categoría"
          description="Distribución aproximada de gastos internos y de proyecto."
        >
          <ExpenseCategoryChart />
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <SectionCard
          title="Oportunidades calientes"
          description="Ventas potenciales que necesitan seguimiento cercano."
          action={
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-[#A1C7E0]/60 bg-white"
            >
              Ver pipeline
            </Button>
          }
        >
          <div className="space-y-3">
            {hotOpportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="flex flex-col gap-4 rounded-2xl border border-[#DCEAF1]/70 bg-white p-4 transition hover:border-[#00ABBD]/40 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-extrabold text-[#071B3A]">
                    {opportunity.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {opportunity.company}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-slate-400">
                    Próxima acción: {opportunity.nextAction}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <MoneyValue value={opportunity.amount} size="md" />
                  <StatusChip label={opportunity.status} tone={opportunity.tone} />
                  <StatusChip
                    label={`${opportunity.probability}%`}
                    tone="dark"
                    dot={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Mi día"
          description="Actividad interna y comercial pendiente para hoy."
        >
          <div className="space-y-3">
            {todayActivities.map((activity) => (
              <div key={activity.id} className="rounded-2xl bg-[#F6FAFC] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#E8F8FB] text-[#00ABBD]">
                    {activity.type === "Mantenimiento" ? (
                      <Wrench className="size-5" />
                    ) : activity.type === "Reunión" ? (
                      <Building2 className="size-5" />
                    ) : (
                      <Activity className="size-5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-[#071B3A]">
                        {activity.title}
                      </p>
                      <StatusChip
                        label={activity.priority}
                        tone={activity.tone}
                        dot={false}
                      />
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {activity.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <SectionCard
          title="Proyectos activos"
          description="Progreso técnico y progreso de cobro de trabajos en curso."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {activeProjects.map((project) => (
              <div key={project.id} className="space-y-4">
                <div className="rounded-2xl border border-[#DCEAF1]/70 bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-extrabold text-[#071B3A]">
                        {project.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {project.company}
                      </p>
                    </div>

                    <StatusChip label={project.status} tone="primary" />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Presupuesto
                      </p>
                      <MoneyValue value={project.budget} size="sm" />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Cobrado
                      </p>
                      <MoneyValue value={project.collected} size="sm" tone="positive" />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Pendiente
                      </p>
                      <MoneyValue value={project.pending} size="sm" tone="warning" />
                    </div>
                  </div>

                  <p className="mt-4 text-xs font-semibold text-slate-500">
                    Próximo hito: {project.nextMilestone}
                  </p>
                </div>

                <ProgressCard
                  title="Progreso técnico"
                  description={project.name}
                  value={project.technicalProgress}
                  icon={TrendingUp}
                  tone="primary"
                  footer="Desarrollo"
                />

                <ProgressCard
                  title="Progreso de cobro"
                  description="Porcentaje cobrado sobre presupuesto"
                  value={project.paymentProgress}
                  icon={CreditCard}
                  tone="warning"
                  footer="Cobro"
                />
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            title="Últimos movimientos"
            description="Cobros y gastos recientes."
          >
            <div className="space-y-3">
              {recentFinancialMovements.map((movement) => (
                <div
                  key={movement.id}
                  className="flex flex-col gap-3 rounded-2xl bg-[#F6FAFC] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-bold text-[#071B3A]">
                      {movement.concept}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {movement.company}
                    </p>
                    <DateValue value={movement.date} className="mt-2" />
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <StatusChip label={movement.type} tone={movement.tone} />
                    <MoneyValue
                      value={movement.amount}
                      tone={movement.amount >= 0 ? "positive" : "danger"}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Mantenimientos próximos"
            description="Vencimientos que pueden afectar a la caja."
          >
            <div className="space-y-3">
              {upcomingMaintenances.map((maintenance) => (
                <div
                  key={maintenance.id}
                  className="rounded-2xl border border-[#DCEAF1]/70 bg-white p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-[#071B3A]">
                        {maintenance.company}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {maintenance.project}
                      </p>
                    </div>

                    <StatusChip
                      label={maintenance.status}
                      tone={maintenance.tone}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <DateValue value={maintenance.dueDate} />
                    <MoneyValue value={maintenance.amount} size="md" />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </section>
    </div>
  );
}