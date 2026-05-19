import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Percent,
  UserRound,
  XCircle,
} from "lucide-react";

import { DateValue } from "@/components/common/date-value";
import { MoneyValue } from "@/components/common/money-value";
import { SectionCard } from "@/components/common/section-card";
import { StatGroup } from "@/components/common/stat-group";
import { StatusChip } from "@/components/common/status-chip";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { mockOpportunities } from "@/features/opportunities/data/mock-opportunities";
import {
  getOpportunityStatusLabel,
  getOpportunityStatusTone,
  getTemperatureLabel,
  getTemperatureTone,
} from "@/features/opportunities/utils";

export function generateStaticParams() {
  return mockOpportunities.map((opportunity) => ({
    id: opportunity.id,
  }));
}

type OpportunityDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OpportunityDetailPage({
  params,
}: OpportunityDetailPageProps) {
  const { id } = await params;
  const opportunity = mockOpportunities.find((item) => item.id === id);

  if (!opportunity) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Oportunidad no encontrada"
          title="No hemos encontrado esta oportunidad"
          description="Es posible que el identificador no exista en los datos mock."
          actions={
            <Button asChild variant="outline" className="rounded-2xl bg-white">
              <Link href="/oportunidades">
                <ArrowLeft className="mr-2 size-4" />
                Volver a oportunidades
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  const weightedValue =
    opportunity.valorEstimado * (opportunity.probabilidad / 100);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Detalle de oportunidad"
        title={opportunity.nombre}
        description={`${opportunity.empresaNombre} · ${getOpportunityStatusLabel(
          opportunity.estado,
        )}`}
        actions={
          <>
            <Button asChild variant="outline" className="rounded-2xl bg-white">
              <Link href="/oportunidades">
                <ArrowLeft className="mr-2 size-4" />
                Volver
              </Link>
            </Button>

            <Button className="rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700">
              <CheckCircle2 className="mr-2 size-4" />
              Marcar ganada
            </Button>

            <Button
              variant="outline"
              className="rounded-2xl border-red-200 bg-white text-red-600 hover:bg-red-50"
            >
              <XCircle className="mr-2 size-4" />
              Marcar perdida
            </Button>
          </>
        }
      />

      <section className="overflow-hidden rounded-[2rem] bg-[#071B3A] shadow-2xl shadow-slate-900/10">
        <div className="levdata-gradient h-2" />

        <div className="grid gap-8 p-7 text-white lg:grid-cols-[1fr_0.85fr] lg:p-10">
          <div>
            <div className="mb-5 flex size-16 items-center justify-center rounded-3xl bg-white/10 text-[#00ABBD] ring-1 ring-white/10">
              <CircleDollarSign className="size-8" />
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight">
              {opportunity.nombre}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
              {opportunity.descripcion}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <StatusChip
                label={getOpportunityStatusLabel(opportunity.estado)}
                tone={getOpportunityStatusTone(opportunity.estado)}
              />
              <StatusChip
                label={getTemperatureLabel(opportunity.temperatura)}
                tone={getTemperatureTone(opportunity.temperatura)}
                dot={false}
              />
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-white/8 p-4 ring-1 ring-white/10">
            <StatGroup
              className="border-white/10 bg-white/5 xl:grid-cols-2"
              items={[
                {
                  label: "Valor estimado",
                  value: (
                    <MoneyValue
                      value={opportunity.valorEstimado}
                      size="lg"
                      className="text-white"
                    />
                  ),
                  detail: "Importe total",
                },
                {
                  label: "Valor ponderado",
                  value: (
                    <MoneyValue
                      value={weightedValue}
                      size="lg"
                      className="text-white"
                    />
                  ),
                  detail: "Según probabilidad",
                },
                {
                  label: "Probabilidad",
                  value: `${opportunity.probabilidad}%`,
                  detail: "Estimación comercial",
                },
                {
                  label: "Responsable",
                  value: opportunity.responsableNombre,
                  detail: "Gestión interna",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard
          title="Información comercial"
          description="Datos clave de la oportunidad."
        >
          <div className="space-y-4">
            <InfoRow
              icon={Building2}
              label="Empresa"
              value={opportunity.empresaNombre}
            />
            <InfoRow
              icon={UserRound}
              label="Responsable"
              value={opportunity.responsableNombre}
            />
            <InfoRow
              icon={Percent}
              label="Probabilidad"
              value={`${opportunity.probabilidad}%`}
            />
            <InfoRow
              icon={CalendarClock}
              label="Cierre estimado"
              value={opportunity.fechaCierreEstimada}
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Próxima acción"
          description="Qué debe hacerse para avanzar esta venta."
        >
          <div className="rounded-2xl bg-[#F6FAFC] p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Acción recomendada
            </p>
            <p className="mt-2 text-lg font-extrabold text-[#071B3A]">
              {opportunity.proximaAccion}
            </p>

            <div className="mt-4">
              <DateValue value={opportunity.fechaProximaAccion} />
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-[#F6FAFC] p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Notas internas
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              {opportunity.notas}
            </p>
          </div>
        </SectionCard>
      </section>

      <SectionCard
        title="Contactos relacionados"
        description="Personas implicadas en esta oportunidad."
      >
        {opportunity.contactosRelacionados.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {opportunity.contactosRelacionados.map((contact) => (
              <StatusChip key={contact} label={contact} tone="primary" />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Todavía no hay contactos relacionados en el mock.
          </p>
        )}
      </SectionCard>
    </div>
  );
}

type InfoRowProps = {
  icon: typeof Building2;
  label: string;
  value: string;
};

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[#F6FAFC] p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#E8F8FB] text-[#00ABBD]">
        <Icon className="size-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-all text-sm font-semibold text-[#071B3A]">
          {value}
        </p>
      </div>
    </div>
  );
}