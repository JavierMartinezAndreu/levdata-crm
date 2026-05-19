import {
  Activity,
  Banknote,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Contact,
  FileClock,
  FolderKanban,
  GitBranch,
  ListChecks,
  Receipt,
  Settings,
  ShieldCheck,
  Target,
  UserRound,
  Wrench,
  XCircle,
} from "lucide-react";

import type {
  AuditAction,
  AuditEntityType,
  AuditLog,
} from "@/features/audit/types";

type Tone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "dark"
  | "primary";

export function getAuditEntityLabel(entityType: AuditEntityType): string {
  const labels: Record<AuditEntityType, string> = {
    company: "Empresa",
    contact: "Contacto",
    opportunity: "Oportunidad",
    activity: "Actividad",
    project: "Proyecto",
    sprint: "Sprint",
    feature: "Funcionalidad",
    payment: "Cobro",
    expense: "Gasto",
    payout: "Reparto",
    maintenance: "Mantenimiento",
    user: "Usuario",
    settings: "Configuración",
  };

  return labels[entityType];
}

export function getAuditActionLabel(action: AuditAction): string {
  const labels: Record<AuditAction, string> = {
    created: "Creado",
    updated: "Actualizado",
    statusChanged: "Cambio de estado",
    deleted: "Eliminado",
    completed: "Completado",
    cancelled: "Cancelado",
    paymentRegistered: "Cobro registrado",
    expenseRegistered: "Gasto registrado",
    payoutRegistered: "Reparto registrado",
    maintenancePaused: "Mantenimiento pausado",
    maintenanceResumed: "Mantenimiento reanudado",
    periodForgiven: "Periodo perdonado",
  };

  return labels[action];
}

export function getAuditActionTone(action: AuditAction): Tone {
  const tones: Record<AuditAction, Tone> = {
    created: "primary",
    updated: "info",
    statusChanged: "warning",
    deleted: "danger",
    completed: "success",
    cancelled: "danger",
    paymentRegistered: "success",
    expenseRegistered: "danger",
    payoutRegistered: "warning",
    maintenancePaused: "warning",
    maintenanceResumed: "success",
    periodForgiven: "info",
  };

  return tones[action];
}

export function getAuditEntityIcon(entityType: AuditEntityType) {
  const icons: Record<AuditEntityType, typeof Building2> = {
    company: Building2,
    contact: Contact,
    opportunity: Target,
    activity: Activity,
    project: FolderKanban,
    sprint: GitBranch,
    feature: ListChecks,
    payment: CircleDollarSign,
    expense: Receipt,
    payout: Banknote,
    maintenance: Wrench,
    user: UserRound,
    settings: Settings,
  };

  return icons[entityType];
}

export function getAuditActionIcon(action: AuditAction) {
  const icons: Record<AuditAction, typeof CheckCircle2> = {
    created: CheckCircle2,
    updated: FileClock,
    statusChanged: GitBranch,
    deleted: XCircle,
    completed: CheckCircle2,
    cancelled: XCircle,
    paymentRegistered: CircleDollarSign,
    expenseRegistered: Receipt,
    payoutRegistered: Banknote,
    maintenancePaused: Wrench,
    maintenanceResumed: Wrench,
    periodForgiven: ShieldCheck,
  };

  return icons[action];
}

export function getAuditStats(logs: AuditLog[]) {
  return {
    total: logs.length,
    statusChanges: logs.filter((log) => log.action === "statusChanged").length,
    financialEvents: logs.filter((log) =>
      ["paymentRegistered", "expenseRegistered", "payoutRegistered"].includes(
        log.action,
      ),
    ).length,
    operationalEvents: logs.filter((log) =>
      ["project", "sprint", "feature", "activity"].includes(log.entityType),
    ).length,
  };
}

export function filterAuditLogs(params: {
  logs: AuditLog[];
  search: string;
  entityType: AuditEntityType | "all";
  action: AuditAction | "all";
  userId: string;
}) {
  const normalizedSearch = params.search.trim().toLowerCase();

  return params.logs.filter((log) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      log.entityName.toLowerCase().includes(normalizedSearch) ||
      log.note.toLowerCase().includes(normalizedSearch) ||
      log.changedByName.toLowerCase().includes(normalizedSearch) ||
      log.oldValue?.toLowerCase().includes(normalizedSearch) ||
      log.newValue?.toLowerCase().includes(normalizedSearch);

    const matchesEntity =
      params.entityType === "all" || log.entityType === params.entityType;

    const matchesAction =
      params.action === "all" || log.action === params.action;

    const matchesUser =
      params.userId === "all" || log.changedById === params.userId;

    return matchesSearch && matchesEntity && matchesAction && matchesUser;
  });
}

export function sortAuditLogsByDate(logs: AuditLog[]) {
  return [...logs].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime(),
  );
}

export function getAuditUsers(logs: AuditLog[]) {
  return Array.from(
    new Map(
      logs.map((log) => [
        log.changedById,
        {
          id: log.changedById,
          name: log.changedByName,
        },
      ]),
    ).values(),
  ).sort((a, b) => a.name.localeCompare(b.name));
}