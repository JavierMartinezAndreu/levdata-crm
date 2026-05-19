export type MaintenancePeriodicity =
  | "mensual"
  | "trimestral"
  | "semestral"
  | "anual"
  | "personalizada";

export type MaintenanceStatus =
  | "activo"
  | "pausado"
  | "cancelado"
  | "bonificado";

export type MaintenanceDueStatus =
  | "pendiente"
  | "cobrado"
  | "cobradoParcialmente"
  | "perdonado"
  | "vencido"
  | "cancelado";

export type MaintenanceContract = {
  id: string;
  empresaId: string;
  empresaNombre: string;
  proyectoId: string;
  proyectoNombre: string;
  nombre: string;
  descripcion: string;
  precioPorPeriodo: number;
  periodicidad: MaintenancePeriodicity;
  fechaInicio: string;
  proximaFechaCobro: string;
  estado: MaintenanceStatus;
  horasIncluidas: number;
  queIncluye: string[];
  queNoIncluye: string[];
  deudaAcumulada: number;
  notas: string;
  createdAt: string;
  updatedAt: string;
};

export type MaintenanceDue = {
  id: string;
  mantenimientoId: string;
  periodoInicio: string;
  periodoFin: string;
  fechaVencimiento: string;
  importeEsperado: number;
  importeCobrado: number;
  estado: MaintenanceDueStatus;
  notas: string;
  createdAt: string;
  updatedAt: string;
};