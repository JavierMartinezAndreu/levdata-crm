import Link from "next/link";
import { ArrowRight, BarChart3, Code2, DatabaseZap } from "lucide-react";

import { BrandLogo } from "@/components/common/brand-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#A1C7E0]/40 bg-white/80 px-4 py-2 text-sm font-medium text-[#071B3A] shadow-sm">
              <span className="flex size-2 rounded-full bg-[#00ABBD]" />
              CRM interno en fase mock
            </div>

            <div className="mb-6">
              <BrandLogo
                variant="horizontal"
                priority
                className="h-14 w-[230px] sm:h-16 sm:w-[270px]"
              />
            </div>

            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-[#071B3A] sm:text-5xl lg:text-6xl">
              Sistema operativo interno para gestionar LevData.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              CRM visual para empresas, oportunidades, proyectos, sprints,
              cobros, gastos, mantenimientos y tesorería. Primero construiremos
              el frontend mock completo y después conectaremos Supabase.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-[#00ABBD] px-6 text-white shadow-lg shadow-cyan-900/10 hover:bg-[#0099DD]"
              >
                <Link href="/login">
                  Entrar al CRM
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-2xl border-[#A1C7E0]/60 bg-white/70 px-6 text-[#071B3A] hover:bg-white"
              >
                <Link href="/dashboard">Ver dashboard mock</Link>
              </Button>
            </div>
          </div>

          <Card className="levdata-card overflow-hidden rounded-[2rem]">
            <CardContent className="p-0">
              <div className="levdata-gradient h-2" />

              <div className="space-y-5 p-6">
                <div className="rounded-3xl bg-[#071B3A] p-6 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/60">Estado de LevData</p>
                      <p className="mt-2 text-3xl font-bold">Control total</p>
                    </div>
                    <BrandLogo variant="symbol" className="size-12" />
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs text-white/50">Pendiente</p>
                      <p className="mt-1 text-xl font-bold">4.800 €</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs text-white/50">Proyectos</p>
                      <p className="mt-1 text-xl font-bold">5 activos</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <MiniFeature
                    icon={<DatabaseZap className="size-5" />}
                    title="Datos"
                    text="Mock realista primero."
                  />
                  <MiniFeature
                    icon={<Code2 className="size-5" />}
                    title="Frontend"
                    text="Sin backend todavía."
                  />
                  <MiniFeature
                    icon={<BarChart3 className="size-5" />}
                    title="Dashboards"
                    text="Visual y medible."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

type MiniFeatureProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

function MiniFeature({ icon, title, text }: MiniFeatureProps) {
  return (
    <div className="rounded-3xl border border-[#A1C7E0]/40 bg-white/70 p-4">
      <div className="mb-3 flex size-10 items-center justify-center rounded-2xl bg-[#E8F8FB] text-[#00ABBD]">
        {icon}
      </div>
      <p className="font-bold text-[#071B3A]">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  );
}