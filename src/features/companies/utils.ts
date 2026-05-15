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