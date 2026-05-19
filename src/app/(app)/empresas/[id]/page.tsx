import Link from "next/link";
import { ArrowLeft, Building2, Globe, Mail, Phone } from "lucide-react";

import { DateValue } from "@/components/common/date-value";
import { MoneyValue } from "@/components/common/money-value";
import { SectionCard } from "@/components/common/section-card";
import { StatGroup } from "@/components/common/stat-group";
import { StatusChip } from "@/components/common/status-chip";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { mockCompanies } from "@/features/companies/data/mock-companies";
import {
  getCompanyPotentialLabel,
  getCompanyPotentialTone,
  getCompanyStatusLabel,
  getCompanyStatusTone,
} from "@/features/companies/utils";

export function generateStaticParams() {
  return mockCompanies.map((company) => ({
    id: company.id,
  }));
}

type CompanyDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CompanyDetailPage({
  params,
}: CompanyDetailPageProps) {
  const { id } = await params;
  const company = mockCompanies.find((item) => item.id === id);

  if (!company) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Empresa no encontrada"
          title="No hemos encontrado esta empresa"
          description="Es posible que el identificador no exista en los datos mock."
          actions={
            <Button asChild variant="outline" className="rounded-2xl bg-white">
              <Link href="/empresas">
                <ArrowLeft className="mr-2 size-4" />
                Volver a empresas
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Detalle de empresa"
        title={company.nombreComercial}
        description={`${company.razonSocial} · ${company.localidad}, ${company.provincia}`}
        actions={
          <>
            <Button asChild variant="outline" className="rounded-2xl bg-white">
              <Link href="/empresas">
                <ArrowLeft className="mr-2 size-4" />
                Volver
              </Link>
            </Button>

            <Button className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]">
              Nueva actividad
            </Button>
          </>
        }
      />

      <section className="overflow-hidden rounded-[2rem] bg-[#071B3A] shadow-2xl shadow-slate-900/10">
        <div className="levdata-gradient h-2" />

        <div className="grid gap-8 p-7 text-white lg:grid-cols-[1fr_0.8fr] lg:p-10">
          <div>
            <div className="mb-5 flex size-16 items-center justify-center rounded-3xl bg-white/10 text-[#00ABBD] ring-1 ring-white/10">
              <Building2 className="size-8" />
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight">
              {company.nombreComercial}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
              {company.notas}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <StatusChip
                label={getCompanyStatusLabel(company.estado)}
                tone={getCompanyStatusTone(company.estado)}
              />
              <StatusChip
                label={getCompanyPotentialLabel(company.potencial)}
                tone={getCompanyPotentialTone(company.potencial)}
                dot={false}
              />
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-white/8 p-4 ring-1 ring-white/10">
            <StatGroup
              className="border-white/10 bg-white/5 xl:grid-cols-2"
              items={[
                {
                  label: "Contactos",
                  value: company.contactosCount,
                  detail: "Personas asociadas",
                },
                {
                  label: "Oportunidades",
                  value: company.oportunidadesAbiertas,
                  detail: "Abiertas ahora",
                },
                {
                  label: "Proyectos",
                  value: company.proyectosActivos,
                  detail: "Activos",
                },
                {
                  label: "Pendiente",
                  value: (
                    <MoneyValue
                      value={company.pendienteCobro}
                      size="lg"
                      tone="warning"
                      className="text-[#FF9933]"
                    />
                  ),
                  detail: "Por cobrar",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard
          title="Información de contacto"
          description="Datos generales de la empresa."
        >
          <div className="space-y-4">
            <InfoRow icon={Globe} label="Web" value={company.web} />
            <InfoRow icon={Mail} label="Email" value={company.emailGeneral} />
            <InfoRow icon={Phone} label="Teléfono" value={company.telefonoGeneral} />
            <InfoRow
              icon={Building2}
              label="Dirección"
              value={`${company.direccion}, ${company.localidad}`}
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Resumen de relación"
          description="Métricas mock principales de esta empresa."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#F6FAFC] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Responsable interno
              </p>
              <p className="mt-2 font-extrabold text-[#071B3A]">
                {company.responsableNombre}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F6FAFC] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Última actividad
              </p>
              <DateValue value={company.ultimaActividad} className="mt-2" />
            </div>

            <div className="rounded-2xl bg-[#F6FAFC] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Total cobrado
              </p>
              <MoneyValue value={company.totalCobrado} size="lg" tone="positive" />
            </div>

            <div className="rounded-2xl bg-[#F6FAFC] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Pendiente de cobro
              </p>
              <MoneyValue value={company.pendienteCobro} size="lg" tone="warning" />
            </div>
          </div>
        </SectionCard>
      </section>
    </div>
  );
}

type InfoRowProps = {
  icon: typeof Globe;
  label: string;
  value: string;
};

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[#F6FAFC] p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#E8F8FB] text-[#00ABBD]">
        <Icon className="size-5" />
      </div>

      <div>
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