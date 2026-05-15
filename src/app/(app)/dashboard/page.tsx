import {
  Activity,
  Building2,
  CreditCard,
  FolderKanban,
  Landmark,
  Plus,
  Target,
  TrendingUp,
  Wrench,
} from "lucide-react";

import { MetricCard } from "@/components/common/metric-card";
import { MoneyValue } from "@/components/common/money-value";
import { ProgressCard } from "@/components/common/progress-card";
import { SectionCard } from "@/components/common/section-card";
import { StatGroup } from "@/components/common/stat-group";
import { StatusChip } from "@/components/common/status-chip";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

const initialMetrics = [
  {
    title: "Cobrado este mes",
    value: "3.200 €",
    description: "Ingresos registrados en mayo",
    icon: CreditCard,
    variation: "+18%",
    variationDirection: "up" as const,
    tone: "success" as const,
  },
  {
    title: "Pendiente de cobrar",
    value: "4.800 €",
    description: "Entre proyectos y mantenimientos",
    icon: Landmark,
    variation: "2 vencidos",
    variationDirection: "flat" as const,
    tone: "warning" as const,
  },
  {
    title: "Oportunidades abiertas",
    value: "8",
    description: "Pipeline comercial activo",
    icon: Target,
    variation: "+3",
    variationDirection: "up" as const,
    tone: "primary" as const,
  },
  {
    title: "Proyectos activos",
    value: "5",
    description: "Trabajos en desarrollo o mantenimiento",
    icon: FolderKanban,
    variation: "estable",
    variationDirection: "flat" as const,
    tone: "info" as const,
  },
];

const hotOpportunities = [
  {
    name: "CRM a medida",
    company: "Restaurante Costa Azul",
    amount: 6200,
    status: "Propuesta enviada",
    tone: "warning" as const,
  },
  {
    name: "Dashboard de ventas",
    company: "Inmobiliaria Levante",
    amount: 4800,
    status: "Negociación",
    tone: "primary" as const,
  },
  {
    name: "Automatización administrativa",
    company: "Clínica Mediterránea",
    amount: 3500,
    status: "Reunión agendada",
    tone: "info" as const,
  },
];

const activeProjects = [
  {
    name: "CRM operativo",
    company: "Restaurante Costa Azul",
    technicalProgress: 72,
    paymentProgress: 45,
  },
  {
    name: "Dashboard de datos",
    company: "Inmobiliaria Levante",
    technicalProgress: 38,
    paymentProgress: 20,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard general"
        title="Bienvenido, Javier"
        description="Aquí tienes el estado actual de LevData. Esta base todavía usa datos mock, pero ya está preparada para crecer hacia el CRM completo."
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
              El objetivo del CRM es saber rápidamente qué requiere atención:
              oportunidades calientes, deuda, proyectos activos, tareas del día
              y mantenimientos recurrentes.
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-white/8 p-4 ring-1 ring-white/10">
            <StatGroup
              className="border-white/10 bg-white/5 xl:grid-cols-2"
              items={[
                {
                  label: "Caja estimada",
                  value: <MoneyValue value={7200} size="lg" className="text-white" />,
                  detail: "Disponible mock",
                },
                {
                  label: "MRR",
                  value: <MoneyValue value={890} size="lg" className="text-white" />,
                  detail: "Mantenimientos",
                },
                {
                  label: "Valor abierto",
                  value: <MoneyValue value={18500} size="lg" className="text-white" />,
                  detail: "Pipeline comercial",
                },
                {
                  label: "Deuda vencida",
                  value: (
                    <MoneyValue
                      value={1200}
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {initialMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
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
                key={opportunity.name}
                className="flex flex-col gap-4 rounded-2xl border border-[#DCEAF1]/70 bg-white p-4 transition hover:border-[#00ABBD]/40 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-extrabold text-[#071B3A]">
                    {opportunity.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {opportunity.company}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <MoneyValue value={opportunity.amount} size="md" />
                  <StatusChip label={opportunity.status} tone={opportunity.tone} />
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
            <div className="rounded-2xl bg-[#F6FAFC] p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-[#E8F8FB] text-[#00ABBD]">
                  <Activity className="size-5" />
                </div>
                <div>
                  <p className="font-bold text-[#071B3A]">
                    Llamar a Restaurante Costa Azul
                  </p>
                  <p className="text-sm text-slate-500">
                    Seguimiento de propuesta enviada
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#F6FAFC] p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-orange-50 text-[#FF9933]">
                  <Wrench className="size-5" />
                </div>
                <div>
                  <p className="font-bold text-[#071B3A]">
                    Revisar mantenimiento mensual
                  </p>
                  <p className="text-sm text-slate-500">
                    Vencimiento próximo en 3 días
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#F6FAFC] p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-sky-50 text-[#0099DD]">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <p className="font-bold text-[#071B3A]">
                    Preparar demo para Clínica Mediterránea
                  </p>
                  <p className="text-sm text-slate-500">
                    Reunión comercial pendiente
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {activeProjects.map((project) => (
          <div key={project.name} className="space-y-4">
            <ProgressCard
              title={project.name}
              description={project.company}
              value={project.technicalProgress}
              icon={TrendingUp}
              tone="primary"
              footer="Progreso técnico"
            />

            <ProgressCard
              title={`Cobro · ${project.name}`}
              description="Porcentaje cobrado sobre presupuesto"
              value={project.paymentProgress}
              icon={CreditCard}
              tone="warning"
              footer="Progreso de cobro"
            />
          </div>
        ))}
      </section>
    </div>
  );
}