import type {
  MaintenanceContract,
  MaintenanceDue,
  MaintenanceDueStatus,
  MaintenancePeriodicity,
  MaintenanceStatus,
} from "@/features/maintenance/types";

type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary";

export function getMaintenanceStatusLabel(status: MaintenanceStatus): string {
  const labels: Record<MaintenanceStatus, string> = {
    activo: "Activo",
    pausado: "Pausado",
    cancelado: "Cancelado",
    bonificado: "Bonificado",
  };

  return labels[status];
}

export function getMaintenanceDueStatusLabel(status: MaintenanceDueStatus): string {
  const labels: Record<MaintenanceDueStatus, string> = {
    pendiente: "Pendiente",
    cobrado: "Cobrado",
    cobradoParcialmente: "Cobrado parcialmente",
    perdonado: "Perdonado",
    vencido: "Vencido",
    cancelado: "Cancelado",
  };

  return labels[status];
}

export function getPeriodicityLabel(periodicity: MaintenancePeriodicity): string {
  const labels: Record<MaintenancePeriodicity, string> = {
    mensual: "Mensual",
    trimestral: "Trimestral",
    semestral: "Semestral",
    anual: "Anual",
    personalizada: "Personalizada",
  };

  return labels[periodicity];
}

export function getMaintenanceStatusTone(status: MaintenanceStatus): Tone {
  const tones: Record<MaintenanceStatus, Tone> = {
    activo: "success",
    pausado: "warning",
    cancelado: "danger",
    bonificado: "info",
  };

  return tones[status];
}

export function getMaintenanceDueStatusTone(status: MaintenanceDueStatus): Tone {
  const tones: Record<MaintenanceDueStatus, Tone> = {
    pendiente: "warning",
    cobrado: "success",
    cobradoParcialmente: "primary",
    perdonado: "info",
    vencido: "danger",
    cancelado: "neutral",
  };

  return tones[status];
}

export function getContractDues(
  contractId: string,
  dues: MaintenanceDue[],
): MaintenanceDue[] {
  return dues
    .filter((due) => due.mantenimientoId === contractId)
    .sort(
      (a, b) =>
        new Date(b.fechaVencimiento).getTime() -
        new Date(a.fechaVencimiento).getTime(),
    );
}

export function getContractCurrentDue(
  contractId: string,
  dues: MaintenanceDue[],
): MaintenanceDue | undefined {
  return getContractDues(contractId, dues).find((due) =>
    ["pendiente", "vencido", "cobradoParcialmente"].includes(due.estado),
  );
}

export function getMaintenanceStats(
  contracts: MaintenanceContract[],
  dues: MaintenanceDue[],
) {
  const active = contracts.filter((contract) => contract.estado === "activo");
  const paused = contracts.filter((contract) => contract.estado === "pausado");
  const overdue = dues.filter((due) => due.estado === "vencido");
  const partial = dues.filter((due) => due.estado === "cobradoParcialmente");

  const monthlyEquivalent = contracts.reduce((total, contract) => {
    if (contract.estado === "cancelado") return total;

    if (contract.periodicidad === "mensual") return total + contract.precioPorPeriodo;
    if (contract.periodicidad === "trimestral") return total + contract.precioPorPeriodo / 3;
    if (contract.periodicidad === "semestral") return total + contract.precioPorPeriodo / 6;
    if (contract.periodicidad === "anual") return total + contract.precioPorPeriodo / 12;

    return total + contract.precioPorPeriodo;
  }, 0);

  const debt = dues.reduce((total, due) => {
    if (!["pendiente", "vencido", "cobradoParcialmente"].includes(due.estado)) {
      return total;
    }

    return total + Math.max(0, due.importeEsperado - due.importeCobrado);
  }, 0);

  return {
    active: active.length,
    paused: paused.length,
    overdue: overdue.length,
    partial: partial.length,
    debt,
    mrr: Math.round(monthlyEquivalent),
    arr: Math.round(monthlyEquivalent * 12),
  };
}

export function filterMaintenanceContracts(params: {
  contracts: MaintenanceContract[];
  search: string;
  status: MaintenanceStatus | "all";
}) {
  const normalizedSearch = params.search.trim().toLowerCase();

  return params.contracts.filter((contract) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      contract.nombre.toLowerCase().includes(normalizedSearch) ||
      contract.empresaNombre.toLowerCase().includes(normalizedSearch) ||
      contract.proyectoNombre.toLowerCase().includes(normalizedSearch) ||
      contract.descripcion.toLowerCase().includes(normalizedSearch);

    const matchesStatus =
      params.status === "all" || contract.estado === params.status;

    return matchesSearch && matchesStatus;
  });
}