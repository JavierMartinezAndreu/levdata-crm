import { Activity, Building2, CreditCard, FolderKanban, Plus, Target } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const initialMetrics = [
  {
    title: "Cobrado este mes",
    value: "3.200 €",
    description: "Ingresos registrados en mayo",
    icon: CreditCard,
  },
  {
    title: "Empresas activas",
    value: "10",
    description: "Clientes, prospectos y partners",
    icon: Building2,
  },
  {
    title: "Proyectos activos",
    value: "5",
    description: "Trabajos en desarrollo o mantenimiento",
    icon: FolderKanban,
  },
  {
    title: "Actividades hoy",
    value: "7",
    description: "Tareas, llamadas y seguimientos",
    icon: Activity,
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

        <div className="relative p-7 text-white sm:p-8 lg:p-10">
          <div className="absolute right-8 top-8 hidden text-7xl font-black text-white/5 sm:block">
            &gt;_
          </div>

          <p className="text-sm font-medium text-[#A1C7E0]">
            Sistema operativo LevData
          </p>

          <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Control comercial, operativo y financiero en una sola vista.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            En la siguiente fase convertiremos esta pantalla en el dashboard
            completo con métricas reales mock, gráficas, oportunidades calientes,
            proyectos activos, mantenimientos y tesorería.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {initialMetrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card
              key={metric.title}
              className="levdata-card rounded-[1.5rem] transition hover:-translate-y-1 hover:shadow-xl"
            >
              <CardContent className="p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#E8F8FB] text-[#00ABBD]">
                    <Icon className="size-5" />
                  </div>

                  <span className="rounded-full bg-[#F4FAFD] px-3 py-1 text-xs font-semibold text-[#0099DD]">
                    Mock
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-500">
                  {metric.title}
                </p>

                <p className="mt-2 text-3xl font-extrabold text-[#071B3A]">
                  {metric.value}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}