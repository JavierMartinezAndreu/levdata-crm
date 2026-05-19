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