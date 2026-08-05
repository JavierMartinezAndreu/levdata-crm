export type ProjectStatus =
  | "presupuestado"
  | "aceptado"
  | "enDesarrollo"
  | "pausado"
  | "entregado"
  | "enMantenimiento"
  | "cerrado"
  | "cancelado";

export type SprintStatus =
  | "planificado"
  | "enCurso"
  | "entregado"
  | "pausado"
  | "cancelado";

export type FeatureStatus =
  | "planificada"
  | "enDesarrollo"
  | "desarrollada"
  | "entregada"
  | "cancelada";

export type FeaturePriority = "baja" | "media" | "alta" | "critica";

export type Project = {
  id: string;
  empresaId: string;
  empresaNombre: string;
  oportunidadOrigenId: string | null;
  nombre: string;
  descripcion: string;
  estado: ProjectStatus;
  responsableId: string;
  responsableNombre: string;
  contactoPrincipalId: string | null;
  contactoPrincipalNombre: string;
  fechaInicio: string;
  fechaObjetivo: string;
  fechaEntregaReal: string | null;
  repositorioUrl: string;
  stagingUrl: string;
  produccionUrl: string;
  notasPrivadas: string;
  totalPresupuestado: number;
  totalCobrado: number;
  gastos: number;
  createdAt: string;
  updatedAt: string;
};

export type Sprint = {
  id: string;
  proyectoId: string;
  nombre: string;
  descripcion: string;
  orden: number;
  estado: SprintStatus;
  fechaInicioPrevista: string;
  fechaEntregaPrevista: string;
  fechaEntregaReal: string | null;
  precioPresupuestado: number;
  cobrado: number;
  createdAt: string;
  updatedAt: string;
};

export type Feature = {
  id: string;
  sprintId: string;
  proyectoId: string;
  titulo: string;
  descripcion: string;
  estado: FeatureStatus;
  prioridad: FeaturePriority;
  responsableId: string;
  responsableNombre: string;
  orden: number;
  fechaCreacion: string;
  fechaInicio: string | null;
  fechaDesarrollada: string | null;
  fechaEntregada: string | null;
  fechaCancelada: string | null;
  motivoCancelacion: string | null;
  notasTecnicas: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectDb = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  company_id: string;
  opportunity_id: string | null;
  contact_id: string | null;
  created_by: string | null;
  assigned_to: string | null;
  name: string;
  description: string | null;
  status: ProjectStatus;
  health: string;
  start_date: string | null;
  target_date: string | null;
  delivered_at: string | null;
  repository_url: string | null;
  staging_url: string | null;
  production_url: string | null;
  private_notes: string | null;
  budget_total: number;
  collected_total: number;
  expenses_total: number;
  manual_progress: number;
  notes: string | null;
};

export type SprintDb = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  project_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  status: SprintStatus;
  planned_start_date: string | null;
  planned_delivery_date: string | null;
  delivered_at: string | null;
  budget_amount: number;
  collected_amount: number;
};

export type FeatureDb = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  project_id: string;
  sprint_id: string | null;
  title: string;
  description: string | null;
  status: FeatureStatus;
  priority: FeaturePriority;
  assigned_to: string | null;
  sort_order: number;
  started_at: string | null;
  developed_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  technical_notes: string | null;
};

export type ProjectFormValues = {
  company_id: string;
  opportunity_id: string;
  contact_id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  start_date: string;
  target_date: string;
  delivered_at: string;
  repository_url: string;
  staging_url: string;
  production_url: string;
  private_notes: string;
  budget_total: string;
  collected_total: string;
  expenses_total: string;
};

export type SprintFormValues = {
  project_id: string;
  name: string;
  description: string;
  sort_order: string;
  status: SprintStatus;
  planned_start_date: string;
  planned_delivery_date: string;
  delivered_at: string;
  budget_amount: string;
  collected_amount: string;
};

export type FeatureFormValues = {
  project_id: string;
  sprint_id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  priority: FeaturePriority;
  sort_order: string;
  started_at: string;
  developed_at: string;
  delivered_at: string;
  cancelled_at: string;
  cancellation_reason: string;
  technical_notes: string;
};

export type ProjectListItem = {
  project: ProjectDb;
  company: {
    id: string;
    commercial_name: string;
  } | null;
  opportunity: {
    id: string;
    title: string;
  } | null;
  contact: {
    id: string;
    full_name: string;
  } | null;
  sprints: SprintDb[];
  features: FeatureDb[];
};

export type ProjectDetailData = ProjectListItem;