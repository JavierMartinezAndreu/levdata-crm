export type PaymentMethod =
  | "transferencia"
  | "efectivo"
  | "bizum"
  | "stripe"
  | "redsys"
  | "otro";

export type ExpenseType =
  | "puntual"
  | "recurrente"
  | "internoLevData"
  | "asociadoProyecto"
  | "asociadoMantenimiento";

export type ExpenseCategory =
  | "dominio"
  | "hosting"
  | "microsoft365"
  | "sim"
  | "licencia"
  | "plugin"
  | "servidor"
  | "diseno"
  | "subcontratacion"
  | "herramientaIA"
  | "publicidad"
  | "otro";

export type PayoutType =
  | "repartoBeneficio"
  | "sueldo"
  | "reembolso"
  | "bonus"
  | "adelanto";

export type Payment = {
  id: string;
  empresaId: string;
  empresaNombre: string;
  proyectoId: string | null;
  proyectoNombre: string | null;
  sprintId: string | null;
  mantenimientoVencimientoId: string | null;
  importe: number;
  fechaCobro: string;
  metodo: PaymentMethod;
  concepto: string;
  registradoPorId: string;
  registradoPorNombre: string;
  notas: string;
  justificanteUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Expense = {
  id: string;
  empresaId: string | null;
  empresaNombre: string | null;
  proyectoId: string | null;
  proyectoNombre: string | null;
  mantenimientoId: string | null;
  tipo: ExpenseType;
  categoria: ExpenseCategory;
  concepto: string;
  importe: number;
  fecha: string;
  periodicidad: string | null;
  proximaFecha: string | null;
  pagadoPorUsuarioId: string;
  pagadoPorNombre: string;
  esReembolsable: boolean;
  notas: string;
  justificanteUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Payout = {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  importe: number;
  fecha: string;
  concepto: string;
  proyectoId: string | null;
  proyectoNombre: string | null;
  tipo: PayoutType;
  notas: string;
  createdAt: string;
};