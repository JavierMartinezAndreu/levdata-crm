"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  CircleDollarSign,
  Search,
  Target,
  Users,
} from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { MetricCard } from "@/components/common/metric-card";
import { MoneyValue } from "@/components/common/money-value";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompanyCard } from "@/features/companies/components/company-card";
import type {
  Company,
  CompanyPotential,
  CompanyStatus,
} from "@/features/companies/types";
import { filterCompanies, getCompanyStats } from "@/features/companies/utils";

type CompaniesClientPageProps = {
  companies: Company[];
};

const statusOptions: Array<{ label: string; value: CompanyStatus | "all" }> = [
  { label: "Todos los estados", value: "all" },
  { label: "Prospecto", value: "prospecto" },
  { label: "En conversación", value: "enConversacion" },
  { label: "Cliente activo", value: "clienteActivo" },
  { label: "Cliente en pausa", value: "clienteEnPausa" },
  { label: "No encaja", value: "noEncaja" },
  { label: "Perdido", value: "perdido" },
  { label: "Partner", value: "partner" },
];

const potentialOptions: Array<{
  label: string;
  value: CompanyPotential | "all";
}> = [
  { label: "Todos los potenciales", value: "all" },
  { label: "Bajo", value: "bajo" },
  { label: "Medio", value: "medio" },
  { label: "Alto", value: "alto" },
  { label: "Estratégico", value: "estrategico" },
];

export function CompaniesClientPage({ companies }: CompaniesClientPageProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CompanyStatus | "all">("all");
  const [potential, setPotential] = useState<CompanyPotential | "all">("all");

  const stats = useMemo(() => getCompanyStats(companies), [companies]);

  const filteredCompanies = useMemo(
    () =>
      filterCompanies({
        companies,
        search,
        status,
        potential,
      }),
    [companies, search, status, potential],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM"
        title="Empresas"
        description="Gestiona clientes, prospectos y partners de LevData con una vista visual preparada para conectar Supabase después."
        actions={
          <Button className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]">
            <Building2 className="mr-2 size-4" />
            Nueva empresa
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total empresas"
          value={String(stats.total)}
          description="Base mock de clientes y prospectos"
          icon={Building2}
          tone="primary"
          variation="mock"
          variationDirection="flat"
        />

        <MetricCard
          title="Clientes activos"
          value={String(stats.activeClients)}
          description="Empresas con relación activa"
          icon={Users}
          tone="success"
          variation="+2"
          variationDirection="up"
        />

        <MetricCard
          title="Oportunidades abiertas"
          value={String(stats.openOpportunities)}
          description="Pipeline relacionado con empresas"
          icon={Target}
          tone="info"
          variation="+3"
          variationDirection="up"
        />

        <MetricCard
          title="Pendiente de cobrar"
          value={<MoneyValue value={stats.pendingPayment} size="lg" tone="warning" />}
          description="Importe pendiente asociado"
          icon={CircleDollarSign}
          tone="warning"
          variation="requiere control"
          variationDirection="flat"
        />
      </section>

      <section className="levdata-card rounded-[1.75rem] p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, razón social, sector o localidad..."
              className="h-12 rounded-2xl border-[#A1C7E0]/50 bg-white pl-11"
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as CompanyStatus | "all")
            }
            className="h-12 rounded-2xl border border-[#A1C7E0]/50 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none transition focus:border-[#00ABBD] focus:ring-4 focus:ring-cyan-100"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={potential}
            onChange={(event) =>
              setPotential(event.target.value as CompanyPotential | "all")
            }
            className="h-12 rounded-2xl border border-[#A1C7E0]/50 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none transition focus:border-[#00ABBD] focus:ring-4 focus:ring-cyan-100"
          >
            {potentialOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {filteredCompanies.length > 0 ? (
        <section className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={Building2}
          title="No hay empresas con estos filtros"
          description="Prueba a cambiar el buscador, el estado o el potencial. En la fase de backend estos filtros consultarán Supabase."
        />
      )}
    </div>
  );
}