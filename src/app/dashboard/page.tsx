import { Activity, Building2, CreditCard, FolderKanban } from "lucide-react";

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
    <main className="min-h-screen px-6 py-8">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="overflow-hidden rounded-[2rem] bg-[#071B3A] shadow-2xl shadow-slate-900/10">
          <div className="levdata-gradient h-2" />

          <div className="relative p-8 text-white sm:p-10">
            <div className="absolute right-8 top-8 hidden text-7xl font-black text-white/5 sm:block">
              &gt;_
            </div>

            <p className="text-sm font-medium text-[#A1C7E0]">
              Dashboard general
            </p>

            <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
              Bienvenido, Javier. Aquí tienes el estado actual de LevData.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Esta es la primera base visual. En la siguiente fase añadiremos
              AppShell, sidebar, topbar, navegación responsive y componentes
              reutilizables.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        </div>
      </section>
    </main>
  );
}