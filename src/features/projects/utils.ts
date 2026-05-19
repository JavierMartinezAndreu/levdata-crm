import type {
  Feature,
  FeaturePriority,
  FeatureStatus,
  Project,
  ProjectStatus,
  Sprint,
  SprintStatus,
} from "@/features/projects/types";

export function getProjectStatusLabel(status: ProjectStatus): string {
  const labels: Record<ProjectStatus, string> = {
    presupuestado: "Presupuestado",
    aceptado: "Aceptado",
    enDesarrollo: "En desarrollo",
    pausado: "Pausado",
    entregado: "Entregado",
    enMantenimiento: "En mantenimiento",
    cerrado: "Cerrado",
    cancelado: "Cancelado",
  };

  return labels[status];
}

export function getSprintStatusLabel(status: SprintStatus): string {
  const labels: Record<SprintStatus, string> = {
    planificado: "Planificado",
    enCurso: "En curso",
    entregado: "Entregado",
    pausado: "Pausado",
    cancelado: "Cancelado",
  };

  return labels[status];
}

export function getFeatureStatusLabel(status: FeatureStatus): string {
  const labels: Record<FeatureStatus, string> = {
    planificada: "Planificada",
    enDesarrollo: "En desarrollo",
    desarrollada: "Desarrollada",
    entregada: "Entregada",
    cancelada: "Cancelada",
  };

  return labels[status];
}

export function getFeaturePriorityLabel(priority: FeaturePriority): string {
  const labels: Record<FeaturePriority, string> = {
    baja: "Baja",
    media: "Media",
    alta: "Alta",
    critica: "Crítica",
  };

  return labels[priority];
}

export function getProjectStatusTone(
  status: ProjectStatus,
): "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary" {
  const tones: Record<
    ProjectStatus,
    "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary"
  > = {
    presupuestado: "info",
    aceptado: "primary",
    enDesarrollo: "warning",
    pausado: "neutral",
    entregado: "success",
    enMantenimiento: "dark",
    cerrado: "success",
    cancelado: "danger",
  };

  return tones[status];
}

export function getSprintStatusTone(
  status: SprintStatus,
): "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary" {
  const tones: Record<
    SprintStatus,
    "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary"
  > = {
    planificado: "info",
    enCurso: "warning",
    entregado: "success",
    pausado: "neutral",
    cancelado: "danger",
  };

  return tones[status];
}

export function getFeatureStatusTone(
  status: FeatureStatus,
): "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary" {
  const tones: Record<
    FeatureStatus,
    "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary"
  > = {
    planificada: "info",
    enDesarrollo: "warning",
    desarrollada: "primary",
    entregada: "success",
    cancelada: "danger",
  };

  return tones[status];
}

export function getFeaturePriorityTone(
  priority: FeaturePriority,
): "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary" {
  const tones: Record<
    FeaturePriority,
    "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary"
  > = {
    baja: "neutral",
    media: "info",
    alta: "warning",
    critica: "danger",
  };

  return tones[priority];
}

export function getProjectSprints(projectId: string, sprints: Sprint[]) {
  return sprints
    .filter((sprint) => sprint.proyectoId === projectId)
    .sort((a, b) => a.orden - b.orden);
}

export function getProjectFeatures(projectId: string, features: Feature[]) {
  return features
    .filter((feature) => feature.proyectoId === projectId)
    .sort((a, b) => a.orden - b.orden);
}

export function getSprintFeatures(sprintId: string, features: Feature[]) {
  return features
    .filter((feature) => feature.sprintId === sprintId)
    .sort((a, b) => a.orden - b.orden);
}

export function getTechnicalProgress(features: Feature[]): number {
  const validFeatures = features.filter((feature) => feature.estado !== "cancelada");

  if (validFeatures.length === 0) return 0;

  const score = validFeatures.reduce((total, feature) => {
    if (feature.estado === "entregada") return total + 1;
    if (feature.estado === "desarrollada") return total + 0.75;
    if (feature.estado === "enDesarrollo") return total + 0.4;
    return total;
  }, 0);

  return Math.round((score / validFeatures.length) * 100);
}

export function getDeliveryProgress(features: Feature[]): number {
  const validFeatures = features.filter((feature) => feature.estado !== "cancelada");

  if (validFeatures.length === 0) return 0;

  const delivered = validFeatures.filter(
    (feature) => feature.estado === "entregada",
  ).length;

  return Math.round((delivered / validFeatures.length) * 100);
}

export function getPaymentProgress(totalBudget: number, collected: number): number {
  if (totalBudget <= 0) return 0;

  return Math.round(Math.min(100, (collected / totalBudget) * 100));
}

export function getProjectStats(projects: Project[]) {
  return {
    active: projects.filter((project) =>
      ["aceptado", "enDesarrollo", "enMantenimiento"].includes(project.estado),
    ).length,
    paused: projects.filter((project) => project.estado === "pausado").length,
    deliveredThisMonth: projects.filter(
      (project) =>
        project.fechaEntregaReal?.startsWith("2026-05") ||
        project.estado === "entregado",
    ).length,
    pendingPayment: projects.reduce(
      (total, project) => total + (project.totalPresupuestado - project.totalCobrado),
      0,
    ),
    estimatedProfit: projects.reduce(
      (total, project) =>
        total + (project.totalCobrado - project.gastos),
      0,
    ),
  };
}

export function filterProjects(params: {
  projects: Project[];
  search: string;
  status: ProjectStatus | "all";
}) {
  const normalizedSearch = params.search.trim().toLowerCase();

  return params.projects.filter((project) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      project.nombre.toLowerCase().includes(normalizedSearch) ||
      project.empresaNombre.toLowerCase().includes(normalizedSearch) ||
      project.descripcion.toLowerCase().includes(normalizedSearch) ||
      project.responsableNombre.toLowerCase().includes(normalizedSearch);

    const matchesStatus =
      params.status === "all" || project.estado === params.status;

    return matchesSearch && matchesStatus;
  });
}