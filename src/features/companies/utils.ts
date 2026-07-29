import type {
  Company,
  CompanyPotential,
  CompanyStatus,
} from "@/features/companies/types";

export function getCompanyStatusLabel(status: CompanyStatus): string {
  const labels: Record<CompanyStatus, string> = {
    prospecto: "Prospecto",
    enConversacion: "En conversación",
    clienteActivo: "Cliente activo",
    clienteEnPausa: "Cliente en pausa",
    noEncaja: "No encaja",
    perdido: "Perdido",
    partner: "Partner",
  };

  return labels[status];
}

export function getCompanyPotentialLabel(potential: CompanyPotential): string {
  const labels: Record<CompanyPotential, string> = {
    bajo: "Bajo",
    medio: "Medio",
    alto: "Alto",
    estrategico: "Estratégico",
  };

  return labels[potential];
}

export function getCompanyStatusTone(
  status: CompanyStatus,
): "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary" {
  const tones: Record<
    CompanyStatus,
    "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary"
  > = {
    prospecto: "info",
    enConversacion: "primary",
    clienteActivo: "success",
    clienteEnPausa: "warning",
    noEncaja: "neutral",
    perdido: "danger",
    partner: "dark",
  };

  return tones[status];
}

export function getCompanyPotentialTone(
  potential: CompanyPotential,
): "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary" {
  const tones: Record<
    CompanyPotential,
    "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary"
  > = {
    bajo: "neutral",
    medio: "info",
    alto: "warning",
    estrategico: "dark",
  };

  return tones[potential];
}

export function getCompanyStats(companies: Company[]) {
  return {
    total: companies.length,
    activeClients: companies.filter((company) => company.estado === "clienteActivo")
      .length,
    openOpportunities: companies.reduce(
      (total, company) => total + company.oportunidadesAbiertas,
      0,
    ),
    pendingPayment: companies.reduce(
      (total, company) => total + company.pendienteCobro,
      0,
    ),
  };
}

export function filterCompanies(params: {
  companies: Company[];
  search: string;
  status: CompanyStatus | "all";
  potential: CompanyPotential | "all";
}) {
  const normalizedSearch = params.search.trim().toLowerCase();

  return params.companies.filter((company) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      company.nombreComercial.toLowerCase().includes(normalizedSearch) ||
      company.razonSocial.toLowerCase().includes(normalizedSearch) ||
      company.sector.toLowerCase().includes(normalizedSearch) ||
      company.localidad.toLowerCase().includes(normalizedSearch) ||
      company.provincia.toLowerCase().includes(normalizedSearch);

    const matchesStatus =
      params.status === "all" || company.estado === params.status;

    const matchesPotential =
      params.potential === "all" || company.potencial === params.potential;

    return matchesSearch && matchesStatus && matchesPotential;
  });
}

import type {
  CompanyDb,
  CompanyDbPotential,
  CompanyDbStatus,
} from "@/features/companies/types";

export function getCompanyDbStatusLabel(status: CompanyDbStatus): string {
  const labels: Record<CompanyDbStatus, string> = {
    prospecto: "Prospecto",
    contactado: "Contactado",
    oportunidad: "Oportunidad",
    cliente: "Cliente",
    inactivo: "Inactivo",
    descartado: "Descartado",
  };

  return labels[status];
}

export function getCompanyDbPotentialLabel(
  potential: CompanyDbPotential,
): string {
  const labels: Record<CompanyDbPotential, string> = {
    bajo: "Bajo",
    medio: "Medio",
    alto: "Alto",
    estrategico: "Estratégico",
  };

  return labels[potential];
}

export function getCompanyDbStatusTone(
  status: CompanyDbStatus,
): "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary" {
  const tones: Record<
    CompanyDbStatus,
    "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary"
  > = {
    prospecto: "info",
    contactado: "primary",
    oportunidad: "warning",
    cliente: "success",
    inactivo: "neutral",
    descartado: "danger",
  };

  return tones[status];
}

export function getCompanyDbPotentialTone(
  potential: CompanyDbPotential,
): "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary" {
  const tones: Record<
    CompanyDbPotential,
    "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary"
  > = {
    bajo: "neutral",
    medio: "info",
    alto: "warning",
    estrategico: "dark",
  };

  return tones[potential];
}

export function getRealCompanyStats(companies: CompanyDb[]) {
  return {
    total: companies.length,
    prospects: companies.filter((company) => company.status === "prospecto")
      .length,
    opportunities: companies.filter((company) => company.status === "oportunidad")
      .length,
    clients: companies.filter((company) => company.status === "cliente").length,
  };
}

export function filterRealCompanies(params: {
  companies: CompanyDb[];
  search: string;
  status: CompanyDbStatus | "all";
  potential: CompanyDbPotential | "all";
}) {
  const normalizedSearch = params.search.trim().toLowerCase();

  return params.companies.filter((company) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      company.commercial_name.toLowerCase().includes(normalizedSearch) ||
      (company.legal_name ?? "").toLowerCase().includes(normalizedSearch) ||
      (company.tax_id ?? "").toLowerCase().includes(normalizedSearch) ||
      (company.email ?? "").toLowerCase().includes(normalizedSearch) ||
      (company.phone ?? "").toLowerCase().includes(normalizedSearch) ||
      (company.sector ?? "").toLowerCase().includes(normalizedSearch) ||
      (company.city ?? "").toLowerCase().includes(normalizedSearch) ||
      (company.province ?? "").toLowerCase().includes(normalizedSearch);

    const matchesStatus =
      params.status === "all" || company.status === params.status;

    const matchesPotential =
      params.potential === "all" || company.potential === params.potential;

    return matchesSearch && matchesStatus && matchesPotential;
  });
}