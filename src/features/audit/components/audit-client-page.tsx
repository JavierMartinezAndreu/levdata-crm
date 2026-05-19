"use client";

import { useMemo, useState } from "react";
import {
  Banknote,
  FileClock,
  GitBranch,
  ListFilter,
  Search,
  ShieldCheck,
} from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { MetricCard } from "@/components/common/metric-card";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { AuditTimelineItem } from "@/features/audit/components/audit-timeline-item";
import type {
  AuditAction,
  AuditEntityType,
  AuditLog,
} from "@/features/audit/types";
import {
  filterAuditLogs,
  getAuditActionLabel,
  getAuditEntityLabel,
  getAuditStats,
  getAuditUsers,
  sortAuditLogsByDate,
} from "@/features/audit/utils";

type AuditClientPageProps = {
  logs: AuditLog[];
};

const entityOptions: Array<{ label: string; value: AuditEntityType | "all" }> = [
  { label: "Todas las entidades", value: "all" },
  { label: "Empresa", value: "company" },
  { label: "Contacto", value: "contact" },
  { label: "Oportunidad", value: "opportunity" },
  { label: "Actividad", value: "activity" },
  { label: "Proyecto", value: "project" },
  { label: "Sprint", value: "sprint" },
  { label: "Funcionalidad", value: "feature" },
  { label: "Cobro", value: "payment" },
  { label: "Gasto", value: "expense" },
  { label: "Reparto", value: "payout" },
  { label: "Mantenimiento", value: "maintenance" },
  { label: "Usuario", value: "user" },
  { label: "Configuración", value: "settings" },
];

const actionOptions: Array<{ label: string; value: AuditAction | "all" }> = [
  { label: "Todas las acciones", value: "all" },
  { label: "Creado", value: "created" },
  { label: "Actualizado", value: "updated" },
  { label: "Cambio de estado", value: "statusChanged" },
  { label: "Eliminado", value: "deleted" },
  { label: "Completado", value: "completed" },
  { label: "Cancelado", value: "cancelled" },
  { label: "Cobro registrado", value: "paymentRegistered" },
  { label: "Gasto registrado", value: "expenseRegistered" },
  { label: "Reparto registrado", value: "payoutRegistered" },
  { label: "Mantenimiento pausado", value: "maintenancePaused" },
  { label: "Mantenimiento reanudado", value: "maintenanceResumed" },
  { label: "Periodo perdonado", value: "periodForgiven" },
];

export function AuditClientPage({ logs }: AuditClientPageProps) {
  const [search, setSearch] = useState("");
  const [entityType, setEntityType] = useState<AuditEntityType | "all">("all");
  const [action, setAction] = useState<AuditAction | "all">("all");
  const [userId, setUserId] = useState("all");

  const stats = useMemo(() => getAuditStats(logs), [logs]);
  const users = useMemo(() => getAuditUsers(logs), [logs]);

  const filteredLogs = useMemo(
    () =>
      sortAuditLogsByDate(
        filterAuditLogs({
          logs,
          search,
          entityType,
          action,
          userId,
        }),
      ),
    [logs, search, entityType, action, userId],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Historial"
        title="Auditoría"
        description="Consulta cambios de estado, cobros, gastos, entregas, cancelaciones y acciones internas del CRM."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Eventos registrados"
          value={String(stats.total)}
          description="Cambios mock en el sistema"
          icon={FileClock}
          tone="primary"
          variation="historial"
          variationDirection="flat"
        />

        <MetricCard
          title="Cambios de estado"
          value={String(stats.statusChanges)}
          description="Oportunidades, proyectos, sprints y features"
          icon={GitBranch}
          tone="warning"
          variation="control"
          variationDirection="flat"
        />

        <MetricCard
          title="Eventos financieros"
          value={String(stats.financialEvents)}
          description="Cobros, gastos y repartos"
          icon={Banknote}
          tone="success"
          variation="tesorería"
          variationDirection="flat"
        />

        <MetricCard
          title="Eventos operativos"
          value={String(stats.operationalEvents)}
          description="Actividades, sprints y funcionalidades"
          icon={ListFilter}
          tone="info"
          variation="operación"
          variationDirection="flat"
        />
      </section>

      <section className="overflow-hidden rounded-[2rem] bg-[#071B3A] shadow-2xl shadow-slate-900/10">
        <div className="levdata-gradient h-2" />

        <div className="grid gap-8 p-7 text-white lg:grid-cols-[1fr_0.7fr] lg:p-10">
          <div>
            <p className="text-sm font-medium text-[#A1C7E0]">
              Trazabilidad del CRM
            </p>

            <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              Cada cambio importante debe dejar rastro.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              En backend real, este historial se generará automáticamente cuando
              cambien estados, se registren cobros, se cancelen funcionalidades o
              se modifiquen mantenimientos.
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-white/8 p-5 ring-1 ring-white/10">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white/10 text-[#00ABBD]">
              <ShieldCheck className="size-6" />
            </div>

            <p className="font-extrabold text-white">Preparado para auditoría real</p>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Más adelante lo conectaremos con Supabase y guardaremos cambios
              mediante triggers, funciones o lógica de repositorios.
            </p>
          </div>
        </div>
      </section>

      <section className="levdata-card rounded-[1.75rem] p-4">
        <div className="grid gap-3 xl:grid-cols-[1fr_220px_240px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por entidad, nota, usuario o valores anteriores..."
              className="h-12 rounded-2xl border-[#A1C7E0]/50 bg-white pl-11"
            />
          </div>

          <select
            value={entityType}
            onChange={(event) =>
              setEntityType(event.target.value as AuditEntityType | "all")
            }
            className="h-12 rounded-2xl border border-[#A1C7E0]/50 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none transition focus:border-[#00ABBD] focus:ring-4 focus:ring-cyan-100"
          >
            {entityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value === "all"
                  ? option.label
                  : getAuditEntityLabel(option.value)}
              </option>
            ))}
          </select>

          <select
            value={action}
            onChange={(event) =>
              setAction(event.target.value as AuditAction | "all")
            }
            className="h-12 rounded-2xl border border-[#A1C7E0]/50 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none transition focus:border-[#00ABBD] focus:ring-4 focus:ring-cyan-100"
          >
            {actionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value === "all"
                  ? option.label
                  : getAuditActionLabel(option.value)}
              </option>
            ))}
          </select>

          <select
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            className="h-12 rounded-2xl border border-[#A1C7E0]/50 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none transition focus:border-[#00ABBD] focus:ring-4 focus:ring-cyan-100"
          >
            <option value="all">Todos los usuarios</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {filteredLogs.length > 0 ? (
        <section className="relative space-y-5 before:absolute before:bottom-0 before:left-5 before:top-0 before:w-px before:bg-[#DCEAF1]">
          {filteredLogs.map((log) => (
            <AuditTimelineItem key={log.id} log={log} />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={FileClock}
          title="No hay eventos con estos filtros"
          description="Prueba a cambiar el buscador, la entidad, la acción o el usuario seleccionado."
        />
      )}
    </div>
  );
}