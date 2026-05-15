import { LucideIcon } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

type ModulePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  nextStep: string;
};

export function ModulePlaceholder({
  eyebrow,
  title,
  description,
  icon: Icon,
  nextStep,
}: ModulePlaceholderProps) {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <Card className="levdata-card overflow-hidden rounded-[2rem]">
        <div className="levdata-gradient h-2" />

        <CardContent className="p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-[#E8F8FB] text-[#00ABBD]">
                <Icon className="size-7" />
              </div>

              <h2 className="text-2xl font-extrabold text-[#071B3A]">
                Módulo preparado
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Esta ruta ya está integrada en el layout principal. Ahora iremos
                construyendo cada módulo pantalla por pantalla con datos mock
                realistas, filtros, cards, tablas y acciones simuladas.
              </p>
            </div>

            <div className="rounded-3xl border border-[#A1C7E0]/35 bg-[#F6FAFC] p-5 lg:w-80">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00ABBD]">
                Siguiente paso
              </p>
              <p className="mt-3 text-sm leading-6 text-[#071B3A]">
                {nextStep}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}