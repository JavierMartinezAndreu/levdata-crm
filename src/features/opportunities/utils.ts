import type {
  Opportunity,
  OpportunityStatus,
  OpportunityTemperature,
} from "@/features/opportunities/types";

export const opportunityStatusOrder: OpportunityStatus[] = [
  "detectada",
  "contactada",
  "reunionAgendada",
  "diagnosticoHecho",
  "propuestaEnviada",
  "negociacion",
  "ganada",
  "perdida",
  "pospuesta",
  "noEncaja",
];

export function getOpportunityStatusLabel(status: OpportunityStatus): string {
  const labels: Record<OpportunityStatus, string> = {
    detectada: "Detectada",
    contactada: "Contactada",
    reunionAgendada: "Reunión agendada",
    diagnosticoHecho: "Diagnóstico hecho",
    propuestaEnviada: "Propuesta enviada",
    negociacion: "Negociación",
    ganada: "Ganada",
    perdida: "Perdida",
    pospuesta: "Pospuesta",
    noEncaja: "No encaja",
  };

  return labels[status];
}

export function getOpportunityStatusTone(
  status: OpportunityStatus,
): "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary" {
  const tones: Record<
    OpportunityStatus,
    "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary"
  > = {
    detectada: "info",
    contactada: "primary",
    reunionAgendada: "primary",
    diagnosticoHecho: "warning",
    propuestaEnviada: "warning",
    negociacion: "dark",
    ganada: "success",
    perdida: "danger",
    pospuesta: "neutral",
    noEncaja: "neutral",
  };

  return tones[status];
}

export function getTemperatureLabel(
  temperature: OpportunityTemperature,
): string {
  const labels: Record<OpportunityTemperature, string> = {
    fria: "Fría",
    templada: "Templada",
    caliente: "Caliente",
  };

  return labels[temperature];
}

export function getTemperatureTone(
  temperature: OpportunityTemperature,
): "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary" {
  const tones: Record<
    OpportunityTemperature,
    "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary"
  > = {
    fria: "info",
    templada: "warning",
    caliente: "danger",
  };

  return tones[temperature];
}

export function getOpportunityStats(opportunities: Opportunity[]) {
  const open = opportunities.filter(
    (opportunity) =>
      !["ganada", "perdida", "noEncaja"].includes(opportunity.estado),
  );

  const openValue = open.reduce(
    (total, opportunity) => total + opportunity.valorEstimado,
    0,
  );

  const weightedValue = open.reduce(
    (total, opportunity) =>
      total + opportunity.valorEstimado * (opportunity.probabilidad / 100),
    0,
  );

  const proposalsSent = opportunities.filter(
    (opportunity) => opportunity.estado === "propuestaEnviada",
  ).length;

  const hot = opportunities.filter(
    (opportunity) => opportunity.temperatura === "caliente",
  ).length;

  return {
    total: opportunities.length,
    open: open.length,
    openValue,
    weightedValue,
    proposalsSent,
    hot,
  };
}

export function groupOpportunitiesByStatus(opportunities: Opportunity[]) {
  return opportunityStatusOrder.map((status) => ({
    status,
    label: getOpportunityStatusLabel(status),
    opportunities: opportunities.filter(
      (opportunity) => opportunity.estado === status,
    ),
  }));
}

export function filterOpportunities(params: {
  opportunities: Opportunity[];
  search: string;
  status: OpportunityStatus | "all";
  temperature: OpportunityTemperature | "all";
}) {
  const normalizedSearch = params.search.trim().toLowerCase();

  return params.opportunities.filter((opportunity) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      opportunity.nombre.toLowerCase().includes(normalizedSearch) ||
      opportunity.empresaNombre.toLowerCase().includes(normalizedSearch) ||
      opportunity.descripcion.toLowerCase().includes(normalizedSearch) ||
      opportunity.responsableNombre.toLowerCase().includes(normalizedSearch);

    const matchesStatus =
      params.status === "all" || opportunity.estado === params.status;

    const matchesTemperature =
      params.temperature === "all" ||
      opportunity.temperatura === params.temperature;

    return matchesSearch && matchesStatus && matchesTemperature;
  });
}