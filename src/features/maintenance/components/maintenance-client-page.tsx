"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  CircleDollarSign,
  PauseCircle,
  Repeat,
  Search,
  TrendingUp,
  Wrench,
} from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { MetricCard } from "@/components/common/metric-card";
import { MoneyValue } from "@/components/common/money-value";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaintenanceCard } from "@/features/maintenance/components/maintenance-card";
import type {
  MaintenanceContract,
  MaintenanceDue,
  MaintenanceStatus,
} from "@/features/maintenance/types";
import {
  filterMaintenanceContracts,
  getMaintenanceStats,
  getMaintenanceStatusLabel,
} from "@/features/maintenance/utils";

type MaintenanceClientPageProps = {
  contracts: MaintenanceContract[];
  dues: MaintenanceDue[];
};

const statusOptions: Array<{ label: string; value: MaintenanceStatus | "all" }> = [
  { label: "Todos los estados", value: "all" },
  { label: "Activo", value: "activo" },
  { label: "Pausado", value: "pausado" },
  { label: "Cancelado", value: "cancelado" },
  { label: "Bonificado", value: "bonificado" },
];

export function MaintenanceClientPage({
  contracts,
  dues,
}: MaintenanceClientPageProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<MaintenanceStatus | "all">("all");

  const stats = useMemo(() => getMaintenanceStats(contracts, dues), [
    contracts,
    dues,
  ]);

  const filteredContracts = useMemo(
    () => filterMaintenanceContracts({ contracts, search, status }),
    [contracts, search, status],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Recurrentes"
        title="Mantenimientos"
        description="Gestiona contratos recurrentes, vencimientos, deuda, MRR, ARR y soporte incluido."
        actions={
          <Button className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]">
            <Wrench className="mr-2 size-4" />
            Nuevo mantenimiento
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Mantenimientos activos"
          value={String(stats.active)}
          description="Contratos recurrentes en marcha"
          icon={Repeat}
          tone="success"
          variation="MRR"
          variationDirection="flat"
        />

        <MetricCard
          title="Pausados"
          value={String(stats.paused)}
          description="Requieren revisión comercial"
          icon={PauseCircle}
          tone="warning"
          variation="control"
          variationDirection="flat"
        />

        <MetricCard
          title="Vencidos"
          value={String(stats.overdue)}
          description="Periodos con deuda vencida"
          icon={AlertTriangle}
          tone="danger"
          variation="urgente"
          variationDirection="flat"
        />

        <MetricCard
          title="Cobros parciales"
          value={String(stats.partial)}
          description="Vencimientos no cubiertos completos"
          icon={CalendarClock}
          tone="primary"
          variation="seguimiento"
          variationDirection="flat"
        />

        <MetricCard
          title="Deuda acumulada"
          value={<MoneyValue value={stats.debt} size="lg" tone="warning" />}
          description="Pendiente en vencimientos"
          icon={CircleDollarSign}
          tone="warning"
          variation="caja"
          variationDirection="flat"
        />

        <MetricCard
          title="MRR aproximado"
          value={<MoneyValue value={stats.mrr} size="lg" />}
          description="Equivalente mensual"
          icon={TrendingUp}
          tone="info"
          variation="recurrente"
          variationDirection="flat"
        />

        <MetricCard
          title="ARR aproximado"
          value={<MoneyValue value={stats.arr} size="lg" />}
          description="Equivalente anual"
          icon={TrendingUp}
          tone="dark"
          variation="anual"
          variationDirection="flat"
        />

        <MetricCard
          title="Total contratos"
          value={String(contracts.length)}
          description="Activos, pausados y bonificados"
          icon={Wrench}
          tone="primary"
          variation="mock"
          variationDirection="flat"
        />
      </section>

      <section className="levdata-card rounded-[1.75rem] p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por mantenimiento, empresa, proyecto o descripción..."
              className="h-12 rounded-2xl border-[#A1C7E0]/50 bg-white pl-11"
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as MaintenanceStatus | "all")
            }
            className="h-12 rounded-2xl border border-[#A1C7E0]/50 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none transition focus:border-[#00ABBD] focus:ring-4 focus:ring-cyan-100"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value === "all"
                  ? option.label
                  : getMaintenanceStatusLabel(option.value)}
              </option>
            ))}
          </select>
        </div>
      </section>

      {filteredContracts.length > 0 ? (
        <section className="grid gap-4 2xl:grid-cols-2">
          {filteredContracts.map((contract) => (
            <MaintenanceCard key={contract.id} contract={contract} dues={dues} />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={Wrench}
          title="No hay mantenimientos con estos filtros"
          description="Prueba a cambiar el buscador o el estado seleccionado."
        />
      )}
    </div>
  );
}