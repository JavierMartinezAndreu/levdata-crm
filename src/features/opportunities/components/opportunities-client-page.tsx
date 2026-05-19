"use client";

import { useMemo, useState } from "react";
import {
  CircleDollarSign,
  Flame,
  ListFilter,
  Search,
  Send,
  Target,
} from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { MetricCard } from "@/components/common/metric-card";
import { MoneyValue } from "@/components/common/money-value";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OpportunityCard } from "@/features/opportunities/components/opportunity-card";
import { OpportunitiesKanban } from "@/features/opportunities/components/opportunities-kanban";
import type {
  Opportunity,
  OpportunityStatus,
  OpportunityTemperature,
} from "@/features/opportunities/types";
import {
  filterOpportunities,
  getOpportunityStats,
  getOpportunityStatusLabel,
  getTemperatureLabel,
  opportunityStatusOrder,
} from "@/features/opportunities/utils";

type OpportunitiesClientPageProps = {
  opportunities: Opportunity[];
};

const temperatureOptions: Array<{
  label: string;
  value: OpportunityTemperature | "all";
}> = [
  { label: "Todas las temperaturas", value: "all" },
  { label: "Fría", value: "fria" },
  { label: "Templada", value: "templada" },
  { label: "Caliente", value: "caliente" },
];

export function OpportunitiesClientPage({
  opportunities,
}: OpportunitiesClientPageProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OpportunityStatus | "all">("all");
  const [temperature, setTemperature] = useState<
    OpportunityTemperature | "all"
  >("all");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  const filteredOpportunities = useMemo(
    () =>
      filterOpportunities({
        opportunities,
        search,
        status,
        temperature,
      }),
    [opportunities, search, status, temperature],
  );

  const stats = useMemo(
    () => getOpportunityStats(opportunities),
    [opportunities],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Comercial"
        title="Oportunidades"
        description="Visualiza el pipeline comercial de LevData desde la detección hasta la venta, con valor ponderado y temperatura comercial."
        actions={
          <Button className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]">
            <Target className="mr-2 size-4" />
            Nueva oportunidad
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Abiertas"
          value={String(stats.open)}
          description="Oportunidades no cerradas"
          icon={Target}
          tone="primary"
          variation="+3"
          variationDirection="up"
        />

        <MetricCard
          title="Valor abierto"
          value={<MoneyValue value={stats.openValue} size="lg" />}
          description="Suma de oportunidades abiertas"
          icon={CircleDollarSign}
          tone="info"
          variation="pipeline"
          variationDirection="flat"
        />

        <MetricCard
          title="Valor ponderado"
          value={<MoneyValue value={stats.weightedValue} size="lg" />}
          description="Valor por probabilidad"
          icon={ListFilter}
          tone="dark"
          variation="estimado"
          variationDirection="flat"
        />

        <MetricCard
          title="Propuestas enviadas"
          value={String(stats.proposalsSent)}
          description="Pendientes de respuesta"
          icon={Send}
          tone="warning"
          variation="seguimiento"
          variationDirection="flat"
        />

        <MetricCard
          title="Calientes"
          value={String(stats.hot)}
          description="Alta prioridad comercial"
          icon={Flame}
          tone="danger"
          variation="prioridad"
          variationDirection="flat"
        />
      </section>

      <section className="levdata-card rounded-[1.75rem] p-4">
        <div className="grid gap-3 xl:grid-cols-[1fr_220px_220px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por oportunidad, empresa, descripción o responsable..."
              className="h-12 rounded-2xl border-[#A1C7E0]/50 bg-white pl-11"
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as OpportunityStatus | "all")
            }
            className="h-12 rounded-2xl border border-[#A1C7E0]/50 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none transition focus:border-[#00ABBD] focus:ring-4 focus:ring-cyan-100"
          >
            <option value="all">Todos los estados</option>
            {opportunityStatusOrder.map((item) => (
              <option key={item} value={item}>
                {getOpportunityStatusLabel(item)}
              </option>
            ))}
          </select>

          <select
            value={temperature}
            onChange={(event) =>
              setTemperature(
                event.target.value as OpportunityTemperature | "all",
              )
            }
            className="h-12 rounded-2xl border border-[#A1C7E0]/50 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none transition focus:border-[#00ABBD] focus:ring-4 focus:ring-cyan-100"
          >
            {temperatureOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex rounded-2xl border border-[#A1C7E0]/50 bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                viewMode === "kanban"
                  ? "bg-[#071B3A] text-white"
                  : "text-slate-500 hover:bg-[#F6FAFC]"
              }`}
            >
              Kanban
            </button>

            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                viewMode === "list"
                  ? "bg-[#071B3A] text-white"
                  : "text-slate-500 hover:bg-[#F6FAFC]"
              }`}
            >
              Lista
            </button>
          </div>
        </div>
      </section>

      {filteredOpportunities.length > 0 ? (
        viewMode === "kanban" ? (
          <OpportunitiesKanban opportunities={filteredOpportunities} />
        ) : (
          <section className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
              />
            ))}
          </section>
        )
      ) : (
        <EmptyState
          icon={Target}
          title="No hay oportunidades con estos filtros"
          description="Prueba a cambiar el buscador, el estado o la temperatura comercial."
        />
      )}
    </div>
  );
}